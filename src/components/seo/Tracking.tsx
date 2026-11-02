import Script from "next/script"
import { analyticsIds } from "@/lib/config"

/**
 * Analítica opcional. Solo carga si hay IDs configurados (NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_CLARITY_ID) y en producción.
 * Si esta landing comparte contenedor con el sitio original, no instalar el mismo ID dos veces en un mismo dominio.
 */
export function Tracking() {
  if (process.env.NODE_ENV !== "production") return null
  const { gtm, clarity } = analyticsIds
  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});(function(w,d,s,i){var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','${gtm.replace(/[^A-Za-z0-9-]/g, "")}');`}</Script>
      )}
      {clarity && (
        <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity.replace(/[^A-Za-z0-9]/g, "")}");`}</Script>
      )}
    </>
  )
}
