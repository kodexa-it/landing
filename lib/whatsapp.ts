import { trackEvent } from "@/lib/analytics"
import { getAttribution } from "@/lib/attribution"

/** Identifica un botón de WhatsApp con valores estables (no texto visible). Igual que en el sitio actual. */
export type WhatsappCta = { location: string; label: string; service?: string }

let last = { key: "", at: 0 }

/**
 * Registra un clic en WhatsApp sin bloquear la navegación:
 *  1. Evento `whatsapp_click` en dataLayer (GTM → GA4) y Vercel Analytics. Sin datos personales.
 *  2. Aviso a /api/interaction (pestaña "Interacciones" de la planilla), con fetch keepalive.
 */
export function trackWhatsappClick(cta: WhatsappCta) {
  if (typeof window === "undefined") return
  try {
    const now = Date.now()
    const key = `${cta.location}|${cta.label}`
    if (key === last.key && now - last.at < 800) return
    last = { key, at: now }

    const pagePath = window.location.pathname
    trackEvent("whatsapp_click", {
      cta_location: cta.location,
      page_path: pagePath,
      cta_label: cta.label,
      contact_method: "whatsapp",
      ...(cta.service ? { service_type: cta.service } : {}),
    })

    void fetch("/api/interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_type: "whatsapp_click",
        page_path: pagePath,
        cta_location: cta.location,
        cta_label: cta.label,
        service_type: cta.service ?? "",
        ...getAttribution(),
      }),
    }).catch(() => {})
  } catch {}
}
