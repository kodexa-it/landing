import { site } from "@/lib/config"
import { fmt, type Locale } from "@/lib/i18n"
import { getDict } from "@/lib/i18n"

/**
 * Único lugar donde se construyen enlaces de WhatsApp.
 * El número vive en lib/config.ts; los mensajes, en los diccionarios (lib/dict).
 */
export type WhatsappKey = Exclude<keyof ReturnType<typeof getDict>["wa"], "source" | "fromForm" | "fromFormFallback">

export function whatsappHref(locale: Locale, key: WhatsappKey = "general", extra?: string): string {
  const wa = getDict(locale).wa
  const text = [wa[key], extra, wa.source].filter(Boolean).join("\n")
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
}

/** Mensaje para cuando la persona prefiere seguir por WhatsApp con sus datos precargados. */
export function whatsappFromForm(locale: Locale, name: string, serviceLabel?: string): string {
  const wa = getDict(locale).wa
  const text = `${fmt(wa.fromForm, { name, service: serviceLabel || wa.fromFormFallback })}\n${wa.source}`
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`
}
