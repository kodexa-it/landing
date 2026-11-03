"use client"

import { motion } from "framer-motion"
import { useSafeReducedMotion } from "@/components/ui/useMotionOk"


/** Titular del hero: cada palabra sube desde una máscara, y "crecer." se subraya con un trazo que se dibuja. */
export function HeroHeadline({ words: list, label }: { words: string[]; label: string }) {
  const words = list.map((t, i) => ({ t, accent: i === list.length - 1 }))
  const reduce = useSafeReducedMotion()
  return (
    <h1 className="t-display" aria-label={label}>
      {words.map((w, i) => (
        <span key={w.t} aria-hidden className="relative inline-block overflow-hidden pb-[0.14em] align-top" style={{ marginBottom: "-0.14em" }}>
          <motion.span
            className={w.accent ? "relative inline-block text-brand" : "inline-block"}
            initial={reduce ? false : { y: "110%", rotate: 3 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {w.t}
          </motion.span>
          {w.accent && (
            <svg className="pointer-events-none absolute -bottom-[0.02em] left-0 h-[0.18em] w-full" viewBox="0 0 200 12" preserveAspectRatio="none" fill="none" aria-hidden>
              <motion.path
                d="M2 8 C 40 2, 90 12, 198 4" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
              />
            </svg>
          )}
        </span>
      )).flatMap((el, i, arr) => (i < arr.length - 1 ? [el, " "] : [el]))}
    </h1>
  )
}
