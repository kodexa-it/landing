import type { Dict } from "@/lib/dict/es"
import { HeroHeadline } from "@/components/sections/HeroHeadline"
import { HeroVisual } from "@/components/sections/HeroVisual"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"

export function Hero({ d }: { d: Dict }) {
  const h = d.hero
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div>
          <Reveal>
            <p className="t-label mb-6 flex items-center gap-3 text-muted">
              <span className="h-px w-8 bg-brand" /> {h.eyebrow}
            </p>
          </Reveal>
          <HeroHeadline words={h.headline} label={h.headlineLabel} />
          <Reveal delay={0.12}>
            <p className="t-lead mt-7 max-w-xl">
              {h.lead}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Cta ctx={{ section: "hero", type: "primary" }} whatsapp="hero">{h.primary}</Cta>
              <Cta ctx={{ section: "hero", type: "secondary" }} href="#ecosistema" variant="secondary" event="ecosystem_view" arrow={false}>{h.secondary}</Cta>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="t-label mt-12 flex flex-wrap gap-x-6 gap-y-2 text-muted">
              <li><span className="text-ink">Web</span> {h.pills.web}</li>
              <li><span className="text-ink">Nexo</span> {h.pills.nexo}</li>
              <li><a href="#nodo" className="inline-flex items-center gap-1.5 hover:text-ink"><span className="size-1.5 rounded-full bg-brand" aria-hidden /><span className="text-ink">Nodo</span> {h.pills.nodo}</a></li>
              <li><span className="text-brand-ink">Kodexa</span> {h.pills.kodexa}</li>
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={28}>
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  )
}
