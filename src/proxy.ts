import { NextResponse, type NextRequest } from "next/server"
import { LANG_COOKIE, isBot, isLocale, paths, pickLocale } from "@/lib/i18n"

/**
 * Enrutado de idioma (Next 16: `proxy.ts` reemplaza a `middleware.ts`), con las mismas reglas que el sitio institucional.
 *
 * - Español: URL pública sin prefijo (`/`, `/gracias`). Inglés: bajo `/en` (`/en`, `/en/thank-you`).
 * - Formas no canónicas (`/es`, `/es/gracias`, `/en/gracias`, barra final) → redirect 308 a la canónica.
 * - Solo en `/` (sin prefijo): primera visita sin cookie → idioma del navegador (Accept-Language); con cookie `kx_lang`,
 *   esa elección. Nunca para bots ni si la persona viene de otra página del propio sitio. Sin geolocalización ni IP.
 * - Rewrite interno: `/` → `/es`, `/gracias` → `/es/gracias`, `/en/thank-you` → `/en/gracias`.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const segs = pathname.split("/").filter(Boolean)
  let locale: "es" | "en" = "es"
  if (segs[0] === "en" || segs[0] === "es") locale = segs.shift() as "es" | "en"

  let internal = segs[0] ?? ""
  if (internal === "thank-you") internal = "gracias"
  if (segs.length > 1) internal = segs.join("/") // ruta desconocida: se deja pasar y responde 404
  const canonical = internal === "" ? paths.home[locale] : internal === "gracias" ? paths.thanks[locale] : `${locale === "en" ? "/en" : ""}/${segs.join("/")}`

  if (canonical !== pathname) return NextResponse.redirect(new URL(`${canonical}${search}`, request.url), 308)

  if (pathname === "/" && request.method === "GET") {
    const cookie = request.cookies.get(LANG_COOKIE)?.value
    let toEn = false
    if (isLocale(cookie)) toEn = cookie === "en"
    else if (!isBot(request.headers.get("user-agent")) && !isInternalReferrer(request)) toEn = pickLocale(request.headers.get("accept-language")) === "en"
    if (toEn) {
      const res = NextResponse.redirect(new URL(`${paths.home.en}${search}`, request.url), 307)
      res.headers.set("Vary", "Accept-Language, Cookie")
      res.headers.set("Cache-Control", "private, no-store")
      return res
    }
    const res = NextResponse.rewrite(new URL(`/es${search}`, request.url))
    res.headers.set("Vary", "Accept-Language, Cookie")
    return res
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${internal ? `/${internal}` : ""}`
  return NextResponse.rewrite(url)
}

function isInternalReferrer(request: NextRequest): boolean {
  const ref = request.headers.get("referer")
  if (!ref) return false
  try {
    return new URL(ref).host === request.nextUrl.host
  } catch {
    return false
  }
}

export const config = {
  // Todo menos API, recursos de Next, sitemap/robots y archivos estáticos (con extensión).
  matcher: ["/((?!api|_next|sitemap\\.xml|robots\\.txt|.*\\..*).*)"],
}
