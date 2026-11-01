"use client"

import { useEffect } from "react"
import { captureAttribution } from "@/lib/attribution"

/** Guarda el origen de la visita (UTM / referrer) para asociarlo a las interacciones. No renderiza nada. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
