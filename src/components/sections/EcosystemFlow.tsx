import { Globe, MessageCircle, LayoutDashboard, Search, Megaphone, Share2, MousePointerClick, TrendingUp } from "lucide-react"
import type { ReactNode } from "react"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { ViewTracker } from "@/components/ui/ViewTracker"
import type { Dict } from "@/lib/dict/es"

const sourceIcons = [Search, Megaphone, Share2, MousePointerClick]
const stepMeta = [{ n: "01", icon: Globe }, { n: "02", icon: MessageCircle }, { n: "03", icon: LayoutDashboard }]
type Step = { n: string; verb: string; name: string; icon: typeof Globe; text: string }

/** Conector animado: horizontal en desktop, vertical en mobile. */
function Connector() {
  return (
    <>
      <div className="relative hidden h-3 w-full min-w-8 flex-[0_0_44px] self-center lg:block">
        <svg className="absolute inset-0 size-full" aria-hidden>
          <line x1="0" y1="6" x2="100%" y2="6" className="flow-line" stroke="var(--color-brand)" strokeWidth="1.5" />
        </svg>
        <span className="travel-dot travel-x" aria-hidden />
      </div>
      <div className="relative mx-auto block h-10 w-3 lg:hidden">
        <svg className="absolute inset-0 size-full" aria-hidden>
          <line x1="6" y1="0" x2="6" y2="100%" className="flow-line" stroke="var(--color-brand)" strokeWidth="1.5" />
        </svg>
        <span className="travel-dot travel-y" aria-hidden />
      </div>
    </>
  )
}

function Node({ n, verb, name, icon: Icon, text }: Step) {
  return (
    <div className="relative w-full rounded-2xl border border-line bg-white p-6 shadow-soft lg:min-w-0 lg:flex-1">
      <div className="flex items-center justify-between">
        <span className="t-label text-brand-ink">{n} — {verb}</span>
        <span className="relative flex size-10 items-center justify-center rounded-xl bg-ink text-white">
          <Icon className="size-5" aria-hidden />
          <span className="pulse-ring absolute inset-0 rounded-xl border border-brand" aria-hidden />
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight">{name}</p>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{text}</p>
    </div>
  )
}

export function EcosystemFlow({ d }: { d: Dict }): ReactNode {
  const f = d.flow
  const steps: Step[] = f.steps.map((s, i) => ({ ...s, ...stepMeta[i] }))
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32">
      <ViewTracker event="ecosystem_view" params={{ section: "como-funciona" }} />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <p className="t-label mb-5 text-muted">{f.eyebrow}</p>
          <h2 className="t-h2 max-w-3xl">{f.title}</h2>
          <p className="t-lead mt-5 max-w-xl">{f.lead}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-16">
          <div className="flex flex-col items-stretch lg:flex-row">
            {/* Fuentes de tráfico */}
            <ul className="grid grid-cols-2 gap-2.5 lg:w-[190px] lg:shrink-0 lg:grid-cols-1 lg:self-center" aria-label={d.a11y.trafficSources}>
              {f.sources.map((label, i) => {
                const Icon = sourceIcons[i]
                return (
                <li key={label} className="flex items-center gap-2.5 rounded-full border border-line bg-mist px-4 py-2.5 text-[0.85rem]">
                  <Icon className="size-4 shrink-0 text-ink/60" aria-hidden /> {label}
                </li>
                )
              })}
            </ul>
            <Connector />
            {steps.map((s, i) => (
              <div key={s.n} className="contents">
                <Node {...s} />
                {i < steps.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        </Reveal>

        {/* 04 Crecer */}
        <Reveal delay={0.12} className="mt-10">
          <div className="on-dark flex flex-col gap-5 rounded-2xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="flex items-start gap-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-ink"><TrendingUp className="size-5" aria-hidden /></span>
              <div>
                <p className="t-label text-brand">{f.growLabel}</p>
                <p className="mt-2 max-w-2xl text-white/75">
                  {f.growText}
                </p>
              </div>
            </div>
            <p className="t-label shrink-0 text-white/50">{f.tagline}</p>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-line bg-mist p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <h3 className="t-h3">{f.ctaTitle}</h3>
              <p className="mt-2 max-w-xl text-muted">{f.ctaText}</p>
            </div>
            <div className="flex flex-col gap-3 sm:shrink-0">
              <Cta ctx={{ section: "como-funciona", type: "primary" }} whatsapp="hero" arrow={false}>{f.ctaPrimary}</Cta>
              <Cta ctx={{ section: "como-funciona", service: "asesoramiento", type: "link" }} href="#contacto" variant="ghost">{f.ctaSecondary}</Cta>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 max-w-2xl text-sm text-muted">
          {f.disclaimer}
        </p>
      </div>
    </section>
  )
}
