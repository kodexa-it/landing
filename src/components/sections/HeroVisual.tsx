"use client"

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion"
import { useSafeReducedMotion } from "@/components/ui/useMotionOk"
import Image from "next/image"
import { useI18n } from "@/components/i18n/I18nProvider"
import { ChatDemo, type ChatMsg } from "@/components/ui/ChatDemo"

/** Capa con entrada escalonada (externa) y parallax según el puntero (interna). */
function Layer({ className, delay, depth, mx, my, children }: { className: string; delay: number; depth: number; mx: MotionValue<number>; my: MotionValue<number>; children: React.ReactNode }) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth])
  const y = useTransform(my, [-0.5, 0.5], [-depth, depth])
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 36, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div style={{ x, y }}>{children}</motion.div>
    </motion.div>
  )
}

/** Composición del hero: Web, Nexo y Nodo conectados, con parallax sutil y líneas que se encienden en secuencia. */
export function HeroVisual() {
  const { d } = useI18n()
  const v = d.hero.visual
  const reduce = useSafeReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const mx = useSpring(rx, { stiffness: 90, damping: 18 })
  const my = useSpring(ry, { stiffness: 90, damping: 18 })

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return
    const r = e.currentTarget.getBoundingClientRect()
    rx.set((e.clientX - r.left) / r.width - 0.5)
    ry.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  const Wrap = reduce ? ({ className, children }: { className: string; children: React.ReactNode }) => <div className={className}>{children}</div> : null

  const web = (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
      <div className="flex items-center gap-1.5 border-b border-line bg-mist px-3 py-2">
        <span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" />
        <span className="t-label ml-2 text-[0.6rem] text-muted">{v.web}</span>
      </div>
      <Image src="/projects/wt-desktop.webp" alt={v.webAlt} width={1440} height={900} priority sizes="(min-width:1024px) 380px, 70vw" className="h-auto w-full" />
    </div>
  )
  const nexo = (
    <div className="float-slow rounded-2xl border border-line bg-white/95 p-4 shadow-lift backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-brand" /> Nexo</span>
        <span className="t-label text-[0.58rem] text-muted">{d.common.example}</span>
      </div>
      <ChatDemo variant="light" messages={v.chat as ChatMsg[]} className="!text-[0.76rem]" />
    </div>
  )
  const nodo = (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
      <div className="flex items-center gap-1.5 border-b border-line bg-mist px-3 py-2">
        <span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" /><span className="size-2 rounded-full bg-ink/15" />
        <span className="t-label ml-2 text-[0.6rem] text-muted">{v.nodoLabel}</span>
      </div>
      <Image src="/images/nodo-pipeline.webp" alt={v.nodoAlt} width={1800} height={1012} sizes="(min-width:1024px) 410px, 74vw" className="h-auto w-full object-cover object-left-top" />
    </div>
  )

  const layers = [
    { cls: "absolute left-0 top-0 w-[68%]", node: web, delay: 0.25, depth: 10 },
    { cls: "absolute right-0 top-[26%] z-20 w-[54%]", node: nexo, delay: 0.5, depth: 22 },
    { cls: "absolute bottom-0 left-[3%] z-10 w-[80%]", node: nodo, delay: 0.75, depth: 6 },
  ]

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="relative mx-auto aspect-[5/5.6] w-full max-w-[560px] lg:mx-0" role="img" aria-label={v.label}>
      <svg className="absolute inset-0 size-full" viewBox="0 0 500 560" fill="none" aria-hidden>
        <motion.path className="flow-line" d="M150 235 L150 330" stroke="var(--color-brand)" strokeWidth="1.5" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.6 }} />
        <motion.path className="flow-line" d="M400 250 C 400 290, 380 300, 380 330" stroke="var(--color-brand)" strokeWidth="1.5" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }} />
      </svg>
      {layers.map((l) =>
        Wrap ? (
          <Wrap key={l.cls} className={l.cls}>{l.node}</Wrap>
        ) : (
          <Layer key={l.cls} className={l.cls} delay={l.delay} depth={l.depth} mx={mx} my={my}>{l.node}</Layer>
        ),
      )}
    </div>
  )
}
