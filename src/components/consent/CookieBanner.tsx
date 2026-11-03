"use client"

import clsx from "clsx"
import { useCallback, useEffect, useRef, useState } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"
import { consentDenied, consentGranted, parseConsent, serializeConsent, type ConsentChoice } from "@/lib/consent"
import { institutional } from "@/lib/i18n"

declare global {
  interface Window {
    kxLoadClarity?: () => void
    clarity?: (...args: unknown[]) => void
  }
}

export const OPEN_CONSENT_EVENT = "kx:open-consent"

/** Igual que el gtag() oficial: empuja el objeto `arguments`, no un array (requisito de Consent Mode). */
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  ;(window.dataLayer as unknown[]).push(arguments)
}

function applyConsent(choice: ConsentChoice) {
  try { document.cookie = serializeConsent(choice, window.location.protocol === "https:") } catch {}
  try {
    window.dataLayer = window.dataLayer || []
    gtag("consent", "update", choice === "granted" ? consentGranted : consentDenied)
  } catch {}
  try {
    if (choice === "granted") window.kxLoadClarity?.()
    else window.clarity?.("consent", false)
  } catch {}
}

/**
 * Aviso de cookies. Aparece si no hay elección guardada y se puede reabrir desde el pie.
 * "Rechazar" y "Aceptar" tienen el mismo peso visual. No bloquea la navegación. Política y cookies: las del sitio institucional.
 */
export function CookieBanner() {
  const { locale, d } = useI18n()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<ConsentChoice | null>(null)
  const firstBtn = useRef<HTMLButtonElement>(null)
  const reopened = useRef(false)

  useEffect(() => {
    const stored = parseConsent(document.cookie)
    setCurrent(stored)
    if (!stored) setOpen(true)
    const onOpen = () => {
      reopened.current = true
      setCurrent(parseConsent(document.cookie))
      setOpen(true)
    }
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (open && reopened.current) firstBtn.current?.focus()
  }, [open])

  const choose = useCallback((choice: ConsentChoice) => {
    applyConsent(choice)
    setCurrent(choice)
    setOpen(false)
    reopened.current = false
  }, [])

  if (!open) return null
  const c = d.consent
  const btn = "inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-ink px-4 py-2.5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
  return (
    <div
      role="region"
      aria-label={c.aria}
      data-cookie-banner
      className={clsx("fixed inset-x-3 bottom-3 z-[65] rounded-3xl border border-line bg-white p-4 shadow-lift sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:p-5")}
    >
      <p className="text-[1rem] font-medium text-ink">{c.title}</p>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
        {c.text}{" "}
        <a href={institutional(locale).cookies} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-ink underline underline-offset-4">
          {c.more}
        </a>
      </p>
      {current && <p className="mt-2 text-sm text-muted">{current === "granted" ? c.currentGranted : c.currentDenied}</p>}
      <div className="mt-4 flex gap-2">
        <button ref={firstBtn} type="button" className={btn} onClick={() => choose("denied")}>{c.reject}</button>
        <button type="button" className={btn} onClick={() => choose("granted")}>{c.accept}</button>
      </div>
    </div>
  )
}

/** Botón del pie para volver a abrir el aviso. */
export function CookiePrefsButton({ className }: { className?: string }) {
  const { d } = useI18n()
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      {d.consent.prefs}
    </button>
  )
}
