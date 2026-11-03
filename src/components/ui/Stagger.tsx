"use client"

import { motion } from "framer-motion"
import { useSafeReducedMotion } from "@/components/ui/useMotionOk"
import type { ReactNode } from "react"

/** Entrada escalonada de listas: el contenedor dispara, cada <StaggerItem> aparece en cadena. */
export function Stagger({ children, className, as = "div", gap = 0.07 }: { children: ReactNode; className?: string; as?: "div" | "ul"; gap?: number }) {
  const reduce = useSafeReducedMotion()
  const Tag = as === "ul" ? motion.ul : motion.div
  if (reduce) return as === "ul" ? <ul className={className}>{children}</ul> : <div className={className}>{children}</div>
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} transition={{ staggerChildren: gap }}>
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const reduce = useSafeReducedMotion()
  const Tag = as === "li" ? motion.li : motion.div
  if (reduce) return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>
  return (
    <Tag className={className} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}>
      {children}
    </Tag>
  )
}
