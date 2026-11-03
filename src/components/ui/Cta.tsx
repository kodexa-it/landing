"use client"

import clsx from "clsx"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import type { MouseEvent, ReactNode } from "react"
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics"
import { useI18n } from "@/components/i18n/I18nProvider"
import { whatsappHref, type WhatsappKey } from "@/lib/whatsapp"
import type { CtaContext } from "@/types"

type Variant = "primary" | "secondary" | "ghost" | "ghost-light" | "light" | "outline-light"

const styles: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-brand hover:text-ink",
  secondary: "border border-ink/15 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:text-brand-ink px-0 py-0 h-auto",
  "ghost-light": "text-white hover:text-brand px-0 py-0 h-auto",
  light: "bg-white text-ink hover:bg-brand",
  "outline-light": "border border-white/25 text-white hover:border-white hover:bg-white hover:text-ink",
}

type Target =
  | { whatsapp: WhatsappKey }
  | { href: string; external?: boolean; event?: AnalyticsEvent }

type Props = {
  ctx: CtaContext
  variant?: Variant
  className?: string
  children: ReactNode
  arrow?: "right" | "up-right" | false
} & Target

/**
 * Único botón/enlace de acción del sitio. Resuelve destino (WhatsApp contextual, ancla o enlace externo)
 * y emite el evento de medición correspondiente. Todos los CTA pasan por acá.
 */
export function Cta(props: Props) {
  const { ctx, variant = "primary", className, children, arrow } = props
  const { locale } = useI18n()
  const isWa = "whatsapp" in props
  const href = isWa ? whatsappHref(locale, props.whatsapp) : props.href
  const external = isWa || (!isWa && (props.external ?? /^https?:/.test(props.href)))
  const base = variant === "ghost" || variant === "ghost-light" ? "inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline" : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-[0.95rem] font-medium leading-tight"
  const icon = arrow ?? (external ? "up-right" : "right")

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const params = { section: ctx.section, service: ctx.service, product: ctx.product, cta_type: ctx.type ?? variant }
    if (isWa) {
      trackEvent("click_whatsapp", params)
    } else if (props.event) {
      trackEvent(props.event, params)
    } else if (href.startsWith("#")) {
      trackEvent(ctx.service ? "service_interest" : "click_contact", params)
    }
    // Si el CTA apunta al formulario con un servicio, se lo avisamos para que lo deje preseleccionado.
    if (href === "#contacto" && ctx.service) {
      window.dispatchEvent(new CustomEvent("kodexa:select-service", { detail: ctx.service }))
    }
  }

  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={clsx(base, "group/cta transition-colors duration-200", styles[variant], className)}
    >
      {children}
      {icon === "up-right" ? <ArrowUpRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" aria-hidden /> : icon === "right" ? <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" aria-hidden /> : null}
    </a>
  )
}
