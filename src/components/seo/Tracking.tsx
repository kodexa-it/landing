import Script from "next/script"
import { analyticsIds } from "@/lib/config"
import { consentBootScript } from "@/lib/consent"

/**
 * Analítica con consentimiento. GTM carga solo en producción (build/start), para no mezclar pruebas locales con visitas reales.
 * Para probarlo en local: NEXT_PUBLIC_TRACKING_DEV=true.
 * Consent Mode v2: todo arranca en "denied"; la analítica se habilita solo si la persona acepta en el aviso de cookies.
 */
export const trackingEnabled = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_TRACKING_DEV === "true"
const safe = (v: string, re: RegExp) => v.replace(re, "")

export function Tracking() {
  if (!trackingEnabled) return null
  const gtm = safe(analyticsIds.gtm, /[^A-Za-z0-9-]/g)
  const clarity = safe(analyticsIds.clarity, /[^A-Za-z0-9]/g)
  // Clarity no se carga hasta que haya consentimiento: el aviso llama a window.kxLoadClarity() al aceptar.
  const clarityLoader = clarity
    ? `window.kxLoadClarity=function(){if(window.__kxClarity)return;window.__kxClarity=1;(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}")};if(/(?:^|;\\s*)kx_consent=granted(?:;|$)/.test(document.cookie)){window.kxLoadClarity()}`
    : ""
  return (
    <>
      {/* Va antes de GTM: define el consentimiento por defecto (denied) y restaura "granted" si ya había aceptado. */}
      <script id="consent-default" dangerouslySetInnerHTML={{ __html: consentBootScript + clarityLoader }} />
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}</Script>
      )}
    </>
  )
}

/** Va justo después de abrir <body>: respaldo de GTM para navegadores sin JavaScript. */
export function TrackingNoScript() {
  if (!trackingEnabled) return null
  const gtm = safe(analyticsIds.gtm, /[^A-Za-z0-9-]/g)
  if (!gtm) return null
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtm}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  )
}
