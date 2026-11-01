/**
 * Reglas de validación de los formularios de contacto.
 * Se usan en el navegador (mensajes por campo) y en el servidor (/api/forminit y /api/lead),
 * así nadie puede saltearlas enviando datos directo a la API.
 *
 * Obligatorios: nombre, tipo de proyecto y el dato de contacto del medio elegido
 * (WhatsApp o email). El resto —negocio y mensaje— es opcional.
 */

export type ContactMethod = "whatsapp" | "email"
export const CONTACT_METHODS: readonly ContactMethod[] = ["whatsapp", "email"]

export type LeadInput = {
  name: string
  business?: string
  budget?: string
  contactMethod?: string
  email?: string
  whatsapp?: string
  message?: string
  projectType?: string
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

export const LIMITS = { nameMin: 2, nameMax: 80, businessMax: 80, budgetMax: 80, emailMax: 254, messageMax: 2000, phoneMin: 8, phoneMax: 15 } as const

// usuario@dominio.tld — sin espacios, un solo @, dominio con al menos un punto y TLD de 2+ letras.
const EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,24}$/i

// Errores de tipeo frecuentes en dominios de email.
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.om": "gmail.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.com.ar.com": "hotmail.com.ar",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
}

const URL_RE = /(https?:\/\/|www\.)/gi

export const clean = (v: unknown) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "")
export const digitsOnly = (v: string) => v.replace(/\D/g, "")

/** Sugerencia si el dominio parece mal escrito (ej. gmial.com → gmail.com). */
export function emailSuggestion(email: string): string | null {
  const [user, domain] = email.toLowerCase().split("@")
  if (!user || !domain) return null
  const fix = DOMAIN_TYPOS[domain]
  return fix ? `${user}@${fix}` : null
}

/** Códigos de error. El texto visible se resuelve por idioma (messages/<lang>/form.json → errors.<código>). */
export type ErrorCode =
  | "name_required" | "name_length" | "name_invalid"
  | "business_length" | "business_invalid"
  | "budget_length" | "budget_invalid"
  | "project_type_required" | "contact_method_required"
  | "email_required" | "email_invalid" | "email_suggestion"
  | "whatsapp_required" | "whatsapp_chars" | "whatsapp_length"
  | "message_length" | "message_links"

export type ErrorParams = { min?: number; max?: number; suggestion?: string }
export type ErrorFormatter = (code: ErrorCode, params: ErrorParams) => string

/** Textos en español: los que usa el servidor (que no muestra errores a personas) y el fallback. */
const ES: Record<ErrorCode, (p: ErrorParams) => string> = {
  name_required: () => "Ingresá tu nombre.",
  name_length: (p) => `El nombre debe tener entre ${p.min} y ${p.max} caracteres.`,
  name_invalid: () => "Ingresá un nombre válido.",
  business_length: (p) => `El nombre del negocio admite hasta ${p.max} caracteres.`,
  business_invalid: () => "Ingresá un nombre de negocio válido.",
  budget_length: (p) => `El presupuesto admite hasta ${p.max} caracteres.`,
  budget_invalid: () => "Ingresá un presupuesto válido.",
  project_type_required: () => "Elegí un tipo de proyecto.",
  contact_method_required: () => "Elegí cómo preferís que te contactemos.",
  email_required: () => "Ingresá tu email.",
  email_invalid: () => "Revisá el email: debería ser del estilo nombre@dominio.com.",
  email_suggestion: (p) => `¿Quisiste decir ${p.suggestion}?`,
  whatsapp_required: () => "Ingresá tu número de WhatsApp.",
  whatsapp_chars: () => "Usá solo números (podés incluir +, espacios o guiones).",
  whatsapp_length: () => "Revisá el número: incluí el código de área (ej. 11 2345 6789).",
  message_length: (p) => `El mensaje es demasiado largo (máximo ${p.max} caracteres).`,
  message_links: () => "El mensaje tiene demasiados enlaces.",
}
const defaultFormat: ErrorFormatter = (code, params) => ES[code](params)

export function validateLead(input: LeadInput, opts: { requireProjectType?: boolean } = {}, format: ErrorFormatter = defaultFormat): LeadErrors {
  const e: LeadErrors = {}
  const name = clean(input.name)
  const business = clean(input.business)
  const method = clean(input.contactMethod).toLowerCase()
  const email = clean(input.email).toLowerCase()
  const whatsapp = clean(input.whatsapp)
  const phone = digitsOnly(whatsapp)
  const message = clean(input.message)
  const budget = clean(input.budget)
  const f = format

  if (!name) e.name = f("name_required", {})
  else if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) e.name = f("name_length", { min: LIMITS.nameMin, max: LIMITS.nameMax })
  else if (!/\p{L}.*\p{L}/u.test(name) || /[<>{}@]|https?:|www\./i.test(name)) e.name = f("name_invalid", {})

  if (business) {
    if (business.length > LIMITS.businessMax) e.business = f("business_length", { max: LIMITS.businessMax })
    else if (/[<>{}]|https?:|www\./i.test(business)) e.business = f("business_invalid", {})
  }

  if (budget) {
    if (budget.length > LIMITS.budgetMax) e.budget = f("budget_length", { max: LIMITS.budgetMax })
    else if (/[<>{}]|https?:|www\./i.test(budget)) e.budget = f("budget_invalid", {})
  }

  if (opts.requireProjectType && !clean(input.projectType)) e.projectType = f("project_type_required", {})

  if (!CONTACT_METHODS.includes(method as ContactMethod)) e.contactMethod = f("contact_method_required", {})

  // El dato del medio elegido es obligatorio; el otro, si viene, se valida igual.
  if (email || method === "email") {
    if (!email) e.email = f("email_required", {})
    else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email) || email.includes("..")) e.email = f("email_invalid", {})
    else {
      const s = emailSuggestion(email)
      if (s) e.email = f("email_suggestion", { suggestion: s })
    }
  }

  if (whatsapp || method === "whatsapp") {
    if (!whatsapp) e.whatsapp = f("whatsapp_required", {})
    else if (/[^\d\s()+\-.]/.test(whatsapp)) e.whatsapp = f("whatsapp_chars", {})
    else if (phone.length < LIMITS.phoneMin || phone.length > LIMITS.phoneMax) e.whatsapp = f("whatsapp_length", {})
  }

  if (message) {
    if (message.length > LIMITS.messageMax) e.message = f("message_length", { max: LIMITS.messageMax })
    else if ((message.match(URL_RE) ?? []).length > 2) e.message = f("message_links", {})
  }

  return e
}

/** Campos anti-spam: un campo trampa invisible y el tiempo mínimo para completar el formulario. */
export const HONEYPOT_FIELD = "company_website"
export const STARTED_FIELD = "form_started_at"
export const MIN_FILL_MS = 3000

export function looksLikeBot(honeypot: unknown, startedAt: unknown, now = Date.now()): boolean {
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true
  const t = Number(startedAt)
  if (!Number.isFinite(t) || t <= 0) return false // si falta, no bloqueamos (por ejemplo, JS viejo)
  return now - t < MIN_FILL_MS
}
