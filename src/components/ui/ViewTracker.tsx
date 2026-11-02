"use client"

import { useEffect, useRef } from "react"
import { trackEvent, type AnalyticsEvent, type EventParams } from "@/lib/analytics"

/** Dispara un evento de medición una sola vez cuando el bloque entra en pantalla. No renderiza nada visible. */
export function ViewTracker({ event, params }: { event: AnalyticsEvent; params?: EventParams }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent(event, params)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])
  return <span ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />
}
