"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Forminit } from "forminit"
import { trackEvent } from "@/lib/analytics"
import { contactEmail, site, whatsappHref } from "@/lib/content/site"
import { HONEYPOT_FIELD, LIMITS, clean, looksLikeBot, validateLead, type LeadErrors } from "@/lib/lead-validation"
import { trackWhatsappClick } from "@/lib/whatsapp"
import type { LeadType } from "@/lib/content/products"

/**
 * Sección de contacto de la landing V2 ("04 — HABLEMOS").
 * Reutiliza el manejo del sitio: mismo proxy /api/forminit (validación en servidor), misma copia a la planilla
 * (/api/lead) y los mismos eventos (form_start, form_submit, generate_lead, form_error, whatsapp_click).
 * Lo único nuevo es `source`: "landing" distingue estas consultas de las del sitio ("contacto", "home", "productos"…).
 */
const SOURCE = "landing"
const forminit = new Forminit({ proxyUrl: "/api/forminit" })

/** `label` = lo que ve la persona. `type` = valor canónico que se guarda en Forminit y en la planilla (igual que el resto del sitio). */
const options: { label: string; type: string; leadType: LeadType; service: string }[] = [
  { label: "Desarrollo web", type: "Sitio web", leadType: "web", service: "sitio-web" },
  { label: "Sistema a medida", type: "Sistema a medida", leadType: "software", service: "sistema-a-medida" },
  { label: "IA y automatización", type: "Automatización", leadType: "software", service: "automatizacion" },
  { label: "E-commerce", type: "Tienda online", leadType: "web", service: "tienda-online" },
  { label: "Nexo / Nodo", type: "Producto Kodexa (Nexo / Nodo)", leadType: "product", service: "productos" },
  { label: "Tengo una idea", type: "Otro", leadType: "other", service: "otro" },
]

const icons = [
  <i key="0" className="block h-[15px] w-5 rounded-[3px] border-[1.5px] border-t-4 border-[#0A0A0A]" />,
  <i key="1" className="grid h-[18px] w-[18px] grid-cols-2 gap-[3px]"><b className="bg-[#0A0A0A]" /><b className="bg-[#FF5A1F]" /><b className="bg-[#FF5A1F]" /><b className="bg-[#0A0A0A]" /></i>,
  <i key="2" className="block h-4 w-4 rotate-45 rounded-[3px] bg-[#0A0A0A] shadow-[6px_-6px_0_-3px_#FF5A1F]" />,
  <i key="3" className="mt-[3px] block h-3.5 w-[18px] rounded-b-[5px] rounded-t-sm border-[1.5px] border-[#0A0A0A]" />,
  <span key="4" className="flex items-center"><i className="block h-3 w-3 rounded-sm bg-[#FF5A1F]" /><i className="-ml-[3px] block h-[13px] w-[13px] rounded-full border-[1.5px] border-[#0A0A0A]" /></span>,
  <i key="5" className="block h-[18px] w-[18px] rounded-full border-[1.5px] border-dashed border-[#0A0A0A]" />,
]

const field =
  "h-[54px] w-full rounded-xl border border-[#DCDCD8] bg-[#FAFAF8] px-4 text-base text-[#0A0A0A] outline-none transition hover:border-[#9B9B96] focus:border-[#0A0A0A] focus:bg-white focus:ring-[3px] focus:ring-[#FF5A1F]/25 aria-[invalid=true]:border-red-600"
const label = "text-xs font-medium tracking-[0.08em] text-[#5E5E5A]"
const waText = "Hola, quiero iniciar una conversación con Kodexa"

