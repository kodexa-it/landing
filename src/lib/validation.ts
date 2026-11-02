import { serviceOptions } from "@/lib/config"
import type { LeadErrors, LeadPayload } from "@/types"

/** Validación compartida: el navegador muestra los mensajes por campo y el servidor vuelve a validar todo. */
export const LIMITS = { nameMin: 2, nameMax: 80, businessMax: 80, emailMax: 254, messageMax: 2000, phoneMin: 8, phoneMax: 15 } as const

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,24}$/i
const URL_RE = /(https?:\/\/|www\.)/gi
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.con": "gmail.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "yahooo.com": "yahoo.com",
}

export const clean = (v: unknown) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "")
const digits = (v: string) => v.replace(/\D/g, "")

export function validateLead(input: Partial<LeadPayload>): LeadErrors {
  const e: LeadErrors = {}
  const name = clean(input.name)
  const business = clean(input.business)
  const email = clean(input.email).toLowerCase()
  const whatsapp = clean(input.whatsapp)
  const message = clean(input.message)
  const service = clean(input.service)

  if (!name) e.name = "Ingresá tu nombre y apellido."
  else if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) e.name = `El nombre debe tener entre ${LIMITS.nameMin} y ${LIMITS.nameMax} caracteres.`
  else if (!/\p{L}.*\p{L}/u.test(name) || /[<>{}@]|https?:|www\./i.test(name)) e.name = "Ingresá un nombre válido."

  if (business && (business.length > LIMITS.businessMax || /[<>{}]|https?:|www\./i.test(business))) e.business = "Ingresá un nombre de negocio válido."

  if (!email) e.email = "Ingresá tu email."
  else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email) || email.includes("..")) e.email = "Revisá el email: debería ser del estilo nombre@dominio.com."
  else {
    const [user, domain] = email.split("@")
    if (TYPOS[domain]) e.email = `¿Quisiste decir ${user}@${TYPOS[domain]}?`
  }

  if (!whatsapp) e.whatsapp = "Ingresá tu número de WhatsApp."
  else if (/[^\d\s()+\-.]/.test(whatsapp)) e.whatsapp = "Usá solo números (podés incluir +, espacios o guiones)."
  else if (digits(whatsapp).length < LIMITS.phoneMin || digits(whatsapp).length > LIMITS.phoneMax) e.whatsapp = "Revisá el número: incluí el código de área (ej. 11 2345 6789)."

  if (!serviceOptions.some((o) => o.value === service)) e.service = "Elegí qué estás buscando."

  if (message.length > LIMITS.messageMax) e.message = `El mensaje es demasiado largo (máximo ${LIMITS.messageMax} caracteres).`
  else if ((message.match(URL_RE) ?? []).length > 2) e.message = "El mensaje tiene demasiados enlaces."

  return e
}

/** Anti-spam: campo trampa invisible (los bots lo completan) y tiempo mínimo de completado. */
export const MIN_FILL_MS = 2500
export const isHoneypotFilled = (honeypot: unknown) => typeof honeypot === "string" && honeypot.trim() !== ""
export function filledTooFast(startedAt: unknown, now = Date.now()): boolean {
  const t = Number(startedAt)
  if (!Number.isFinite(t) || t <= 0) return true // sin marca de tiempo, no vino del formulario
  return now - t < MIN_FILL_MS
}
