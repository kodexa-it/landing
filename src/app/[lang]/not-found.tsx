"use client"

import Link from "next/link"
import { useI18n } from "@/components/i18n/I18nProvider"
import { homePath } from "@/lib/i18n"

export default function NotFound() {
  const { locale, d } = useI18n()
  return (
    <section className="grid min-h-[60vh] place-items-center px-5 py-24 text-center">
      <div>
        <p className="t-label text-muted">404</p>
        <h1 className="t-h2 mt-4">{d.notFound.title}</h1>
        <p className="t-lead mx-auto mt-4 max-w-md">{d.notFound.text}</p>
        <Link href={homePath(locale)} className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 font-medium text-white transition-colors hover:bg-brand hover:text-ink">{d.notFound.cta}</Link>
      </div>
    </section>
  )
}
