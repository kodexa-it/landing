import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { LogoMark } from "@/components/ui/Logo"
import { site } from "@/lib/config"

/** Cierre institucional: lleva al sitio original de Kodexa. Un único CTA. */
export function AboutKodexa() {
  return (
    <section id="conoce-kodexa" className="on-dark relative overflow-hidden bg-ink py-28 text-white lg:py-40">
      <LogoMark className="pointer-events-none absolute -right-16 top-1/2 h-[520px] -translate-y-1/2 text-white opacity-[0.04]" />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <p className="t-label mb-6 flex items-center gap-3 text-white/50"><span className="h-px w-8 bg-brand" /> Kodexa</p>
          <h2 className="t-h2 max-w-3xl">Hay mucho más detrás de cada solución.</h2>
          <p className="mt-6 max-w-xl text-lg text-white/65">Conocé nuestra visión, cómo trabajamos y todo lo que podemos construir junto a tu negocio.</p>
          <div className="mt-10">
            <Cta ctx={{ section: "cierre-institucional", product: "kodexa", type: "primary" }} href={site.institutionalUrl} event="institutional_site_click" variant="light" arrow="up-right">
              Conocé más sobre Kodexa
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
