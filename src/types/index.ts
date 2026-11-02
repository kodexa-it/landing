import type { ServiceValue } from "@/lib/config"

export type { ServiceValue }

export type CtaType = "primary" | "secondary" | "link" | "card" | "nav" | "footer" | "float"

/** Origen de un CTA: sección y, opcionalmente, servicio o producto consultado. */
export type CtaContext = {
  section: string
  service?: ServiceValue
  product?: "web" | "nexo" | "nodo" | "kodexa"
  type?: CtaType
}

export type LeadPayload = {
  name: string
  business: string
  email: string
  whatsapp: string
  service: string
  message: string
  /** Campo trampa anti-spam: debe llegar vacío. */
  website: string
  /** Marca de tiempo (ms) de cuando se abrió el formulario. */
  startedAt: number
}

export type LeadErrors = Partial<Record<"name" | "business" | "email" | "whatsapp" | "service" | "message", string>>
