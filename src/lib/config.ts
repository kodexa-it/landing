/**
 * Configuración central de Kodexa V2.
 * Datos reales tomados de kodexa-landing/lib/content/site.ts. Única fuente para URLs y contacto.
 */
const clean = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim().replace(/\/$/, "") : fallback)

export const site = {
  name: "Kodexa",
  /** URL pública de esta landing (canonical, sitemap, OG). */
  url: clean(process.env.NEXT_PUBLIC_SITE_URL, "https://ecosistema.kodexa.ar"),
  /** URL pública del sitio institucional original (kodexa-landing). */
  institutionalUrl: clean(process.env.NEXT_PUBLIC_INSTITUTIONAL_URL, "https://kodexa.ar"),
  email: "contacto@kodexa.ar",
  whatsappNumber: "5491178148150",
  whatsappDisplay: "+54 9 11 7814-8150",
  instagram: "https://www.instagram.com/kodexa.it/",
  linkedin: "https://www.linkedin.com/in/kodexa-it-58623a446/",
  nexoUrl: "https://nexo.kodexa.ar/",
  nodoUrl: "https://nodo.kodexa.ar/",
  /** Caso de estudio publicado en el sitio institucional (Waste Treatment aún no tiene dominio propio publicado). */
  wasteTreatmentCaseUrl: "https://kodexa.ar/recursos/de-los-requerimientos-a-una-solucion-digital-a-medida",
} as const

/** Formulario de Forminit actualmente en producción en kodexa.ar (identificador público). */
export const forminitFormId = process.env.FORMINIT_FORM_ID?.trim() || "920afmph8yf"

/** La landing se indexa solo cuando NEXT_PUBLIC_SITE_PREVIEW="false". Por defecto: noindex. */
export const isPreview = process.env.NEXT_PUBLIC_SITE_PREVIEW !== "false"

export const analyticsIds = {
  /** Contenedores de GTM de la landing (pueden ser varios; se configuran con NEXT_PUBLIC_GTM_IDS, separados por coma). */
  gtmIds: (process.env.NEXT_PUBLIC_GTM_IDS ?? process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KQFJZWBN,GTM-W9J59DDB")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean),
  clarity: process.env.NEXT_PUBLIC_CLARITY_ID?.trim() || "",
}

/** Valores estables del selector "¿Qué estás buscando?". Las etiquetas viven en los diccionarios (lib/dict). */
export const serviceValues = ["landing", "institucional", "institucional-pro", "nexo", "nodo", "a-medida", "asesoramiento"] as const

export type ServiceValue = (typeof serviceValues)[number]
