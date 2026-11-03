import Image from "next/image"
import { Browser } from "@/components/ui/Browser"
import { FeatureList } from "@/components/ui/Check"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import type { Dict } from "@/lib/dict/es"
import { site } from "@/lib/config"
import { ChatDemo, type ChatMsg } from "@/components/ui/ChatDemo"

import { NodoSpotlight } from "@/components/sections/NodoSpotlight"


function Tag({ n, name }: { n: string; name: string }) {
  return (
    <p className="t-label mb-5 flex items-center gap-2 text-muted">
      <span className="text-brand-ink">{n}</span> {name}
    </p>
  )
}

export function Ecosystem({ d }: { d: Dict }) {
  const e = d.ecosystem
  return (
    <section id="ecosistema" className="bg-mist py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <Reveal>
            <h2 className="t-h2">{e.title}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="t-lead">
              {e.lead}
            </p>
            <div className="mt-6">
              <Cta ctx={{ section: "ecosistema", type: "link" }} href="#soluciones-web" variant="ghost">{e.seeSolutions}</Cta>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* WEB */}
          <Reveal className="lg:col-span-7">
            <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white p-7 shadow-soft sm:p-9">
              <Tag n="01" name={e.web.name} />
              <h3 className="t-h3 max-w-md">{e.web.title}</h3>
              <p className="mt-4 max-w-lg text-muted">
                {e.web.text}
              </p>
              <div className="mt-6"><FeatureList items={e.web.features} /></div>
              <div className="mt-7 mb-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Cta ctx={{ section: "ecosistema-web", product: "web", type: "card" }} href="#soluciones-web">{e.web.cta}</Cta>
                <Cta ctx={{ section: "ecosistema-web", product: "web", type: "link" }} href="#proyectos" variant="ghost">{e.web.cta2}</Cta>
              </div>
              <Browser
                className="mt-auto -mb-14 translate-x-8 sm:translate-x-12"
                src="/projects/wt-desktop.webp" alt={e.web.alt} width={1440} height={900} sizes="(min-width:1024px) 600px, 90vw"
              />
            </article>
          </Reveal>

          {/* NEXO */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <article className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-ink p-7 text-white sm:p-9">
              <div className="bg-dots-dark pointer-events-none absolute inset-0" aria-hidden />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <p className="t-label flex items-center gap-2 text-white/50"><span className="text-brand">02</span> {e.nexo.name}</p>
                  <Image src="/logos/nexo-mark.png" alt="" width={28} height={28} className="size-7 rounded-md" />
                </div>
                <h3 className="t-h3 mt-5">{e.nexo.title}</h3>
                <p className="mt-4 text-white/65">
                  {e.nexo.text}
                </p>
                <div className="mt-6"><FeatureList items={e.nexo.features} dark /></div>
                <div className="mt-8 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <p className="t-label mb-3 text-[0.6rem] text-white/40">{e.nexo.example}</p>
                  <ChatDemo variant="dark" messages={e.nexo.chat as ChatMsg[]} footer={e.nexo.chatFooter} />
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                  <Cta ctx={{ section: "ecosistema-nexo", product: "nexo", type: "card" }} whatsapp="nexo" variant="light">{e.nexo.cta}</Cta>
                  <Cta ctx={{ section: "ecosistema-nexo", product: "nexo", type: "link" }} href={site.nexoUrl} variant="ghost-light" event="click_contact">{e.nexo.cta2}</Cta>
                </div>
              </div>
            </article>
          </Reveal>

          <NodoSpotlight d={d} />
        </div>
      </div>
    </section>
  )
}
