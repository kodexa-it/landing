import { Forminit } from "forminit"
import { forminitFormId, serviceOptions } from "@/lib/config"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { clean, filledTooFast, isHoneypotFilled, validateLead } from "@/lib/validation"
import type { LeadPayload } from "@/types"

export const runtime = "nodejs"

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } })

/**
 * Recibe el formulario de la landing, lo valida otra vez en el servidor y lo envía a Forminit,
 * usando los mismos nombres de campo que el sitio institucional para que las consultas lleguen al mismo lugar.
 * Sin FORMINIT_API_KEY responde 503: nunca simula un envío exitoso.
 */
export async function POST(req: Request) {
  const apiKey = process.env.FORMINIT_API_KEY
  if (!apiKey) {
    console.error("[contact] Falta FORMINIT_API_KEY: el formulario no puede enviar consultas.")
    return json({ ok: false, code: "NOT_CONFIGURED", message: "El formulario no está disponible en este momento. Escribinos por WhatsApp." }, 503)
  }

  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) {
    return json({ ok: false, code: "RATE_LIMITED", message: "Hiciste varios envíos seguidos. Probá de nuevo en unos minutos." }, 429)
  }

  let body: Partial<LeadPayload>
  try {
    body = (await req.json()) as Partial<LeadPayload>
  } catch {
    return json({ ok: false, code: "BAD_REQUEST", message: "No se pudieron leer los datos." }, 400)
  }

  // Campo trampa completo = bot: respuesta idéntica a un éxito, sin enviar nada (para no darle señal).
  if (isHoneypotFilled(body.website)) return json({ ok: true }, 200)
  // Envío demasiado rápido: puede ser una persona con autocompletado, así que se le pide reintentar (no se descarta en silencio).
  if (filledTooFast(body.startedAt)) return json({ ok: false, code: "TOO_FAST", message: "Un segundo más y volvé a enviar el formulario." }, 400)

  const errors = validateLead(body)
  if (Object.keys(errors).length) return json({ ok: false, code: "VALIDATION_ERROR", errors }, 400)

  const serviceLabel = serviceOptions.find((o) => o.value === clean(body.service))?.label ?? ""
  const form = new FormData()
  form.append("fi-sender-fullName", clean(body.name))
  form.append("fi-sender-email", clean(body.email).toLowerCase())
  form.append("fi-text-business", clean(body.business))
  form.append("fi-text-whatsapp", clean(body.whatsapp))
  form.append("fi-text-contactMethod", "whatsapp")
  form.append("fi-select-projectType", serviceLabel)
  form.append("fi-text-message", clean(body.message))
  form.append("fi-text-source", "landing-v2")

  try {
    const forminit = new Forminit({ apiKey })
    const { error } = await forminit.submit(forminitFormId, form)
    if (error) {
      console.error("[contact] Forminit rechazó el envío:", error.message)
      return json({ ok: false, code: "UPSTREAM_ERROR", message: "No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp." }, 502)
    }
    return json({ ok: true }, 200)
  } catch (err) {
    console.error("[contact] Error al contactar Forminit:", err instanceof Error ? err.message : "desconocido")
    return json({ ok: false, code: "UPSTREAM_ERROR", message: "No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp." }, 502)
  }
}
