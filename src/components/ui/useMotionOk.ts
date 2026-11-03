"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

/** useReducedMotion seguro para hidratación: en servidor y primer render devuelve false; luego el valor real. */
export function useSafeReducedMotion() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? !!reduce : false
}
