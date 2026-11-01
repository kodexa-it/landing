import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Prueba de envío para /gracias.
 *
 * El servidor (app/api/forminit) la emite SOLO cuando Forminit confirmó la consulta, como una cookie firmada y de corta
 * duración. /gracias la verifica en el servidor: una visita directa, un enlace compartido o un envío fallido no la tienen,
 * así que no ven la confirmación. No depende de ocultar el enlace ni de comprobaciones del navegador.
 *
 * Limitación: la cookie dura unos minutos (se puede recargar la página); y no se guarda estado en el servidor,
 * así que dentro de ese plazo la misma persona podría volver a abrir /gracias. La medición (`generate_lead`)
 * no depende de esta página: se emite al confirmarse el envío, no al visitarla.
 */
export const PROOF_COOKIE = "kx_sent"
export const PROOF_TTL_SECONDS = 10 * 60

const secret = () => process.env.LEAD_PROOF_SECRET || process.env.FORMINIT_API_KEY || ""
const mac = (ts: string, key: string) => createHmac("sha256", key).update(`lead:${ts}`).digest("base64url")

/** Valor de la cookie, o null si no hay clave configurada (entonces no se emite nada). */
export function signProof(now = Date.now()): string | null {
  const key = secret()
  if (!key) return null
  const ts = String(now)
  return `${ts}.${mac(ts, key)}`
}

export function verifyProof(value: string | undefined, now = Date.now()): boolean {
  const key = secret()
  if (!key || !value) return false
  const [ts, sig] = value.split(".")
  if (!ts || !sig || !/^\d{10,16}$/.test(ts)) return false
  const age = now - Number(ts)
  if (age < 0 || age > PROOF_TTL_SECONDS * 1000) return false
  const a = Buffer.from(sig)
  const b = Buffer.from(mac(ts, key))
  return a.length === b.length && timingSafeEqual(a, b)
}
