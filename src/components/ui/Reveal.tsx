"use client"

import { motion } from "framer-motion"
import { useSafeReducedMotion } from "@/components/ui/useMotionOk"
import type { ReactNode } from "react"

/** Entrada discreta al hacer scroll. Respeta prefers-reduced-motion (sin animación, contenido visible de inmediato). */
export function Reveal({ children, delay = 0, y = 18, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useSafeReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
