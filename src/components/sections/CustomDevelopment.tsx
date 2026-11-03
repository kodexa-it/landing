import { Boxes, Cable, Cog, Database, LayoutPanelTop, Workflow } from "lucide-react"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"

const caps = [
  { icon: LayoutPanelTop, t: "Desarrollo de plataformas web" },
  { icon: Database, t: "Sistemas de gestión" },
  { icon: Workflow, t: "Automatización de procesos" },
  { icon: Cable, t: "Integraciones entre sistemas" },
  { icon: Boxes, t: "Aplicaciones personalizadas" },
  { icon: Cog, t: "Soluciones para operaciones comerciales" },
]

/** Diagrama abstracto de sistema: nodos y conexiones (decorativo). */
function SystemArt() {
  return (
    <svg viewBox="0 0 420 420" className="w-full max-w-[420px]" aria-hidden fill="none">
      <g stroke="rgb(255 255 255 / 0.18)" strokeWidth="1">
        <path d="M210 210 L80 90 M210 210 L340 80 M210 210 L350 250 M210 210 L90 320 M80 90 L340 80 M350 250 L90 320 M340 80 L350 250" />
      </g>
      <path className="flow-line" d="M210 210 L340 80 M210 210 L90 320" stroke="var(--color-brand)" strokeWidth="1.5" />
      {[[80, 90], [340, 80], [350, 250], [90, 320]].map(([x, y]) => (
        <g key={`${x}-${y}`}><circle cx={x} cy={y} r="22" fill="#111" stroke="rgb(255 255 255 / 0.35)" /><circle cx={x} cy={y} r="5" fill="#fff" /></g>
      ))}
      <circle cx="210" cy="210" r="46" fill="var(--color-brand)" opacity="0.12" />
      <circle cx="210" cy="210" r="30" fill="#111" stroke="var(--color-brand)" strokeWidth="1.5" />
      <circle cx="210" cy="210" r="9" fill="var(--color-brand)" className="node-pulse" />
    </svg>
  )
}

export function CustomDevelopment() {
  return (
    <section id="desarrollo-a-medida" className="on-dark relative overflow-hidden bg-[#0b0b0b] py-24 text-white lg:py-32">
      <div className="bg-dots-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <p className="t-label mb-5 flex items-center gap-3 text-white/50"><span className="h-px w-8 bg-brand" /> Desarrollo a medida</p>
            <h2 className="t-h2">¿Tu negocio necesita algo que todavía no existe?</h2>
            <p className="mt-6 max-w-xl text-lg text-white/65">
              Desarrollamos tecnología a medida para resolver problemas reales, optimizar procesos y conectar herramientas que hacen funcionar tu negocio.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {caps.map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[0.93rem] text-white/85">
                  <Icon className="size-[18px] shrink-0 text-brand" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Cta ctx={{ section: "desarrollo-a-medida", service: "a-medida", type: "primary" }} href="#contacto" variant="light">Contanos qué necesitás</Cta>
                <Cta ctx={{ section: "desarrollo-a-medida", service: "a-medida", type: "link" }} whatsapp="a-medida" variant="ghost-light">Escribinos por WhatsApp</Cta>
              </div>
              <p className="mt-4 max-w-md text-sm text-white/45">No hace falta que sepas qué tecnología necesitás: contanos el problema y lo pensamos juntos.</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="mx-auto flex justify-center"><SystemArt /></div>
        </Reveal>
      </div>
    </section>
  )
}
