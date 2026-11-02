import Image from "next/image"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"

/** Composición del hero: tres módulos conectados (Web, Nexo, Nodo) con recursos reales de Kodexa. */
function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/5.6] w-full max-w-[560px] lg:mx-0" aria-label="Composición: sitio web, asistente de WhatsApp y CRM conectados" role="img">
      {/* Conexiones */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 500 560" fill="none" aria-hidden>
        <path className="flow-line" d="M150 235 C 150 280, 150 290, 150 330" stroke="var(--color-brand)" strokeWidth="1.5" />
        <path className="flow-line" d="M400 250 C 400 290, 380 300, 380 330" stroke="var(--color-brand)" strokeWidth="1.5" />
      </svg>

      {/* WEB: sitio real (Waste Treatment) en marco de navegador */}
      <div className="absolute left-0 top-0 w-[68%] overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-line bg-mist px-3 py-2">
          <span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" />
          <span className="t-label ml-2 text-[0.6rem] text-muted">Web</span>
        </div>
        <Image src="/projects/wt-desktop.webp" alt="Sitio web desarrollado por Kodexa para Waste Treatment" width={1440} height={900} priority sizes="(min-width:1024px) 380px, 70vw" className="h-auto w-full" />
      </div>

      {/* NEXO: conversación de ejemplo (mockup conceptual) */}
      <div className="float-slow absolute right-0 top-[26%] z-20 w-[54%] rounded-2xl border border-line bg-white/95 p-4 shadow-lift backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-brand" /> Nexo</span>
          <span className="t-label text-[0.58rem] text-muted">Ejemplo</span>
        </div>
        <div className="space-y-2 text-[0.78rem] leading-snug">
          <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-mist px-3 py-2">Hola, quiero cotizar el servicio para mi empresa.</p>
          <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-white">¡Hola! Te ayudo. ¿Qué necesitás y para cuántas sedes?</p>
        </div>
      </div>

      {/* NODO: CRM real (datos de demostración) */}
      <div className="absolute bottom-0 left-[3%] z-10 w-[80%] overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-line bg-mist px-3 py-2">
          <span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" />
          <span className="t-label ml-2 text-[0.6rem] text-muted">Nodo · demo</span>
        </div>
        <Image src="/images/nodo-pipeline.webp" alt="Pipeline comercial de Nodo, el CRM de Kodexa, con datos de demostración" width={1800} height={1012} sizes="(min-width:1024px) 410px, 74vw" className="h-auto w-full object-cover object-left-top" />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div>
          <Reveal>
            <p className="t-label mb-6 flex items-center gap-3 text-muted">
              <span className="h-px w-8 bg-brand" /> Estudio tecnológico
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="t-display">
              Tu negocio, conectado para <span className="text-brand">crecer.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="t-lead mt-7 max-w-xl">
              Diseñamos experiencias web, conectamos tus canales comerciales y desarrollamos tecnología para que tu negocio pueda crecer con una estructura digital preparada para el futuro.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Cta ctx={{ section: "hero", type: "primary" }} whatsapp="hero">Hablemos de tu proyecto</Cta>
              <Cta ctx={{ section: "hero", type: "secondary" }} href="#ecosistema" variant="secondary" event="ecosystem_view" arrow={false}>Explorá el ecosistema</Cta>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="t-label mt-12 flex flex-wrap gap-x-6 gap-y-2 text-muted">
              <li><span className="text-ink">Web</span> atrae</li>
              <li><span className="text-ink">Nexo</span> conecta</li>
              <li><span className="text-ink">Nodo</span> organiza</li>
              <li><span className="text-brand-ink">Kodexa</span> integra</li>
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
