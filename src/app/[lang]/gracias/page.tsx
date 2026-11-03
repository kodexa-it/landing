import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ThanksContent } from "@/components/sections/ThanksContent"
import { getDict, isLocale, thanksPath } from "@/lib/i18n"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const d = getDict(lang)
  return {
    title: d.meta.thanksTitle,
    description: d.meta.thanksDescription,
    alternates: { canonical: thanksPath(lang), languages: { es: thanksPath("es"), en: thanksPath("en") } },
    // Página de confirmación: nunca se indexa.
    robots: { index: false, follow: true },
  }
}

export default async function GraciasPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return <ThanksContent />
}
