import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { notFound } from "next/navigation"
import { CookieBanner } from "@/components/consent/CookieBanner"
import { I18nProvider } from "@/components/i18n/I18nProvider"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { JsonLd } from "@/components/seo/JsonLd"
import { Tracking, TrackingNoScript, trackingEnabled } from "@/components/seo/Tracking"
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { WhatsappFloat } from "@/components/ui/WhatsappFloat"
import { isPreview, site } from "@/lib/config"
import { getDict, homePath, isLocale, localeMeta, locales } from "@/lib/i18n"
import "../globals.css"

// IBM Plex alojada en el proyecto (licencia OFL, ver src/app/fonts): el build no depende de Google Fonts.
const plexSans = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
})
const plexMono = localFont({
  src: [{ path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-plex-mono",
  display: "swap",
})

export const dynamicParams = false
export const generateStaticParams = () => locales.map((lang) => ({ lang }))

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light", width: "device-width", initialScale: 1 }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const d = getDict(lang)
  const url = `${site.url}${homePath(lang) === "/" ? "" : homePath(lang)}`
  return {
    metadataBase: new URL(site.url),
    title: { default: d.meta.title, template: "%s | Kodexa" },
    description: d.meta.description,
    applicationName: "Kodexa",
    authors: [{ name: "Kodexa", url: site.institutionalUrl }],
    creator: "Kodexa",
    publisher: "Kodexa",
    alternates: { canonical: homePath(lang), languages: { es: homePath("es"), en: homePath("en"), "x-default": homePath("es") } },
    robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: localeMeta[lang].ogLocale,
      alternateLocale: [localeMeta[lang === "es" ? "en" : "es"].ogLocale],
      url,
      siteName: "Kodexa",
      title: d.meta.ogTitle,
      description: d.meta.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: d.meta.ogTitle, description: d.meta.description, images: ["/og-image.png"] },
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/favicon.svg", type: "image/svg+xml" }],
      apple: "/apple-touch-icon.png",
    },
  }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const d = getDict(lang)
  return (
    <html lang={localeMeta[lang].htmlLang} className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <I18nProvider locale={lang} d={d}>
          <TrackingNoScript />
          <ScrollProgress />
          <a href="#contenido" className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            {d.a11y.skip}
          </a>
          <Header />
          <main id="contenido">{children}</main>
          <Footer locale={lang} d={d} />
          <WhatsappFloat />
          {trackingEnabled && <CookieBanner />}
          <JsonLd d={d} locale={lang} />
          <Tracking />
        </I18nProvider>
      </body>
    </html>
  )
}
