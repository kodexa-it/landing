/**
 * Interacciones anónimas (por ejemplo, un clic en WhatsApp).
 * NO son leads: no llevan nombre, email ni teléfono, y se guardan en una pestaña aparte
 * de la planilla ("Interacciones"). Este módulo valida lo que llega del navegador.
 * No importa nada del proyecto para poder probarse de forma aislada.
 */

export const INTERACTION_EVENTS = ["whatsapp_click"] as const
export type InteractionEvent = (typeof INTERACTION_EVENTS)[number]

export type Interaction = {
  event_type: InteractionEvent
  page_path: string
  cta_location: string
  cta_label: string
  service_type: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  referrer: string
}

// Identificadores estables: letras, números, guion, guion bajo y punto.
const SLUG_RE = /^[a-z0-9][a-z0-9_.\-]{0,59}$/i
// Ruta interna del sitio, sin query ni hash.
const PATH_RE = /^\/[A-Za-z0-9\-._~%/]{0,199}$/
// Valores UTM: texto simple, sin caracteres de control ni marcado.
const UTM_RE = /^[\p{L}\p{N} _.\-+%~:/]{1,100}$/u

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")

/** Del referrer solo se conserva origen + ruta (sin query ni hash, que podrían traer datos personales). */
export function safeReferrer(v: unknown): string {
  const raw = str(v)
  if (!raw || raw.length > 500) return ""
  try {
    const u = new URL(raw)
    if (u.protocol !== "https:" && u.protocol !== "http:") return ""
    return `${u.origin}${u.pathname}`.slice(0, 200)
  } catch {
    return ""
  }
}

export function parseInteraction(body: unknown): { ok: true; value: Interaction } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid_body" }
  const b = body as Record<string, unknown>

  const event = str(b.event_type)
  if (!(INTERACTION_EVENTS as readonly string[]).includes(event)) return { ok: false, error: "invalid_event_type" }

  const pagePath = str(b.page_path).split(/[?#]/)[0]
  if (!PATH_RE.test(pagePath)) return { ok: false, error: "invalid_page_path" }

  const location = str(b.cta_location)
  const label = str(b.cta_label)
  if (!SLUG_RE.test(location)) return { ok: false, error: "invalid_cta_location" }
  if (!SLUG_RE.test(label)) return { ok: false, error: "invalid_cta_label" }

  const service = str(b.service_type)
  if (service && !SLUG_RE.test(service)) return { ok: false, error: "invalid_service_type" }

  // UTM y referrer son opcionales: si vienen mal formados se descartan, no se rechaza el evento.
  const utm = (k: string) => {
    const v = str(b[k])
    return UTM_RE.test(v) ? v : ""
  }

  return {
    ok: true,
    value: {
      event_type: event as InteractionEvent,
      page_path: pagePath,
      cta_location: location,
      cta_label: label,
      service_type: service,
      utm_source: utm("utm_source"),
      utm_medium: utm("utm_medium"),
      utm_campaign: utm("utm_campaign"),
      referrer: safeReferrer(b.referrer),
    },
  }
}
