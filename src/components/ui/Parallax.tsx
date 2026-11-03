"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useSafeReducedMotion } from "@/components/ui/useMotionOk"
import { useRef, type ReactNode } from "react"

/** Desplazamiento suave según el scroll: `from` y `to` en px (positivo = más abajo). */
export function Parallax({ children, from = -16, to = 16, className }: { children: ReactNode; from?: number; to?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [from, to])
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  )
}
