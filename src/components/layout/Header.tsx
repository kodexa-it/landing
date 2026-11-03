"use client"

import clsx from "clsx"
import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { Logo } from "@/components/ui/Logo"
import { Cta } from "@/components/ui/Cta"
import { homePath } from "@/lib/i18n"

export function Header() {
  const { locale, d } = useI18n()
  const home = homePath(locale)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Menú móvil: Escape lo cierra y devuelve el foco al botón; se bloquea el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <header className={clsx("sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-colors", scrolled ? "border-line" : "border-transparent")}>
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href={`${home}#inicio`} aria-label={d.a11y.home} className="text-ink">
          <Logo />
        </a>

        <nav aria-label={d.a11y.mainNav} className="hidden items-center gap-8 xl:flex">
          {d.nav.map((item) => (
            <a key={item.id} href={`${home}#${item.id}`} className="whitespace-nowrap text-[0.92rem] text-muted transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <Cta ctx={{ section: "header", type: "nav" }} whatsapp="hero" className="!min-h-11 !px-5 !py-2 text-sm" arrow={false}>
              {d.common.talk}
            </Cta>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line xl:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? d.a11y.closeMenu : d.a11y.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-movil" className="fixed inset-x-0 top-[68px] bottom-0 overflow-y-auto border-t border-line bg-white px-5 pb-10 pt-6 xl:hidden">
          <nav aria-label={d.a11y.mobileNav} className="flex flex-col">
            {d.nav.map((item) => (
              <a key={item.id} href={`${home}#${item.id}`} onClick={() => setOpen(false)} className="border-b border-line py-4 text-xl font-medium tracking-tight">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-8">
            <Cta ctx={{ section: "header-mobile", type: "nav" }} whatsapp="hero" className="w-full" arrow={false}>
              {d.common.talk}
            </Cta>
          </div>
        </div>
      )}
    </header>
  )
}
