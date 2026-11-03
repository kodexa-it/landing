"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Dict } from "@/lib/dict/es"
import type { Locale } from "@/lib/i18n"

type Ctx = { locale: Locale; d: Dict }
const I18nContext = createContext<Ctx | null>(null)

/** Entrega idioma y textos a los componentes de cliente (el árbol de servidor recibe `d` por props). */
export function I18nProvider({ locale, d, children }: Ctx & { children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, d }}>{children}</I18nContext.Provider>
}

export function useI18n(): Ctx {
  const c = useContext(I18nContext)
  if (!c) throw new Error("useI18n fuera de I18nProvider")
  return c
}