export function LandingContact() {
  const uid = useId()
  const id = (n: string) => `${uid}-${n}`
  const [sel, setSel] = useState(0)
  const [v, setV] = useState({ name: "", business: "", email: "", message: "" })
  const [attempted, setAttempted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const startedAt = useRef(0)
  const startedTracked = useRef(false)
  const lock = useRef(false)
  const savedKey = useRef("")
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const set = (k: keyof typeof v, val: string) => setV((p) => ({ ...p, [k]: val }))
  const choice = options[sel]

  const check = (): LeadErrors =>
    validateLead(
      { name: v.name, business: v.business, contactMethod: "email", email: v.email, whatsapp: "", message: v.message, projectType: choice.type },
      { requireProjectType: true },
    )
  const errors: LeadErrors = attempted ? check() : {}
  const bad = (k: keyof LeadErrors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": id(`${k}-err`) } : {})
  const err = (k: keyof LeadErrors) => (errors[k] ? <p id={id(`${k}-err`)} className="mt-2 text-sm text-red-700">{errors[k]}</p> : null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (lock.current) return
    setError(null)

    // Bots: campo trampa completo o envío instantáneo → simulamos éxito sin enviar nada.
    const honeypot = formRef.current ? new FormData(formRef.current).get(HONEYPOT_FIELD) : ""
    if (looksLikeBot(honeypot, startedAt.current)) {
      setDone(true)
      return
    }

    setAttempted(true)
    const found = check()
    const keys = Object.keys(found)
    if (keys.length) {
      trackEvent("form_error", { form_source: SOURCE, error_type: "validation", error_fields: keys.join(",") })
      const first = (["name", "business", "email", "message"] as const).find((k) => found[k])
      if (first) document.getElementById(id(first))?.focus()
      return
    }

    const n = { name: clean(v.name), business: clean(v.business), email: clean(v.email).toLowerCase(), message: v.message.trim() }
    const key = JSON.stringify({ ...n, type: choice.type })
    lock.current = true
    setBusy(true)
    try {
      if (savedKey.current !== key) {
        const data = new FormData()
        data.set("fi-sender-fullName", n.name)
        data.set("fi-sender-email", n.email)
        if (n.business) data.set("fi-text-business", n.business)
        data.set("fi-select-projectType", choice.type)
        if (n.message) data.set("fi-text-message", n.message)
        data.set("fi-text-leadType", choice.leadType)
        data.set("fi-text-source", SOURCE)
        data.set("fi-text-contactMethod", "email")
        data.set("fi-text-action", "contact_me")
        data.set("fi-text-status", "nuevo")
        const { error: fiError } = await forminit.submit(site.forminitFormId, data)
        if (fiError) throw new Error("forminit")
        savedKey.current = key

        // Ya está guardada en Forminit: desde acá solo se mide y se copia a la planilla.
        const params = { form_source: SOURCE, contact_method: "email", project_type: choice.type, lead_type: choice.leadType, action: "contact_me" }
        trackEvent("form_submit", params)
        trackEvent("generate_lead", params)
        void fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            ...n,
            whatsapp: "",
            budget: "",
            projectType: choice.type,
            contactMethod: "email",
            source: SOURCE,
            productInterest: "",
            page: window.location.pathname,
            action: "contact_me",
          }),
        }).catch(() => {})
      }
      setDone(true)
    } catch {
      trackEvent("form_error", { form_source: SOURCE, error_type: "server" })
      setError("No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.")
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  function reset() {
    setDone(false)
    setAttempted(false)
    setV({ name: "", business: "", email: "", message: "" })
    savedKey.current = ""
    startedAt.current = Date.now()
  }

  const wa = (location: string, labelId: string) => ({
    href: whatsappHref(waText),
    target: "_blank" as const,
    rel: "noopener noreferrer",
    onClick: () => trackWhatsappClick({ location, label: labelId, service: choice.service }),
  })

  return (
    <section id="contacto" className="flex flex-col bg-[#F4F4F1] font-sans lg:flex-row">
      {/* Propuesta */}
      <div className="relative flex flex-col bg-[#0A0A0A] px-5 pb-24 pt-16 text-white lg:w-[640px] lg:flex-none lg:py-24 lg:pl-20 lg:pr-32">
        <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.12em] text-[#FF5A1F]">
          <i className="block h-[7px] w-[7px] rounded-full bg-[#FF5A1F]" /> 04 — HABLEMOS
        </span>
        <h2 className="mt-5 text-[40px] font-semibold leading-[42px] tracking-[-0.035em] lg:mt-7 lg:text-[50px] lg:leading-[53px]">
          ¿Tenés un proyecto en mente? <span className="text-[#6f6f6a]">Hagámoslo realidad.</span>
        </h2>
        <p className="mt-5 max-w-[400px] text-base leading-[25px] text-[#9B9B96] lg:mt-6 lg:text-lg lg:leading-7">
          Contanos qué necesitás. Nos interesa entender tu negocio antes de proponerte una solución.
        </p>
        <a
          {...wa("landing_contact", "landing_whatsapp_primary")}
          data-event="whatsapp_click"
          className="mt-7 flex h-[58px] max-w-[420px] items-center justify-between gap-5 rounded-[14px] bg-[#FF5A1F] px-6 text-[17px] font-medium text-[#0A0A0A] shadow-[0_18px_36px_-16px_rgba(255,90,31,0.7)] transition hover:-translate-y-0.5 hover:bg-[#FF6F3C] lg:mt-10 lg:h-16"
        >
          <span className="flex items-center gap-3"><i className="block h-[18px] w-[18px] rounded-[50%_50%_50%_4px] bg-[#0A0A0A]" />Hablemos por WhatsApp</span>
          <span className="text-xl">→</span>
        </a>
        <span className="mt-3 text-[13px] text-[#6f6f6a]">Conversación directa, sin esperar respuesta por mail.</span>
        <div className="mt-9 flex flex-col gap-3.5 text-[15px] lg:mt-[72px]">
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} onClick={() => trackEvent("email_click", { cta_location: "landing_contact" })} className="self-start border-b border-[#3a3a37] pb-[3px] transition hover:border-[#FF5A1F] hover:text-[#FF5A1F]">
              {contactEmail}
            </a>
          )}
          <span className="text-[13px] leading-[21px] text-[#6f6f6a]">
            Web · Sistemas a medida · IA · E-commerce &nbsp;
            <a href="#servicios" className="border-b border-[#3a3a37] text-[#9B9B96]">Ver servicios</a>
          </span>
        </div>
        <i className="absolute bottom-0 left-0 hidden h-24 w-24 rounded-tr-[96px] bg-[#FF5A1F] lg:block" />
      </div>

      {/* Formulario */}
      <div className="relative z-10 -mt-12 px-4 pb-16 lg:mt-0 lg:-ml-[72px] lg:flex-1 lg:py-24 lg:pl-0 lg:pr-20">
        <div className="rounded-[20px] border border-[#E8E8E3] bg-white p-6 shadow-[0_1px_2px_rgba(10,10,10,0.04),0_40px_80px_-40px_rgba(10,10,10,0.28)] lg:rounded-3xl lg:p-11">
          {done ? (
            <div role="status" className="flex flex-col items-start gap-5 py-8 lg:py-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5A1F] text-[22px] font-semibold">✓</span>
              <h3 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] lg:text-[32px]">Recibimos tu consulta.</h3>
              <p className="max-w-[420px] text-base leading-[25px] text-[#5E5E5A]">
                Te vamos a escribir para entender tu negocio antes de proponerte nada. Si preferís ir más rápido, seguimos por WhatsApp.
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <a {...wa("landing_contact", "landing_whatsapp_confirmation")} className="flex h-[52px] items-center gap-5 rounded-[14px] bg-[#FF5A1F] px-5 text-[15px] font-medium text-[#0A0A0A] transition hover:bg-[#FF6F3C]">
                  Seguir por WhatsApp <span>→</span>
                </a>
                <button type="button" onClick={reset} className="py-2 text-sm font-medium text-[#5E5E5A] underline">Enviar otra consulta</button>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              noValidate
              onSubmit={onSubmit}
              onFocus={(e) => {
                if (startedTracked.current || (e.target as HTMLElement).getAttribute("name") === HONEYPOT_FIELD) return
                startedTracked.current = true
                trackEvent("form_start", { form_source: SOURCE })
              }}
              className="flex flex-col gap-5"
            >
              {/* Anti-spam: invisible para personas. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={id("hp")}>No completar este campo</label>
                <input id={id("hp")} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              <h3 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] lg:text-[34px]">Empecemos por conocernos.</h3>

              <div role="radiogroup" aria-labelledby={id("q")} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span id={id("q")} className={label}>¿QUÉ NECESITÁS DESARROLLAR?</span>
                  <span className="text-xs text-[#9B9B96]">Elegí una</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
                  {options.map((o, i) => {
                    const on = i === sel
                    return (
                      <button
                        key={o.label}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          setSel(i)
                          trackEvent("project_type_select", { form_source: SOURCE, project_type: o.type })
                        }}
                        className={`relative flex min-h-[88px] flex-col items-start justify-between gap-3.5 rounded-[14px] border p-3.5 text-left text-[15px] font-medium leading-[19px] text-[#0A0A0A] transition hover:-translate-y-px hover:border-[#0A0A0A] ${on ? "border-[#0A0A0A] bg-white shadow-[0_0_0_3px_rgba(255,90,31,0.22)]" : "border-[#E4E4DF] bg-[#FAFAF8]"}`}
                      >
                        <span className={`absolute right-3 top-3 h-4 w-4 rounded-full border-[1.5px] transition ${on ? "border-[#FF5A1F] bg-[#FF5A1F] shadow-[inset_0_0_0_3px_#fff]" : "border-[#CFCFCA] bg-white"}`} />
                        {icons[i]}
                        <span>{o.label}</span>
                      </button>
                    )
                  })}
                </div>
                {err("projectType")}
              </div>

              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor={id("name")} className={label}>NOMBRE</label>
                  <input id={id("name")} name="nombre" type="text" autoComplete="name" maxLength={LIMITS.nameMax} placeholder="Tu nombre" value={v.name} onChange={(e) => set("name", e.target.value)} className={field} {...bad("name")} />
                  {err("name")}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor={id("business")} className={label}>EMPRESA</label>
                  <input id={id("business")} name="empresa" type="text" autoComplete="organization" maxLength={LIMITS.businessMax} placeholder="Nombre de tu empresa" value={v.business} onChange={(e) => set("business", e.target.value)} className={field} {...bad("business")} />
                  {err("business")}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={id("email")} className={label}>EMAIL</label>
                <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={LIMITS.emailMax} placeholder="tu@empresa.com" value={v.email} onChange={(e) => set("email", e.target.value)} className={field} {...bad("email")} />
                {err("email")}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={id("message")} className={label}>DESCRIPCIÓN DEL PROYECTO</label>
                <textarea id={id("message")} name="descripcion" maxLength={LIMITS.messageMax} placeholder="Qué querés lograr, para cuándo y qué te preocupa…" value={v.message} onChange={(e) => set("message", e.target.value)} className={`${field} h-28 resize-none py-[15px] lg:h-[120px]`} {...bad("message")} />
                {err("message")}
              </div>

              <button
                type="submit"
                disabled={busy}
                data-event="form_submit"
                className="flex h-[58px] w-full items-center justify-between rounded-xl bg-[#0A0A0A] px-6 text-base font-medium text-white transition hover:-translate-y-px hover:bg-[#222220] disabled:opacity-60"
              >
                {busy ? "Enviando…" : "Enviar consulta"} <span className="text-lg text-[#FF5A1F]">↗</span>
              </button>

              <div aria-live="polite">
                {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#5E5E5A]">
                <span>Usamos tus datos solo para responderte.</span>
                <a {...wa("landing_contact", "landing_whatsapp_form_alt")} className="inline-flex gap-2 font-medium transition-[gap] hover:gap-3.5">
                  ¿Preferís WhatsApp? <span className="text-[#FF5A1F]">→</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
