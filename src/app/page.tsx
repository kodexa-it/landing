import { AboutKodexa } from "@/components/sections/AboutKodexa"
import { ContactSection } from "@/components/sections/ContactSection"
import { CustomDevelopment } from "@/components/sections/CustomDevelopment"
import { Ecosystem } from "@/components/sections/Ecosystem"
import { EcosystemFlow } from "@/components/sections/EcosystemFlow"
import { FeaturedProject } from "@/components/sections/FeaturedProject"
import { Hero } from "@/components/sections/Hero"
import { WebSolutions } from "@/components/sections/WebSolutions"

export default function Home() {
  return (
    <>
      <Hero />
      <Ecosystem />
      <EcosystemFlow />
      <FeaturedProject />
      <WebSolutions />
      <CustomDevelopment />
      <ContactSection />
      <AboutKodexa />
    </>
  )
}
