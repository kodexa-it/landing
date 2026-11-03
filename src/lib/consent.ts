/**
 * Consentimiento de cookies/analítica (mismo modelo que el sitio institucional kodexa.ar).
 *
 * - La elección se guarda en la cookie propia `kx_consent` (granted | denied), 6 meses, sin datos personales.
 * - Mientras no haya elección (o sea `denied`), GTM carga con Consent Mode v2 en `denied` y Clarity no se carga.
 * - `granted` habilita solo analítica (`analytics_storage`). Publicidad (`ad_*`) queda siempre denegada: el sitio no usa anuncios.
 */
export const CONSENT_COOKIE = "kx_consent"
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180
export type ConsentChoice = "granted" | "denied"

export const consentDenied = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const

export const consentGranted = { ...consentDenied, analytics_storage: "granted" } as const

/** Lee la elección desde `document.cookie`. Cualquier otro valor → null (sin elección). */
export function parseConsent(cookieHeader: string | null | undefined): ConsentChoice | null {
  if (!cookieHeader) return null
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)(?:;|$)`))
  return m ? (m[1] as ConsentChoice) : null
}

/** Valor para `document.cookie`. `secure` solo en https. */
export function serializeConsent(choice: ConsentChoice, secure: boolean): string {
  return `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure ? "; Secure" : ""}`
}

/**
 * Corre antes de GTM: fija el consentimiento por defecto en `denied` y, si la persona ya aceptó antes,
 * lo actualiza a `granted` de forma síncrona (GTM lo ve antes de disparar etiquetas).
 */
export const consentBootScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',${JSON.stringify(consentDenied)});
if(/(?:^|;\\s*)${CONSENT_COOKIE}=granted(?:;|$)/.test(document.cookie)){gtag('consent','update',${JSON.stringify(consentGranted)})}`
