import { Mail } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { Cta } from "@/components/ui/Cta"
import { CookiePrefsButton } from "@/components/consent/CookieBanner"
import { site } from "@/lib/config"
import type { Dict } from "@/lib/dict/es"
import { homePath, institutional, type Locale } from "@/lib/i18n"

const col = "flex flex-col gap-3 text-[0.92rem] text-white/65"
const link = "transition-colors hover:text-white"

export function Footer({ locale, d }: { locale: Locale; d: Dict }) {
  const f = d.footer
  const home = homePath(locale)
  const inst = institutional(locale)
  const a = (id: string) => `${home}#${id}`
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-5 max-w-xs text-[0.92rem] text-white/65">{f.text}</p>
            <div className="mt-6">
              <Cta ctx={{ section: "footer", type: "footer" }} whatsapp="general" variant="outline-light" className="!min-h-11 !py-2 text-sm" arrow={false}>
                {d.common.whatsappUs}
              </Cta>
            </div>
          </div>

          <nav aria-label={d.a11y.footerNav} className={col}>
            <h2 className="t-label mb-1 text-white/40">{f.nav}</h2>
            <a className={link} href={a("ecosistema")}>{f.navLinks.ecosistema}</a>
            <a className={link} href={a("proyectos")}>{f.navLinks.proyectos}</a>
            <a className={link} href={a("desarrollo-a-medida")}>{f.navLinks.custom}</a>
            <a className={link} href={a("contacto")}>{f.navLinks.contacto}</a>
          </nav>

          <nav aria-label={f.web} className={col}>
            <h2 className="t-label mb-1 text-white/40">{f.web}</h2>
            <a className={link} href={a("soluciones-web")}>{f.webLinks[0]}</a>
            <a className={link} href={a("soluciones-web")}>{f.webLinks[1]}</a>
            <a className={link} href={a("soluciones-web")}>{f.webLinks[2]}</a>
            <a className={link} href={a("desarrollo-a-medida")}>{f.webLinks[3]}</a>
          </nav>

          <nav aria-label={f.eco} className={col}>
            <h2 className="t-label mb-1 text-white/40">{f.eco}</h2>
            <a className={link} href={a("ecosistema")}>{f.ecoLinks.web}</a>
            <a className={link} href={a("ecosistema")}>{f.ecoLinks.nexo}</a>
            <a className={link} href={a("nodo")}>{f.ecoLinks.nodo}</a>
            <a className={link} href={a("como-funciona")}>{f.ecoLinks.how}</a>
          </nav>

          <div className={col}>
            <h2 className="t-label mb-1 text-white/40">{f.contact}</h2>
            <a className={`${link} inline-flex items-center gap-2`} href={`mailto:${site.email}`}>
              <Mail className="size-4" aria-hidden /> {site.email}
            </a>
            <Cta ctx={{ section: "footer", type: "footer" }} whatsapp="general" variant="ghost-light" arrow={false} className="!text-white/65 hover:!text-white">
              {f.whatsapp} {site.whatsappDisplay}
            </Cta>
            <a className={link} href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className={link} href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <Cta ctx={{ section: "footer", product: "kodexa", type: "footer" }} href={inst.home} event="institutional_site_click" variant="ghost-light" arrow={false}>
              {f.institutional}
            </Cta>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kodexa. {f.rights}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label={f.legal}>
            <li><a className={link} href={inst.privacy} target="_blank" rel="noopener noreferrer">{f.privacy}</a></li>
            <li><a className={link} href={inst.cookies} target="_blank" rel="noopener noreferrer">{f.cookies}</a></li>
            <li><CookiePrefsButton className={`${link} underline-offset-4 hover:underline`} /></li>
            <li>{f.country}</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
