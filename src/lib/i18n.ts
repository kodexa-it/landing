import { es, type Dict } from "@/lib/dict/es"
import { en } from "@/lib/dict/en"
import { site } from "@/lib/config"

export const locales = ["es", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "es"
/** Misma cookie que el sitio institucional: la elección de idioma se comparte si ambos viven en el mismo dominio. */
export const LANG_COOKIE = "kx_lang"

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  es: { label: "Español", short: "ES", htmlLang: "es-AR", ogLocale: "es_AR" },
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US" },
}

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v)
export const getDict = (l: Locale): Dict => (l === "en" ? en : es)

/** Rutas públicas. Español sin prefijo (como el sitio institucional); inglés bajo /en con segmentos en inglés. */
export const paths = {
  home: { es: "/", en: "/en" },
  thanks: { es: "/gracias", en: "/en/thank-you" },
} as const
export const homePath = (l: Locale) => paths.home[l]
export const thanksPath = (l: Locale) => paths.thanks[l]

/** Reemplaza {tokens} en un texto del diccionario. */
export const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""))

/** Enlaces del sitio institucional (aviso de privacidad, cookies y portada) en el idioma activo. */
export function institutional(l: Locale) {
  const base = site.institutionalUrl
  return l === "en"
    ? { home: `${base}/en`, privacy: `${base}/en/privacy`, cookies: `${base}/en/cookies`, wasteTreatmentCase: `${base}/en/resources/from-requirements-to-a-custom-digital-solution` }
    : { home: base, privacy: `${base}/privacidad`, cookies: `${base}/cookies`, wasteTreatmentCase: site.wasteTreatmentCaseUrl }
}

/** Elige idioma desde Accept-Language (primer idioma soportado por prioridad); si no hay coincidencia, español. */
export function pickLocale(header: string | null | undefined): Locale {
  if (!header) return defaultLocale
  const list = header
    .split(",")
    .slice(0, 20)
    .map((p, i) => {
      const [tag, ...rest] = p.trim().split(";")
      const q = rest.map((x) => x.trim()).find((x) => x.startsWith("q="))
      const n = q ? Number(q.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(n) ? n : 0, i }
    })
    .filter((x) => x.tag && x.tag !== "*" && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i)
  for (const { tag } of list) {
    const primary = tag.split("-")[0]
    if (isLocale(primary)) return primary
  }
  return defaultLocale
}

const BOT_RE = /bot|crawl|spider|slurp|bing|google|yandex|baidu|duckduck|facebookexternalhit|facebot|twitter|linkedin|whatsapp|telegram|slack|discord|pinterest|embedly|preview|lighthouse|headless|curl|wget|python-requests|node-fetch/i
export const isBot = (ua: string | null | undefined) => !ua || BOT_RE.test(ua)
