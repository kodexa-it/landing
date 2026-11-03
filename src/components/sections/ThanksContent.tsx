"use client"

import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"
import { Cta } from "@/components/ui/Cta"
import { fmt, homePath, institutional } from "@/lib/i18n"

type Lead = { name?: string; service?: string; at?: number }

/**
 * Contenido de la página de gracias. Solo confirma el envío si el formulario dejó la marca de sesión
 * tras la respuesta OK del servidor; una visita directa ve un aviso neutro que no afirma que se haya recibido nada.
 * Esta página no mide conversiones: `form_submit` se emite al confirmarse el envío, no al abrirla.
 */
export function ThanksContent() {
  const { locale, d } = useI18n()
  const t = d.thanks
  const [lead, setLead] = useState<Lead | null | undefined>(undefined)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kx_lead")
      setLead(raw ? (JSON.parse(raw) as Lead) : null)
    } catch {
      setLead(null)
    }
  }, [])

  const home = homePath(locale)
  const wrap = "relative grid min-h-[70vh] place-items-center overflow-hidden px-5 py-24 text-center"

  if (lead === undefined) return <section className={wrap} aria-busy="true" />

  if (!lead) {
    return (
      <section className={wrap}>
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative max-w-xl">
          <p className="t-label text-muted">{t.directEyebrow}</p>
          <h1 className="t-h2 mt-5">{t.directTitle}</h1>
          <p className="t-lead mx-auto mt-5 max-w-md">{t.directLead}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Cta ctx={{ section: "gracias-directo", type: "primary" }} href={`${home}#contacto`}>{t.directForm}</Cta>
            <Cta ctx={{ section: "gracias-directo", type: "secondary" }} whatsapp="general" variant="secondary">{d.common.whatsappUs}</Cta>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={wrap} data-lead-confirmed="true">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative max-w-2xl">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-ink text-brand"><CheckCircle2 className="size-7" aria-hidden /></span>
        <p className="t-label mt-6 text-muted">{t.eyebrow}</p>
        <h1 className="t-h2 mt-4" role="status">{lead.name ? fmt(t.title, { name: lead.name }) : t.titleNoName}</h1>
        <p className="t-lead mx-auto mt-5 max-w-lg">{t.lead}</p>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-line bg-white p-6 text-left shadow-soft">
          <p className="t-label text-muted">{t.next}</p>
          <ol className="mt-4 space-y-3">
            {t.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-[0.95rem] text-ink/80">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-medium text-brand-ink">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Cta ctx={{ section: "gracias", service: lead.service as never, type: "primary" }} whatsapp="gracias">{t.wa}</Cta>
          <Cta ctx={{ section: "gracias", type: "secondary" }} href={home} variant="secondary" arrow={false}>{t.home}</Cta>
        </div>
        <p className="mt-8">
          <Cta ctx={{ section: "gracias", product: "kodexa", type: "link" }} href={institutional(locale).home} event="institutional_site_click" variant="ghost" arrow="up-right">{t.about}</Cta>
        </p>
      </div>
    </section>
  )
}
