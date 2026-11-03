"use client"

import clsx from "clsx"
import { MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"
import { trackEvent } from "@/lib/analytics"
import { whatsappHref } from "@/lib/whatsapp"

/** Botón flotante de WhatsApp: aparece al empezar a bajar y se corre del camino en pantallas con muescas (safe-area). */
export function WhatsappFloat() {
  const { locale, d } = useI18n()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <a
      href={whatsappHref(locale, "general")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={d.a11y.whatsappFloat}
      tabIndex={visible ? 0 : -1}
      onClick={() => trackEvent("click_whatsapp", { section: "flotante", cta_type: "float" })}
      className={clsx(
        "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-ink px-5 text-white shadow-lift ring-1 ring-white/10 transition-all duration-300 hover:bg-brand hover:text-ink",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <MessageCircle className="size-6" aria-hidden />
      <span className="hidden text-[0.95rem] font-medium sm:inline">{d.common.float}</span>
    </a>
  )
}
