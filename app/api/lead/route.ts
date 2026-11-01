import { validateLead } from "@/lib/lead-validation"
import { clientIp, rateLimit } from "@/lib/rate-limit"

/**
 * Copia cada consulta del sitio a una planilla de Google, vía un Apps Script publicado
 * como aplicación web (ver docs/google-sheets-leads.md).
 * Si las variables no están configuradas, no hace nada: Forminit sigue siendo el canal principal.
 *   SHEETS_WEBHOOK_URL    URL de la aplicación web de Apps Script (…/exec)
 *   SHEETS_WEBHOOK_SECRET clave compartida con el script
 *
 * Solo responde 204 si el script confirmó la escritura ("ok"). El estado de la fila lo fija el servidor.
 */
const FIELDS = ["name", "business", "email", "whatsapp", "projectType", "contactMethod", "budget", "message", "source", "productInterest", "page"] as const
const ACTIONS = ["contact_me", "whatsapp"] as const

export async function POST(req: Request) {
  const url = process.env.SHEETS_WEBHOOK_URL
  const secret = process.env.SHEETS_WEBHOOK_SECRET
  if (!url || !secret) return new Response(null, { status: 204 })

  if (!rateLimit(`lead:${clientIp(req)}`, 10, 60_000)) return new Response("rate limited", { status: 429 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new Response("bad request", { status: 400 })
  }

  // Solo campos conocidos, como texto y con largo acotado.
  const lead: Record<string, string> = {}
  for (const k of FIELDS) {
    const v = body[k]
    lead[k] = typeof v === "string" ? v.slice(0, 3000) : ""
  }
  const action = (ACTIONS as readonly string[]).includes(String(body.action)) ? String(body.action) : "contact_me"

  const errors = validateLead(
    {
      name: lead.name,
      business: lead.business,
      contactMethod: lead.contactMethod,
      email: lead.email,
      whatsapp: lead.whatsapp,
      message: lead.message,
      projectType: lead.projectType,
      budget: lead.budget,
    },
    { requireProjectType: true },
  )
  if (Object.keys(errors).length) return Response.json({ error: "VALIDATION_ERROR", errors }, { status: 400 })

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, action, status: "nuevo", secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    })
    const text = (await res.text()).trim()
    if (res.ok && text === "ok") return new Response(null, { status: 204 })
    console.error(`[lead] Sheets no confirmó la escritura (status ${res.status}, respuesta "${text.slice(0, 40)}")`)
    return new Response(null, { status: 502 })
  } catch (err) {
    console.error("[lead] Error al escribir en Sheets:", err instanceof Error ? err.message : "desconocido")
    return new Response(null, { status: 502 })
  }
}
