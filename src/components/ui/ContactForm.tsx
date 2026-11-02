"use client"

import clsx from "clsx"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { serviceOptions } from "@/lib/config"
import { trackEvent } from "@/lib/analytics"
import { validateLead } from "@/lib/validation"
import { whatsappFromForm } from "@/lib/whatsapp"
import type { LeadErrors, LeadPayload } from "@/types"

type Status = "idle" | "loading" | "success" | "error"
type Values = Omit<LeadPayload, "startedAt">
const empty: Values = { name: "", business: "", email: "", whatsapp: "", service: "", message: "", website: "" }

const field = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none focus-visible:outline-none"

function Field({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-brand-ink" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [serverMsg, setServerMsg] = useState("")
  const startedAt = useRef(0)
  const started = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startedAt.current = Date.now()
    // Los CTA de servicios dejan la opción preseleccionada.
    const onSelect = (e: Event) => {
      const v = (e as CustomEvent<string>).detail
      if (serviceOptions.some((o) => o.value === v)) setValues((s) => ({ ...s, service: v }))
    }
    window.addEventListener("kodexa:select-service", onSelect)
    return () => window.removeEventListener("kodexa:select-service", onSelect)
  }, [])

  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((s) => ({ ...s, [k]: e.target.value }))
    if (errors[k as keyof LeadErrors]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const onFocus = () => {
    if (started.current) return
    started.current = true
    trackEvent("form_start", { section: "contacto" })
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "loading") return
    const found = validateLead(values)
    if (Object.keys(found).length) {
      setErrors(found)
      setStatus("idle")
      const first = Object.keys(found)[0]
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    setErrors({})
    setStatus("loading")
    setServerMsg("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current } satisfies LeadPayload),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: LeadErrors; code?: string }
      if (res.ok && data.ok) {
        trackEvent("form_submit", { section: "contacto", service: values.service })
        setStatus("success")
        return
      }
      if (data.errors) setErrors(data.errors)
      setServerMsg(data.message ?? "No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.")
      setStatus("error")
    } catch {
      setServerMsg("No pudimos conectarnos. Revisá tu conexión y probá de nuevo, o escribinos por WhatsApp.")
      setStatus("error")
    }
  }

  if (status === "success") {
    const label = serviceOptions.find((o) => o.value === values.service)?.label ?? "mi proyecto"
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-2xl border border-line bg-white p-8 shadow-soft outline-none">
        <CheckCircle2 className="size-10 text-brand" aria-hidden />
        <h3 className="t-h3 mt-5">¡Recibimos tu consulta!</h3>
        <p className="mt-3 text-muted">Gracias, {values.name.split(" ")[0]}. Te vamos a responder por WhatsApp o email a la brevedad.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappFromForm(values.name, label)} target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent("click_whatsapp", { section: "contacto-exito", service: values.service })}
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[0.95rem] font-medium text-white transition-colors hover:bg-brand hover:text-ink"
          >
            Seguir por WhatsApp
          </a>
          <button type="button" onClick={() => { setValues(empty); setStatus("idle"); startedAt.current = Date.now(); started.current = false }} className="h-12 rounded-full px-5 text-[0.95rem] font-medium underline underline-offset-4">
            Enviar otra consulta
          </button>
        </div>
      </div>
    )
  }

  const busy = status === "loading"
  const aria = (k: keyof LeadErrors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `f-${k}-error` : undefined })

  return (
    <form onSubmit={onSubmit} onFocus={onFocus} noValidate className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8" aria-label="Formulario de contacto">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="f-name" label="Nombre y apellido" required error={errors.name}>
          <input id="f-name" name="name" autoComplete="name" value={values.name} onChange={set("name")} className={clsx(field, errors.name && "border-red-600")} {...aria("name")} />
        </Field>
        <Field id="f-business" label="Empresa o negocio" error={errors.business}>
          <input id="f-business" name="business" autoComplete="organization" value={values.business} onChange={set("business")} className={clsx(field, errors.business && "border-red-600")} {...aria("business")} />
        </Field>
        <Field id="f-email" label="Email" required error={errors.email}>
          <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set("email")} className={clsx(field, errors.email && "border-red-600")} {...aria("email")} />
        </Field>
        <Field id="f-whatsapp" label="WhatsApp" required error={errors.whatsapp} hint="Con código de área, ej. 11 2345 6789">
          <input id="f-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={values.whatsapp} onChange={set("whatsapp")} className={clsx(field, errors.whatsapp && "border-red-600")} {...aria("whatsapp")} />
        </Field>
      </div>

      <Field id="f-service" label="¿Qué estás buscando?" required error={errors.service}>
        <select id="f-service" name="service" value={values.service} onChange={set("service")} className={clsx(field, errors.service && "border-red-600", !values.service && "text-ink/45")} {...aria("service")}>
          <option value="">Elegí una opción</option>
          {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>

      <Field id="f-message" label="Contanos brevemente sobre tu proyecto" error={errors.message}>
        <textarea id="f-message" name="message" rows={4} value={values.message} onChange={set("message")} className={clsx(field, "resize-y", errors.message && "border-red-600")} {...aria("message")} />
      </Field>

      {/* Campo trampa: invisible para personas, los bots lo completan. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="f-website">No completar</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>

      {status === "error" && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{serverMsg}</p>}

      <button type="submit" disabled={busy} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[0.95rem] font-medium text-white transition-colors hover:bg-brand hover:text-ink disabled:cursor-wait disabled:opacity-70 sm:w-auto">
        {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {busy ? "Enviando…" : "Enviar consulta"}
      </button>
      <p className="text-xs text-muted">Usamos tus datos solo para responder esta consulta.</p>
    </form>
  )
}
