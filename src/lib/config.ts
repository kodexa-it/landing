/**
 * Configuración central de Kodexa V2.
 * Datos reales tomados de kodexa-landing/lib/content/site.ts. Única fuente para URLs y contacto.
 */
const clean = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim().replace(/\/$/, "") : fallback)

export const site = {
  name: "Kodexa",
  /** URL pública de esta landing (canonical, sitemap, OG). */
  url: clean(process.env.NEXT_PUBLIC_SITE_URL, "https://kodexa.ar"),
  /** URL pública del sitio institucional original (kodexa-landing). */
  institutionalUrl: clean(process.env.NEXT_PUBLIC_INSTITUTIONAL_URL, "https://kodexa.ar"),
  locale: "es_AR",
  tagline: "Tu negocio, conectado para crecer.",
  description:
    "Kodexa es un estudio tecnológico argentino: diseñamos webs, conectamos tus canales con Nexo (asistente con IA por WhatsApp) y organizás oportunidades con Nodo (CRM). También desarrollamos software a medida.",
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
  gtm: process.env.NEXT_PUBLIC_GTM_ID?.trim() || "",
  clarity: process.env.NEXT_PUBLIC_CLARITY_ID?.trim() || "",
}

export const navItems = [
  { label: "Ecosistema", href: "#ecosistema" },
  { label: "Soluciones web", href: "#soluciones-web" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Desarrollo a medida", href: "#desarrollo-a-medida" },
  { label: "Contacto", href: "#contacto" },
] as const

/** Opciones del selector "¿Qué estás buscando?". El `value` es estable; el label es lo que ve la persona. */
export const serviceOptions = [
  { value: "landing", label: "Landing Page" },
  { value: "institucional", label: "Sitio Institucional" },
  { value: "institucional-pro", label: "Institucional Pro" },
  { value: "nexo", label: "Nexo" },
  { value: "nodo", label: "Nodo" },
  { value: "a-medida", label: "Desarrollo a medida" },
  { value: "asesoramiento", label: "No estoy seguro, necesito asesoramiento" },
] as const

export type ServiceValue = (typeof serviceOptions)[number]["value"]
