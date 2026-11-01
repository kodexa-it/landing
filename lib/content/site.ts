/** Datos globales de la landing. Mismos valores que el sitio actual (kodexa-landing/lib/content/site.ts). */

export const site = {
  name: "Kodexa",
  url: "https://kodexa.ar",
  description:
    "Diseñamos y desarrollamos sitios web, aplicaciones y sistemas a medida para negocios. Además, Nexo (asistente digital) y Nodo (CRM), nuestras propias soluciones.",
  whatsappNumber: "5491178148150",
  /** Mismo formulario de Forminit que el sitio actual: las consultas llegan al mismo lugar, distinguidas por `source`. */
  forminitFormId: "920afmph8yf",
} as const

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

const DEFAULT_CONTACT_EMAIL = "contacto@kodexa.ar"
const envEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ""
export const contactEmail: string | null = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(envEmail) ? envEmail : DEFAULT_CONTACT_EMAIL
