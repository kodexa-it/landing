import Script from "next/script"
import { analyticsIds } from "@/lib/config"

/**
 * Analítica. GTM carga solo en producción (build/start), para no mezclar pruebas locales con visitas reales.
 * Para probar el modo Preview de GTM en local: NEXT_PUBLIC_TRACKING_DEV=true.
 * Si esta landing comparte contenedor con otro sitio del mismo dominio, no instalar el mismo ID dos veces.
 */
const enabled = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_TRACKING_DEV === "true"
const safe = (v: string, re: RegExp) => v.replace(re, "")

export function Tracking() {
  if (!enabled) return null
  const gtm = safe(analyticsIds.gtm, /[^A-Za-z0-9-]/g)
  const clarity = safe(analyticsIds.clarity, /[^A-Za-z0-9]/g)
  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}</Script>
      )}
      {clarity && (
        <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}</Script>
      )}
    </>
  )
}

/** Va justo después de abrir <body>: respaldo de GTM para navegadores sin JavaScript. */
export function TrackingNoScript() {
  if (!enabled) return null
  const gtm = safe(analyticsIds.gtm, /[^A-Za-z0-9-]/g)
  if (!gtm) return null
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtm}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  )
}
