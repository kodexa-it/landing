"use client"

import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/i18n/I18nProvider"
import { LANG_COOKIE, homePath, localeMeta, locales, thanksPath, type Locale } from "@/lib/i18n"

/** ES | EN. Guarda la elección en la cookie `kx_lang` (la misma que usa el sitio institucional) y lleva a la página equivalente. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, d } = useI18n()
  const pathname = usePathname() ?? "/"
  const onThanks = /(gracias|thank-you)\/?$/.test(pathname)
  const target = (l: Locale) => (onThanks ? thanksPath(l) : homePath(l))

  return (
    <div role="group" aria-label={d.a11y.language} className={clsx("flex items-center gap-1 text-[0.8rem] font-medium", className)}>
      {locales.map((l) => {
        const active = l === locale
        return (
          <a
            key={l}
            href={target(l)}
            lang={l}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            aria-label={localeMeta[l].label}
            onClick={() => {
              try { document.cookie = `${LANG_COOKIE}=${l}; Path=/; Max-Age=31536000; SameSite=Lax` } catch {}
            }}
            className={clsx("inline-flex size-9 items-center justify-center rounded-full tracking-wide transition-colors", active ? "bg-ink text-white" : "text-muted hover:text-ink")}
          >
            {localeMeta[l].short}
          </a>
        )
      })}
    </div>
  )
}
