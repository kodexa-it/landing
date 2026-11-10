import { BellRing, Contact, KanbanSquare, ListChecks, Workflow, Building2 } from "lucide-react"
import { Browser } from "@/components/ui/Browser"
import { Cta } from "@/components/ui/Cta"
import { Parallax } from "@/components/ui/Parallax"
import { BetaBadge, BetaNote } from "@/components/ui/BetaNote"
import { Reveal } from "@/components/ui/Reveal"
import type { Dict } from "@/lib/dict/es"

const icons = [Contact, KanbanSquare, ListChecks, Workflow, Building2, BellRing]

/** Nodo, el CRM: bloque protagonista del ecosistema. Capturas reales del producto con datos de demostración. */
export function NodoSpotlight({ d }: { d: Dict }) {
  const n = d.nodo
  return (
    <Reveal delay={0.12} className="lg:col-span-12">
      <article id="nodo" className="on-dark relative overflow-hidden rounded-[1.75rem] bg-ink text-white">
        <div className="bg-dots-dark pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-brand/20 blur-[120px]" aria-hidden />

        <div className="relative grid grid-cols-1 gap-12 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-14">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <p className="t-label text-white/50"><span className="text-brand">03</span> {n.name}</p>
              <span className="t-label rounded-full bg-brand px-3 py-1 text-ink">{n.badge}</span>
              <BetaBadge d={d} />
            </div>
            <h3 className="t-h2 mt-6">{n.title}</h3>
            <p className="mt-5 max-w-lg text-lg text-white/70">
              {n.text}
            </p>

            <ul className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {n.pillars.map(({ t, d: desc }, i) => {
                const Icon = icons[i]
                return (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] ring-1 ring-white/10"><Icon className="size-[18px] text-brand" aria-hidden /></span>
                  <div>
                    <p className="text-[0.95rem] font-medium">{t}</p>
                    <p className="mt-0.5 text-[0.85rem] leading-snug text-white/55">{desc}</p>
                  </div>
                </li>
                )
              })}
            </ul>

            <BetaNote d={d} className="mt-8 max-w-lg" />

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta ctx={{ section: "ecosistema-nodo", product: "nodo", type: "primary" }} whatsapp="nodo" variant="light">{n.cta}</Cta>
              <Cta ctx={{ section: "ecosistema-nodo", product: "nodo", service: "nodo", type: "link" }} href="#contacto" variant="ghost-light">{n.cta2}</Cta>
            </div>
          </div>

          {/* Capturas reales superpuestas */}
          <div className="relative pb-14 lg:self-center lg:pb-20">
            <Parallax from={-10} to={10}>
            <Browser
              src="/images/nodo-pipeline.webp" alt={n.pipelineAlt} width={1800} height={1012}
              caption={n.pipelineCaption} sizes="(min-width:1024px) 640px, 92vw" className="border-white/10 shadow-lift"
            />
            </Parallax>
            <Browser
              src="/images/nodo-dashboard.webp" alt={n.dashAlt} width={1600} height={900}
              caption={n.dashCaption} sizes="(min-width:1024px) 420px, 70vw"
              className="float-slow absolute -bottom-2 right-0 w-[68%] border-white/10 shadow-lift sm:w-[62%]"
            />
          </div>
        </div>
      </article>
    </Reveal>
  )
}
