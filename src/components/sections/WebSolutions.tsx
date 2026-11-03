import { ArrowDownRight, Check } from "lucide-react"
import type { ReactNode } from "react"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import type { Dict } from "@/lib/dict/es"
import type { CtaContext } from "@/types"

function Ideal({ label, items, dark }: { label: string; items: readonly string[]; dark?: boolean }) {
  return (
    <div className="mt-6">
      <p className={`t-label mb-3 ${dark ? "text-white/50" : "text-muted"}`}>{label}</p>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className={`flex items-start gap-2.5 text-[0.93rem] ${dark ? "text-white/80" : "text-ink/80"}`}>
            <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden strokeWidth={2.5} /> {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Mockups esquemáticos (wireframes) de cada tipo de web. No son capturas de proyectos reales. */
function Wire({ kind }: { kind: "landing" | "institucional" | "pro" | "medida" }) {
  const bar = "rounded bg-ink/10"
  return (
    <div className="pointer-events-none select-none rounded-xl border border-line bg-white p-3 shadow-soft" aria-hidden>
      <div className="mb-2.5 flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-ink/15" /><span className="size-1.5 rounded-full bg-ink/15" /><span className="size-1.5 rounded-full bg-ink/15" /><span className={`${bar} ml-2 h-1.5 w-16`} /></div>
      {kind === "landing" && (
        <div className="space-y-2">
          <div className={`${bar} h-2.5 w-3/4`} /><div className={`${bar} h-2.5 w-1/2`} />
          <div className="h-6 w-20 rounded-full bg-brand" />
          <div className="grid grid-cols-3 gap-1.5 pt-1"><div className="h-9 rounded bg-mist" /><div className="h-9 rounded bg-mist" /><div className="h-9 rounded bg-mist" /></div>
        </div>
      )}
      {kind === "institucional" && (
        <div className="grid grid-cols-[1fr_1fr] gap-2">
          <div className="space-y-1.5"><div className={`${bar} h-2.5 w-full`} /><div className={`${bar} h-1.5 w-4/5`} /><div className={`${bar} h-1.5 w-3/5`} /><div className="mt-1 h-5 w-14 rounded-full bg-ink" /></div>
          <div className="h-[4.2rem] rounded bg-mist" />
          <div className="col-span-2 grid grid-cols-4 gap-1.5"><div className="h-6 rounded bg-mist" /><div className="h-6 rounded bg-mist" /><div className="h-6 rounded bg-mist" /><div className="h-6 rounded bg-mist" /></div>
        </div>
      )}
      {kind === "pro" && (
        <div className="grid grid-cols-[0.35fr_1fr] gap-2">
          <div className="space-y-1.5"><div className="h-2 rounded bg-brand" /><div className={`${bar} h-2`} /><div className={`${bar} h-2`} /><div className={`${bar} h-2`} /></div>
          <div className="space-y-2"><div className="grid grid-cols-3 gap-1.5"><div className="h-8 rounded bg-mist" /><div className="h-8 rounded bg-mist" /><div className="h-8 rounded bg-mist" /></div><div className="h-12 rounded bg-mist" /></div>
        </div>
      )}
      {kind === "medida" && (
        <div className="space-y-1.5 font-mono text-[0.6rem] leading-snug text-white/70"><div className="rounded-lg bg-ink p-3"><span className="text-brand">const</span> proceso = <span className="text-white">conectar</span>(<br />&nbsp;&nbsp;datos, equipo, clientes<br />)</div></div>
      )}
    </div>
  )
}

function Card({ n, title, tag, text, ideal, idealLabel, ctx, wa, cta, children, dark, className }: {
  idealLabel: string; n: string; title: string; tag: string; text: string; ideal: readonly string[]; ctx: CtaContext; wa: "landing" | "institucional" | "institucional-pro" | "a-medida"; cta: string; children: ReactNode; dark?: boolean; className?: string
}) {
  return (
    <article className={`flex h-full flex-col rounded-[1.5rem] p-7 sm:p-9 ${dark ? "on-dark bg-ink text-white" : "border border-line bg-white shadow-soft"} ${className ?? ""}`}>
      <p className={`t-label flex items-center gap-2 ${dark ? "text-white/50" : "text-muted"}`}><span className="text-brand-ink">{n}</span> {title}</p>
      <h3 className="t-h3 mt-4">{tag}</h3>
      <p className={`mt-3 ${dark ? "text-white/65" : "text-muted"}`}>{text}</p>
      <div className="mt-6">{children}</div>
      <Ideal label={idealLabel} items={ideal} dark={dark} />
      <div className="mt-auto pt-8">
        <Cta ctx={ctx} whatsapp={wa} variant={dark ? "light" : "primary"}>{cta}</Cta>
      </div>
    </article>
  )
}

export function WebSolutions({ d }: { d: Dict }) {
  const w = d.web
  return (
    <section id="soluciones-web" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <p className="t-label mb-5 text-muted">{w.eyebrow}</p>
          <h2 className="t-h2 max-w-3xl">{w.title}</h2>
          <p className="t-lead mt-5 max-w-2xl">
            {w.lead}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Card idealLabel={w.ideal} n="01" title={w.landing.title} tag={w.landing.tag} wa="landing" cta={w.landing.cta}
              ctx={{ section: "soluciones-landing", service: "landing", product: "web" }}
              text={w.landing.text}
              ideal={w.landing.ideal}>
              <Wire kind="landing" />
            </Card>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-7">
            <Card idealLabel={w.ideal} n="02" title={w.institucional.title} tag={w.institucional.tag} wa="institucional" cta={w.institucional.cta}
              ctx={{ section: "soluciones-institucional", service: "institucional", product: "web" }}
              text={w.institucional.text}
              ideal={w.institucional.ideal}>
              <Wire kind="institucional" />
            </Card>
          </Reveal>

          {/* Institucional Pro: tratamiento destacado */}
          <Reveal delay={0.08} className="lg:col-span-12">
            <article className="relative overflow-hidden rounded-[1.75rem] border-2 border-ink bg-white p-7 sm:p-10">
              <span className="t-label absolute right-6 top-6 rounded-full bg-brand px-3 py-1 text-ink">{w.pro.badge}</span>
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="t-label flex items-center gap-2 text-muted"><span className="text-brand-ink">03</span> {w.pro.title}</p>
                  <h3 className="t-h2 mt-4">{w.pro.tag}</h3>
                  <p className="mt-4 max-w-xl text-muted">
                    {w.pro.text}
                  </p>
                  <Ideal label={w.ideal} items={w.pro.ideal} />
                  <div className="mt-8"><Cta ctx={{ section: "soluciones-pro", service: "institucional-pro", product: "web" }} whatsapp="institucional-pro">{w.pro.cta}</Cta></div>
                </div>
                <div className="w-full max-w-lg lg:ml-auto"><Wire kind="pro" /></div>
              </div>
            </article>
          </Reveal>

          {/* Desarrollo a medida: puente hacia la sección siguiente */}
          <Reveal delay={0.1} className="lg:col-span-12">
            <a href="#desarrollo-a-medida" className="group on-dark flex flex-col justify-between gap-6 rounded-[1.5rem] bg-ink p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="t-label text-white/50"><span className="text-brand">04</span> {w.bridge.title}</p>
                <h3 className="t-h3 mt-3">{w.bridge.tag}</h3>
                <p className="mt-2 max-w-xl text-white/65">{w.bridge.text}</p>
              </div>
              <span className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 font-medium text-ink transition-colors group-hover:bg-brand">
                {w.bridge.cta} <ArrowDownRight className="size-4" aria-hidden />
              </span>
            </a>
          </Reveal>
        </div>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-mist p-6 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <p className="max-w-xl text-[0.95rem] text-ink/80">{w.advice}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Cta ctx={{ section: "soluciones-web", service: "asesoramiento", type: "secondary" }} href="#contacto" variant="secondary" arrow={false}>{w.adviceCta}</Cta>
            <Cta ctx={{ section: "soluciones-web", product: "web", type: "link" }} whatsapp="web" variant="ghost">{w.adviceWa}</Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
