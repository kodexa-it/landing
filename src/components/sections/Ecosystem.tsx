import Image from "next/image"
import { Browser } from "@/components/ui/Browser"
import { FeatureList } from "@/components/ui/Check"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { site } from "@/lib/config"
import { ChatDemo, type ChatMsg } from "@/components/ui/ChatDemo"

const nexoChat: ChatMsg[] = [
  { from: "user", text: "Hola, quiero cotizar el producto que vi en su web. ¿Hacen envíos al interior?" },
  { from: "bot", text: "¡Hola! Sí, enviamos al interior. ¿Qué producto te interesa y qué cantidad necesitás?" },
  { from: "user", text: "El modelo grande, unas 20 unidades." },
]
import { NodoSpotlight } from "@/components/sections/NodoSpotlight"

const web = ["Presencia digital profesional.", "Posicionamiento orgánico y SEO.", "Captación de oportunidades.", "Experiencias adaptadas a cada negocio.", "Integración con herramientas comerciales."]
const nexo = ["Atención mediante WhatsApp.", "Respuestas asistidas por inteligencia artificial.", "Personalidad y conocimiento adaptados al negocio.", "Calificación de leads.", "Automatización de consultas.", "Integración con la presencia digital."]

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
              <div className="mt-7 mb-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Cta ctx={{ section: "ecosistema-web", product: "web", type: "card" }} href="#soluciones-web">Conocé nuestras soluciones web</Cta>
                <Cta ctx={{ section: "ecosistema-web", product: "web", type: "link" }} href="#proyectos" variant="ghost">Explorá nuestros desarrollos</Cta>
              </div>
              <Browser
                className="mt-auto -mb-14 translate-x-8 sm:translate-x-12"
                src="/projects/wt-desktop.webp" alt="Sitio de Waste Treatment desarrollado por Kodexa" width={1440} height={900} sizes="(min-width:1024px) 600px, 90vw"
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
                <div className="mt-8 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <p className="t-label mb-3 text-[0.6rem] text-white/40">Ejemplo ilustrativo: consulta comercial</p>
                  <ChatDemo variant="dark" messages={nexoChat} footer="Consulta lista para derivar al equipo comercial" />
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                  <Cta ctx={{ section: "ecosistema-nexo", product: "nexo", type: "card" }} whatsapp="nexo" variant="light">Conocé Nexo</Cta>
                  <Cta ctx={{ section: "ecosistema-nexo", product: "nexo", type: "link" }} href={site.nexoUrl} variant="ghost-light" event="click_contact">Ver nexo.kodexa.ar</Cta>
                </div>
              </div>
            </article>
          </Reveal>

          <NodoSpotlight />
        </div>
      </div>
    </section>
  )
}
