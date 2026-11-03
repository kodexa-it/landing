import { BellRing, Contact, KanbanSquare, ListChecks, Workflow, Building2 } from "lucide-react"
import { Browser } from "@/components/ui/Browser"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"

const pillars = [
  { icon: Contact, t: "Gestión de contactos", d: "Clientes, empresas y leads con su historial en un solo lugar." },
  { icon: KanbanSquare, t: "Pipeline comercial", d: "Cada oportunidad en su etapa, con su monto y su próximo paso." },
  { icon: ListChecks, t: "Tareas y actividades", d: "Seguimientos y recordatorios para que ninguna consulta se pierda." },
  { icon: Workflow, t: "Automatizaciones", d: "Procesos que se repiten, resueltos sin trabajo manual." },
  { icon: Building2, t: "Organización comercial", d: "Una visión clara de qué está pasando con tus ventas." },
  { icon: BellRing, t: "Seguimiento de oportunidades", d: "Sabés con quién hablar y qué quedó pendiente." },
]

/** Nodo, el CRM: bloque protagonista del ecosistema. Capturas reales del producto con datos de demostración. */
export function NodoSpotlight() {
  return (
    <Reveal delay={0.12} className="lg:col-span-12">
      <article id="nodo" className="on-dark relative overflow-hidden rounded-[1.75rem] bg-ink text-white">
        <div className="bg-dots-dark pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-brand/20 blur-[120px]" aria-hidden />

        <div className="relative grid grid-cols-1 gap-12 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-14">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <p className="t-label text-white/50"><span className="text-brand">03</span> Nodo</p>
              <span className="t-label rounded-full bg-brand px-3 py-1 text-ink">CRM · Producto insignia</span>
            </div>
            <h3 className="t-h2 mt-6">Todas tus oportunidades, en un solo lugar.</h3>
            <p className="mt-5 max-w-lg text-lg text-white/70">
              Nodo es el CRM de Kodexa para centralizar clientes, leads y oportunidades comerciales, organizar procesos y automatizar el seguimiento. Es el centro de tu estructura digital: donde llega, se ordena y avanza cada oportunidad.
            </p>

            <ul className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] ring-1 ring-white/10"><Icon className="size-[18px] text-brand" aria-hidden /></span>
                  <div>
                    <p className="text-[0.95rem] font-medium">{t}</p>
                    <p className="mt-0.5 text-[0.85rem] leading-snug text-white/55">{d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta ctx={{ section: "ecosistema-nodo", product: "nodo", type: "primary" }} whatsapp="nodo" variant="light">Conocé Nodo</Cta>
              <Cta ctx={{ section: "ecosistema-nodo", product: "nodo", service: "nodo", type: "link" }} href="#contacto" variant="ghost-light">Quiero Nodo en mi negocio</Cta>
            </div>
          </div>

          {/* Capturas reales superpuestas */}
          <div className="relative pb-14 lg:self-center lg:pb-20">
            <Browser
              src="/images/nodo-pipeline.webp" alt="Tablero Kanban de oportunidades en Nodo, con etapas de Lead a Ganado" width={1800} height={1012}
              caption="Nodo · pipeline · datos de demostración" sizes="(min-width:1024px) 640px, 92vw" className="border-white/10 shadow-lift"
            />
            <Browser
              src="/images/nodo-dashboard.webp" alt="Inicio de Nodo con indicadores, pipeline abierto y actividad reciente" width={1600} height={900}
              caption="Nodo · inicio · datos de demostración" sizes="(min-width:1024px) 420px, 70vw"
              className="float-slow absolute -bottom-2 right-0 w-[68%] border-white/10 shadow-lift sm:w-[62%]"
            />
          </div>
        </div>
      </article>
    </Reveal>
  )
}
