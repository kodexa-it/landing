import { Globe, MessageCircle, LayoutDashboard, Search, Megaphone, Share2, MousePointerClick, TrendingUp } from "lucide-react"
import type { ReactNode } from "react"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { ViewTracker } from "@/components/ui/ViewTracker"

const sources = [
  { icon: Search, label: "Búsqueda orgánica" },
  { icon: Megaphone, label: "Campañas" },
  { icon: Share2, label: "Redes sociales" },
  { icon: MousePointerClick, label: "Tráfico directo" },
]

const steps = [
  { n: "01", verb: "Atraer", name: "Web", icon: Globe, text: "La web representa al negocio, trabaja el posicionamiento orgánico y recibe tráfico proveniente de campañas, redes sociales y otros canales." },
  { n: "02", verb: "Conectar", name: "Nexo", icon: MessageCircle, text: "Nexo recibe las consultas, responde preguntas, brinda información y ayuda a identificar oportunidades comerciales mediante WhatsApp e inteligencia artificial." },
  { n: "03", verb: "Gestionar", name: "Nodo", icon: LayoutDashboard, text: "Nodo centraliza los leads y permite organizar oportunidades, realizar seguimientos y automatizar procesos comerciales." },
]

/** Conector animado: horizontal en desktop, vertical en mobile. */
function Connector() {
  return (
    <>
      <svg className="hidden h-3 w-full min-w-8 flex-[0_0_44px] self-center lg:block" aria-hidden>
        <line x1="0" y1="6" x2="100%" y2="6" className="flow-line" stroke="var(--color-brand)" strokeWidth="1.5" />
      </svg>
      <svg className="mx-auto block h-10 w-3 lg:hidden" aria-hidden>
        <line x1="6" y1="0" x2="6" y2="100%" className="flow-line" stroke="var(--color-brand)" strokeWidth="1.5" />
      </svg>
    </>
  )
}

function Node({ n, verb, name, icon: Icon, text }: (typeof steps)[number]) {
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

export function EcosystemFlow(): ReactNode {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32">
      <ViewTracker event="ecosystem_view" params={{ section: "como-funciona" }} />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <p className="t-label mb-5 text-muted">Cómo funciona el ecosistema</p>
          <h2 className="t-h2 max-w-3xl">De la primera visita a una oportunidad de negocio.</h2>
          <p className="t-lead mt-5 max-w-xl">Cada punto de contacto puede convertirse en parte de un proceso conectado.</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-16">
          <div className="flex flex-col items-stretch lg:flex-row">
            {/* Fuentes de tráfico */}
            <ul className="grid grid-cols-2 gap-2.5 lg:w-[190px] lg:shrink-0 lg:grid-cols-1 lg:self-center" aria-label="Fuentes de tráfico">
              {sources.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 rounded-full border border-line bg-mist px-4 py-2.5 text-[0.85rem]">
                  <Icon className="size-4 shrink-0 text-ink/60" aria-hidden /> {label}
                </li>
              ))}
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
                <p className="t-label text-brand">04 — Crecer</p>
                <p className="mt-2 max-w-2xl text-white/75">
                  El negocio dispone de una estructura tecnológica que le permite trabajar de manera más organizada y escalar sus operaciones.
                </p>
              </div>
            </div>
            <p className="t-label shrink-0 text-white/50">Web atrae · Nexo conecta · Nodo organiza · Kodexa integra</p>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-line bg-mist p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <h3 className="t-h3">¿Querés ver cómo se conectaría en tu negocio?</h3>
              <p className="mt-2 max-w-xl text-muted">Contanos cómo captás clientes hoy y armamos juntos el recorrido que mejor te sirva.</p>
            </div>
            <div className="flex flex-col gap-3 sm:shrink-0">
              <Cta ctx={{ section: "como-funciona", type: "primary" }} whatsapp="hero" arrow={false}>Hablemos de tu proyecto</Cta>
              <Cta ctx={{ section: "como-funciona", service: "asesoramiento", type: "link" }} href="#contacto" variant="ghost">Prefiero dejar mi consulta</Cta>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 max-w-2xl text-sm text-muted">
          Las conexiones entre Web, Nexo y Nodo se definen según el alcance de cada proyecto; este recorrido describe las posibilidades de integración, no funciones incluidas por defecto en todos los casos.
        </p>
      </div>
    </section>
  )
}
