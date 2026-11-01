"use client"

import type { MouseEvent, ReactNode } from "react"
import { trackEvent } from "@/lib/analytics"
import { trackWhatsappClick } from "@/lib/whatsapp"

/**
 * Medición de clics por delegación: cualquier enlace con `data-event` y `data-origin` se registra.
 * - Enlaces a WhatsApp → trackWhatsappClick (whatsapp_click en dataLayer + /api/interaction), igual que el sitio actual.
 * - Otros eventos (service_interest, nexo_interest, nodo_interest, ecosystem_interest…) → trackEvent.
 */
export function Tracked({ children }: { children: ReactNode }) {
  function onClick(e: MouseEvent<HTMLDivElement>) {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-event]")
    if (!el) return
    const event = el.dataset.event ?? ""
    const origin = el.dataset.origin ?? ""
    const href = (el as HTMLAnchorElement).href ?? ""
    if (href.includes("wa.me")) {
      trackWhatsappClick({ location: origin, label: `landing_${origin}` })
      if (event !== "whatsapp_click") trackEvent(event, { cta_location: origin })
      return
    }
    if (event === "form_submit") return // lo registra el formulario cuando el servidor confirma
    trackEvent(event, { cta_location: origin })
  }
  return <div onClick={onClick}>{children}</div>
}
