import { track } from "@vercel/analytics"

type EventProps = Record<string, string | number | boolean | null>

/**
 * Único punto de medición de eventos de conversión.
 * - Vercel Analytics ya mide las visitas por ruta (/, /productos, /productos/nexo, /productos/nodo).
 * - Si más adelante se suma GTM / Google Ads, los eventos ya salen por window.dataLayer.
 */
export function trackEvent(name: string, props?: EventProps) {
  if (typeof window === "undefined") return
  // Idioma de la página (es / en) en todos los eventos; nunca datos personales.
  // Convenciones únicas de parámetros: `location` → cta_location, `service` → service_name.
  const { location, service, ...rest } = (props ?? {}) as EventProps
  props = {
    language: document.documentElement.lang.slice(0, 2) || "es",
    // Sin query ni hash (pueden traer UTM u otros datos): solo origen y ruta.
    page_location: `${window.location.origin}${window.location.pathname}`,
    ...(location != null && rest.cta_location == null ? { cta_location: location } : {}),
    ...(service != null && rest.service_name == null ? { service_name: service } : {}),
    ...rest,
  }
  try {
    track(name, props)
  } catch {}
  try {
    ;(window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
      event: name,
      ...props,
    })
  } catch {}
}
