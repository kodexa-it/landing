import Image from "next/image"
import { Browser } from "@/components/ui/Browser"
import { FeatureList } from "@/components/ui/Check"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { site } from "@/lib/config"

const web = ["Presencia digital profesional.", "Posicionamiento orgánico y SEO.", "Captación de oportunidades.", "Experiencias adaptadas a cada negocio.", "Integración con herramientas comerciales."]
const nexo = ["Atención mediante WhatsApp.", "Respuestas asistidas por inteligencia artificial.", "Personalidad y conocimiento adaptados al negocio.", "Calificación de leads.", "Automatización de consultas.", "Integración con la presencia digital."]
const nodo = ["Gestión de contactos.", "Pipeline comercial.", "Seguimiento de oportunidades.", "Tareas y actividades.", "Automatizaciones.", "Organización comercial."]

function Tag({ n, name }: { n: string; name: string }) {
  return (
    <p className="t-label mb-5 flex items-center gap-2 text-muted">
      <span className="text-brand-ink">{n}</span> {name}
    </p>
  )
}

export function Ecosystem() {
  return (
    <section id="ecosistema" className="bg-mist py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <Reveal>
            <h2 className="t-h2">Todo lo que tu negocio necesita para crecer, conectado.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="t-lead">
              No se trata de sumar herramientas aisladas. Se trata de construir una estructura digital donde cada solución cumple una función y trabaja en conjunto.
            </p>
            <div className="mt-6">
              <Cta ctx={{ section: "ecosistema", type: "link" }} href="#soluciones-web" variant="ghost">Conocé las soluciones</Cta>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* WEB */}
          <Reveal className="lg:col-span-7">
            <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white p-7 shadow-soft sm:p-9">
              <Tag n="01" name="Web" />
              <h3 className="t-h3 max-w-md">Tu negocio tiene que estar donde están tus clientes.</h3>
              <p className="mt-4 max-w-lg text-muted">
                Desarrollamos sitios web que representan tu marca, comunican tus servicios y funcionan como un activo digital para atraer visitantes y generar oportunidades.
              </p>
              <div className="mt-6"><FeatureList items={web} /></div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Cta ctx={{ section: "ecosistema-web", product: "web", type: "card" }} href="#soluciones-web">Conocé nuestras soluciones web</Cta>
                <Cta ctx={{ section: "ecosistema-web", product: "web", type: "link" }} href="#proyectos" variant="ghost">Explorá nuestros desarrollos</Cta>
              </div>
              <Browser
                className="mt-9 -mb-16 translate-x-6 sm:translate-x-12"
                src="/projects/wt-desktop.webp" alt="Sitio de Waste Treatment desarrollado por Kodexa" width={1440} height={900} sizes="(min-width:1024px) 640px, 90vw"
              />
            </article>
          </Reveal>

          {/* NEXO */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <article className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-ink p-7 text-white sm:p-9">
              <div className="bg-dots-dark pointer-events-none absolute inset-0" aria-hidden />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <p className="t-label flex items-center gap-2 text-white/50"><span className="text-brand">02</span> Nexo</p>
                  <Image src="/logos/nexo-mark.png" alt="" width={28} height={28} className="size-7 rounded-md" />
                </div>
                <h3 className="t-h3 mt-5">Cada consulta puede convertirse en una oportunidad.</h3>
                <p className="mt-4 text-white/65">
                  Nexo es el asistente digital de tu negocio. Atiende consultas, conversa con potenciales clientes, responde preguntas y ayuda a calificarlos mediante inteligencia artificial.
                </p>
                <div className="mt-6"><FeatureList items={nexo} dark /></div>
                <div className="mt-8 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10" aria-label="Ejemplo ilustrativo de una conversación con Nexo" role="img">
                  <p className="t-label mb-3 text-[0.6rem] text-white/40">Ejemplo ilustrativo: consulta comercial</p>
                  <div className="space-y-2 text-[0.82rem] leading-snug">
                    <p className="w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2.5">Hola, quiero cotizar el producto que vi en su web. ¿Hacen envíos al interior?</p>
                    <p className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-brand px-3.5 py-2.5 text-ink">¡Hola! Sí, enviamos al interior. ¿Qué producto te interesa y qué cantidad necesitás?</p>
                    <p className="w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2.5">El modelo grande, unas 20 unidades.</p>
                    <p className="mx-auto w-fit rounded-full border border-white/15 px-3 py-1 text-[0.7rem] text-white/60">Consulta lista para derivar al equipo comercial</p>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                  <Cta ctx={{ section: "ecosistema-nexo", product: "nexo", type: "card" }} whatsapp="nexo" variant="light">Conocé Nexo</Cta>
                  <Cta ctx={{ section: "ecosistema-nexo", product: "nexo", type: "link" }} href={site.nexoUrl} variant="ghost-light" event="click_contact">Ver nexo.kodexa.ar</Cta>
                </div>
              </div>
            </article>
          </Reveal>

          {/* NODO */}
          <Reveal delay={0.12} className="lg:col-span-12">
            <article className="grid grid-cols-1 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-soft lg:grid-cols-[0.8fr_1.2fr]">
              <div className="p-7 sm:p-9">
                <Tag n="03" name="Nodo" />
                <h3 className="t-h3">Todas tus oportunidades, en un solo lugar.</h3>
                <p className="mt-4 text-muted">
                  Nodo es el CRM de Kodexa para centralizar clientes, leads y oportunidades comerciales, organizar procesos y automatizar el seguimiento.
                </p>
                <div className="mt-6"><FeatureList items={nodo} /></div>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Cta ctx={{ section: "ecosistema-nodo", product: "nodo", type: "card" }} whatsapp="nodo">Conocé Nodo</Cta>
                </div>
              </div>
              <div className="relative bg-mist p-6 sm:p-9 lg:pr-0">
                <Browser
                  className="lg:rounded-r-none lg:border-r-0"
                  src="/images/nodo-pipeline.webp" alt="Tablero Kanban de oportunidades en Nodo" width={1800} height={1012}
                  caption="Nodo · datos de demostración" sizes="(min-width:1024px) 720px, 90vw"
                />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
