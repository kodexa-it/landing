import { site } from "@/lib/content/site"
import { parseInteraction } from "@/lib/interaction"
import { clientIp, rateLimit, sameSiteOrigin } from "@/lib/rate-limit"

/**
 * Registra interacciones anónimas (hoy: clics en WhatsApp) en la pestaña "Interacciones"
 * de la planilla de Google, a través del mismo Apps Script que usa /api/lead.
 *
 * Una interacción NO es un lead: no lleva datos personales y no se mezcla con la pestaña "Leads".
 *
 * Variables de entorno (las dos primeras ya existen para /api/lead):
 *   SHEETS_WEBHOOK_URL           URL de la aplicación web de Apps Script (…/exec)
 *   SHEETS_WEBHOOK_SECRET        clave compartida con el script
 *   SHEETS_INTERACTIONS_ENABLED  "true" para activar este registro. Se activa recién cuando el
 *                                Apps Script fue actualizado (ver docs/google-sheets-leads.md);
 *                                con el script anterior, las interacciones caerían en "Leads".
 *
 * Respuestas: 200 {stored:true} solo cuando el script confirmó la escritura;
 * 202 {stored:false} si no está configurado; 502 {stored:false} si la escritura falló.
 */
const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status })

export async function POST(req: Request) {
  if (!sameSiteOrigin(req, site.url)) return json({ error: "forbidden" }, 403)
  if (!rateLimit(`interaction:${clientIp(req)}`, 30, 60_000)) return json({ error: "rate_limited" }, 429)

  let raw: string
  try {
    raw = await req.text()
  } catch {
    return json({ error: "bad_request" }, 400)
  }
  if (raw.length > 4000) return json({ error: "payload_too_large" }, 413)

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ error: "bad_request" }, 400)
  }

  const parsed = parseInteraction(body)
  if (!parsed.ok) return json({ error: parsed.error }, 400)

  const url = process.env.SHEETS_WEBHOOK_URL
  const secret = process.env.SHEETS_WEBHOOK_SECRET
  if (!url || !secret || process.env.SHEETS_INTERACTIONS_ENABLED !== "true") {
    return json({ stored: false, reason: "not_configured" }, 202)
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.value, kind: "interaction", secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    })
    const text = (await res.text()).trim()
    if (res.ok && text === "ok") return json({ stored: true }, 200)
    // Sin datos personales en el log: solo qué falló.
    console.error(`[interaction] Sheets no confirmó la escritura (status ${res.status}, respuesta "${text.slice(0, 40)}")`)
    return json({ stored: false, reason: "not_confirmed" }, 502)
  } catch (err) {
    console.error("[interaction] Error al escribir en Sheets:", err instanceof Error ? err.message : "desconocido")
    return json({ stored: false, reason: "error" }, 502)
  }
}
