import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { AttributionCapture } from "@/components/seo/attribution"
import { site } from "@/lib/content/site"
import "./globals.css"
import "./landing.css"

// Misma IBM Plex Sans alojada que usa el sitio actual (OFL, ver app/fonts/OFL-LICENSE.txt).
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Kodexa", template: "%s | Kodexa" },
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={plexSans.variable}>
      <body>
        {children}
        <AttributionCapture />
        <Analytics />
      </body>
    </html>
  )
}
