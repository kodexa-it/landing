import Image from "next/image"
import { Browser } from "@/components/ui/Browser"
import { FeatureList } from "@/components/ui/Check"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { site } from "@/lib/config"

const features = ["Sistema de gestión (ABM) para administrar el contenido.", "Integración mediante API.", "Arquitectura escalable.", "Contenido dinámico."]

/** Waste Treatment: datos y capturas reales del sitio original; sin métricas ni resultados inventados. */
export function FeaturedProject() {
  return (
    <section id="proyectos" className="on-dark relative overflow-hidden bg-graphite py-24 text-white lg:py-32">
      <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <p className="t-label mb-5 text-white/50">Proyecto destacado</p>
          <h2 className="t-h2 max-w-3xl">Soluciones digitales pensadas para negocios reales.</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="flex h-11 items-center rounded-lg bg-white px-3"><Image src="/logos/wt-logo.png" alt="Logo de Waste Treatment" width={110} height={44} className="h-7 w-auto" /></span>
              <span className="t-label rounded-full border border-white/20 px-3 py-1 text-white/70">En desarrollo</span>
            </div>
            <h3 className="mt-6 text-3xl font-semibold tracking-tight">Waste Treatment</h3>
            <p className="mt-3 text-white/65">
              Empresa dedicada a la gestión y el transporte de residuos industriales y especiales, con foco en el cumplimiento normativo y la trazabilidad de cada servicio.
            </p>

            <dl className="mt-7 space-y-6 border-t border-white/10 pt-7">
              <div>
                <dt className="t-label text-brand">El desafío</dt>
                <dd className="mt-2 text-white/75">Una web institucional que la empresa pueda mantener actualizada con facilidad, que escale con el negocio y que ayude a operar el día a día.</dd>
              </div>
              <div>
                <dt className="t-label text-brand">La solución</dt>
                <dd className="mt-2 text-white/75">Un sitio institucional dinámico con arquitectura basada en API y un sistema de gestión (ABM), diseñado y desarrollado a medida por Kodexa.</dd>
              </div>
            </dl>

            <div className="mt-7"><FeatureList items={features} dark /></div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta ctx={{ section: "proyecto-waste-treatment", type: "primary" }} href={site.wasteTreatmentCaseUrl} event="project_view" variant="light">Ver proyecto</Cta>
              <Cta ctx={{ section: "proyecto-waste-treatment", service: "a-medida", type: "link" }} whatsapp="proyecto" variant="ghost-light">Quiero algo similar</Cta>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={28}>
            <div className="relative pb-10 pr-6 sm:pr-14">
              <Browser
                src="/projects/wt-desktop.webp" alt="Inicio del sitio de Waste Treatment en escritorio" width={1440} height={900}
                sizes="(min-width:1024px) 700px, 92vw" className="border-white/10 shadow-lift"
              />
              <div className="float-slow absolute -bottom-2 right-0 w-[26%] min-w-[96px] overflow-hidden rounded-[1.4rem] border-[5px] border-ink bg-ink shadow-lift">
                <Image src="/projects/wt-mobile.webp" alt="Sitio de Waste Treatment en mobile" width={330} height={601} sizes="180px" className="h-auto w-full" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
