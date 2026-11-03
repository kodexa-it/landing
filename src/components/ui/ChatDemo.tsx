"use client"

import clsx from "clsx"
import { motion, useInView } from "framer-motion"
import { useSafeReducedMotion } from "@/components/ui/useMotionOk"
import { useEffect, useRef, useState } from "react"

export type ChatMsg = { from: "user" | "bot"; text: string }

/**
 * Conversación de ejemplo que se "escribe" sola al entrar en pantalla: puntos de tipeo antes de cada respuesta del asistente.
 * Reserva el espacio desde el inicio (sin saltos de layout). Con reduced-motion muestra todo de una vez.
 */
export function ChatDemo({ messages, footer, variant, className }: { messages: ChatMsg[]; footer?: string; variant: "light" | "dark"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useSafeReducedMotion()
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (reduce) { setShown(messages.length + 1); return }
    if (!inView) return
    const timers: ReturnType<typeof setTimeout>[] = []
    let t = 350
    messages.forEach((m, i) => {
      if (m.from === "bot") {
        timers.push(setTimeout(() => setTyping(true), t))
        t += 950
      }
      timers.push(setTimeout(() => { setTyping(false); setShown(i + 1) }, t))
      t += 750
    })
    timers.push(setTimeout(() => setShown(messages.length + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [inView, reduce, messages])

  const user = variant === "dark" ? "bg-white/10" : "bg-mist"
  const bot = variant === "dark" ? "bg-brand text-ink" : "bg-ink text-white"
  const dot = variant === "dark" ? "bg-ink" : "bg-white"

  return (
    <div ref={ref} className={clsx("space-y-2 text-[0.82rem] leading-snug", className)}>
      {messages.map((m, i) => {
        const visible = i < shown
        const isTypingHere = typing && i === shown
        return (
          <div key={i} className={clsx("relative flex", m.from === "bot" ? "justify-end" : "justify-start")}>
            <motion.p
              initial={false}
              animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8, scale: visible ? 1 : 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={clsx("w-fit max-w-[88%] px-3.5 py-2.5", m.from === "bot" ? clsx("rounded-2xl rounded-br-sm", bot) : clsx("rounded-2xl rounded-bl-sm", user))}
            >
              {m.text}
            </motion.p>
            {isTypingHere && (
              <span aria-hidden className={clsx("absolute right-0 top-0 flex items-center gap-1 rounded-2xl rounded-br-sm px-3.5 py-3.5", bot)}>
                {[0, 1, 2].map((d) => <span key={d} className={clsx("typing-dot size-1.5 rounded-full", dot)} style={{ animationDelay: `${d * 0.15}s` }} />)}
              </span>
            )}
          </div>
        )
      })}
      {footer && (
        <motion.p
          initial={false}
          animate={{ opacity: shown > messages.length ? 1 : 0, y: shown > messages.length ? 0 : 6 }}
          transition={{ duration: 0.4 }}
          className={clsx("mx-auto w-fit rounded-full border px-3 py-1 text-[0.7rem]", variant === "dark" ? "border-white/15 text-white/60" : "border-line text-muted")}
        >
          {footer}
        </motion.p>
      )}
    </div>
  )
}
