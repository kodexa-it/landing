/**
 * Límite de pedidos por IP, en memoria.
 * Es una defensa básica contra abuso: en un entorno serverless cada instancia lleva su propia cuenta,
 * así que frena ráfagas desde un mismo origen pero no es un límite global exacto.
 */
const hits = new Map<string, number[]>()

/** true si el pedido está permitido, false si superó el límite en la ventana. */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)

  // Limpieza ocasional para que el mapa no crezca sin control.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  }
  return true
}

export function clientIp(req: Request): string {
  const h = req.headers
  return (
    h.get("x-nf-client-connection-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  )
}

/** Acepta pedidos del propio sitio. Si el navegador no manda Origin, no se bloquea. */
export function sameSiteOrigin(req: Request, siteUrl: string): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return true
  try {
    const o = new URL(origin)
    const allowed = new Set([new URL(siteUrl).host, new URL(req.url).host, req.headers.get("host") ?? ""])
    return allowed.has(o.host) || o.hostname === "localhost" || o.hostname.endsWith(".netlify.app")
  } catch {
    return false
  }
}
