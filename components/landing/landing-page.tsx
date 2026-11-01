import { LandingContact } from "@/components/sections/landing-contact"
import { DesktopTop, DesktopBottom } from "./desktop"
import { MobileTop, MobileBottom } from "./mobile"
import { MobileHeader } from "./mobile-header"
import { Tracked } from "./tracked"

/**
 * Landing V2 completa. Hoy se arma con las dos composiciones aprobadas en Claude Design:
 *  - Desktop (MainV2, ≥1024px, clase .dk)  - Mobile (MobileV2, <1024px, clase .mb; ids con prefijo m-).
 * El contacto es una sola sección responsive para ambas. `lg:contents` evita que los wrappers corten el header sticky.
 */
export function LandingPage() {
  return (
    <Tracked>
      <div className="dk hidden lg:contents"><DesktopTop /></div>
      <div className="mb contents lg:hidden">
        <MobileHeader />
        <div id="m-top" />
        <MobileTop />
      </div>
      <LandingContact />
      <div className="dk hidden lg:contents"><DesktopBottom /></div>
      <div className="mb contents lg:hidden"><MobileBottom /></div>
    </Tracked>
  )
}
