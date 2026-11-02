import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { JsonLd } from "@/components/seo/JsonLd"
import { Tracking } from "@/components/seo/Tracking"
import { WhatsappFloat } from "@/components/ui/WhatsappFloat"
import { isPreview, site } from "@/lib/config"
import "./globals.css"

// IBM Plex alojada en el proyecto (licencia OFL, ver src/app/fonts): el build no depende de Google Fonts.
const plexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
})
const plexMono = localFont({
  src: [{ path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-plex-mono",
  display: "swap",
})

const title = "Kodexa | Desarrollo web, software a medida y ecosistema digital para empresas"
const description =
  "Diseñamos páginas web, landing pages y sitios institucionales; conectamos tus canales con Nexo (asistente con IA por WhatsApp) y organizás oportunidades con Nodo (CRM). Software a medida y automatización para empresas."

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Kodexa" },
  description,
  applicationName: "Kodexa",
  authors: [{ name: "Kodexa", url: site.institutionalUrl }],
  creator: "Kodexa",
  publisher: "Kodexa",
  alternates: { canonical: "/" },
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: "Kodexa",
    title: "Kodexa — Tu negocio, conectado para crecer.",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Kodexa: Web, Nexo y Nodo, un ecosistema digital para tu negocio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodexa — Tu negocio, conectado para crecer.",
    description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light", width: "device-width", initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <a href="#contenido" className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsappFloat />
        <JsonLd />
        <Tracking />
      </body>
    </html>
  )
}
