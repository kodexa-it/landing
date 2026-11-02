import { site } from "@/lib/config"

/**
 * Único lugar donde se construyen enlaces de WhatsApp.
 * El número vive en lib/config.ts: no duplicar números ni URLs en componentes.
 */
export const whatsappMessages = {
  general: "Hola, conocí Kodexa y quisiera consultar por sus soluciones.",
  hero: "Hola, conocí Kodexa y quisiera hablar sobre mi proyecto.",
  web: "Hola, conocí Kodexa y quisiera consultar por sus soluciones web.",
  nexo: "Hola, quisiera conocer más sobre Nexo.",
  nodo: "Hola, estoy interesado en Nodo.",
  landing: "Hola, quisiera consultar por una landing page.",
  institucional: "Hola, quisiera consultar por un sitio institucional.",
  "institucional-pro": "Hola, quisiera consultar por Institucional Pro.",
  "a-medida": "Hola, necesito desarrollar una solución a medida.",
  proyecto: "Hola, vi el proyecto Waste Treatment y quisiera consultar por un proyecto similar.",
  contacto: "Hola, estoy en la nueva web de Kodexa y quisiera hacer una consulta.",
} as const

export type WhatsappKey = keyof typeof whatsappMessages

const SOURCE_NOTE = "(Mensaje enviado desde la nueva landing de Kodexa)"

export function whatsappHref(key: WhatsappKey = "general", extra?: string): string {
  const text = [whatsappMessages[key], extra, SOURCE_NOTE].filter(Boolean).join("\n")
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
}

/** Mensaje para el formulario cuando la persona prefiere seguir por WhatsApp con sus datos precargados. */
export function whatsappFromForm(name: string, serviceLabel: string): string {
  const text = `Hola, soy ${name}. Completé el formulario en la landing de Kodexa y me interesa: ${serviceLabel}.\n${SOURCE_NOTE}`
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
}
