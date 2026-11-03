import { serviceValues } from "@/lib/config"
import type { Dict } from "@/lib/dict/es"
import { fmt } from "@/lib/i18n"
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

export function validateLead(input: Partial<LeadPayload>, m: Dict["form"]["errors"]): LeadErrors {
  const e: LeadErrors = {}
  const name = clean(input.name)
  const business = clean(input.business)
  const email = clean(input.email).toLowerCase()
  const whatsapp = clean(input.whatsapp)
  const message = clean(input.message)
  const service = clean(input.service)

  if (!name) e.name = m.nameRequired
  else if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) e.name = fmt(m.nameLength, { min: LIMITS.nameMin, max: LIMITS.nameMax })
  else if (!/\p{L}.*\p{L}/u.test(name) || /[<>{}@]|https?:|www\./i.test(name)) e.name = m.nameInvalid

  if (business && (business.length > LIMITS.businessMax || /[<>{}]|https?:|www\./i.test(business))) e.business = m.business

  if (!email) e.email = m.emailRequired
  else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email) || email.includes("..")) e.email = m.emailInvalid
  else {
    const [user, domain] = email.split("@")
    if (TYPOS[domain]) e.email = fmt(m.emailTypo, { suggestion: `${user}@${TYPOS[domain]}` })
  }

  if (!whatsapp) e.whatsapp = m.whatsappRequired
  else if (/[^\d\s()+\-.]/.test(whatsapp)) e.whatsapp = m.whatsappChars
  else if (digits(whatsapp).length < LIMITS.phoneMin || digits(whatsapp).length > LIMITS.phoneMax) e.whatsapp = m.whatsappLength

  if (!(serviceValues as readonly string[]).includes(service)) e.service = m.service

  if (message.length > LIMITS.messageMax) e.message = fmt(m.messageLong, { max: LIMITS.messageMax })
  else if ((message.match(URL_RE) ?? []).length > 2) e.message = m.messageLinks

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
