/**
 * Medición de eventos. Empuja a window.dataLayer (GTM → GA4), que solo existe si se configuró NEXT_PUBLIC_GTM_ID.
 * Sin GTM, los eventos no hacen nada. Nunca se envían datos personales.
 */
export type AnalyticsEvent =
  | "click_whatsapp"
  | "click_contact"
  | "form_start"
  | "form_submit"
  | "ecosystem_view"
  | "service_interest"
  | "project_view"
  | "institutional_site_click"

export type EventParams = {
  section?: string
  service?: string
  product?: string
  cta_type?: string
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function trackEvent(name: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return
  try {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    // Si GTM todavía no cargó, los eventos quedan en la cola y se procesan cuando carga.
    ;(window.dataLayer = window.dataLayer || []).push({ event: name, ...clean })
  } catch {
    /* la medición nunca debe romper la navegación */
  }
}
