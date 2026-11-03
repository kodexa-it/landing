import { notFound } from "next/navigation"
import { AboutKodexa } from "@/components/sections/AboutKodexa"
import { ContactSection } from "@/components/sections/ContactSection"
import { CustomDevelopment } from "@/components/sections/CustomDevelopment"
import { Ecosystem } from "@/components/sections/Ecosystem"
import { EcosystemFlow } from "@/components/sections/EcosystemFlow"
import { FeaturedProject } from "@/components/sections/FeaturedProject"
import { Hero } from "@/components/sections/Hero"
import { WebSolutions } from "@/components/sections/WebSolutions"
import { getDict, isLocale } from "@/lib/i18n"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const d = getDict(lang)
  return (
    <>
      <Hero d={d} />
      <Ecosystem d={d} />
      <EcosystemFlow d={d} />
      <FeaturedProject d={d} locale={lang} />
      <WebSolutions d={d} />
      <CustomDevelopment d={d} />
      <ContactSection d={d} />
      <AboutKodexa d={d} locale={lang} />
    </>
  )
}
