import { Mail } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { Cta } from "@/components/ui/Cta"
import { site } from "@/lib/config"

const col = "flex flex-col gap-3 text-[0.92rem] text-white/65"
const link = "transition-colors hover:text-white"

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-5 max-w-xs text-[0.92rem] text-white/65">
              Estudio tecnológico argentino. Diseñamos webs, conectamos canales y desarrollamos software para que tu negocio crezca con una estructura digital sólida.
            </p>
            <div className="mt-6">
              <Cta ctx={{ section: "footer", type: "footer" }} whatsapp="general" variant="outline-light" className="!min-h-11 !py-2 text-sm" arrow={false}>
                Hablemos por WhatsApp
              </Cta>
            </div>
          </div>

          <nav aria-label="Navegación del pie" className={col}>
            <h2 className="t-label mb-1 text-white/40">Navegación</h2>
            <a className={link} href="#ecosistema">Ecosistema</a>
            <a className={link} href="#proyectos">Proyectos</a>
            <a className={link} href="#desarrollo-a-medida">Desarrollo a medida</a>
            <a className={link} href="#contacto">Contacto</a>
          </nav>

          <nav aria-label="Soluciones web" className={col}>
            <h2 className="t-label mb-1 text-white/40">Soluciones web</h2>
            <a className={link} href="#soluciones-web">Landing Page</a>
            <a className={link} href="#soluciones-web">Sitio Institucional</a>
            <a className={link} href="#soluciones-web">Institucional Pro</a>
            <a className={link} href="#desarrollo-a-medida">Desarrollo a medida</a>
          </nav>

          <nav aria-label="Ecosistema" className={col}>
            <h2 className="t-label mb-1 text-white/40">Ecosistema</h2>
            <a className={link} href="#ecosistema">Web</a>
            <a className={link} href="#ecosistema">Nexo</a>
            <a className={link} href="#ecosistema">Nodo</a>
            <a className={link} href="#como-funciona">Cómo funciona</a>
          </nav>

          <div className={col}>
            <h2 className="t-label mb-1 text-white/40">Contacto</h2>
            <a className={`${link} inline-flex items-center gap-2`} href={`mailto:${site.email}`}>
              <Mail className="size-4" aria-hidden /> {site.email}
            </a>
            <Cta ctx={{ section: "footer", type: "footer" }} whatsapp="general" variant="ghost-light" arrow={false} className="!text-white/65 hover:!text-white">
              WhatsApp {site.whatsappDisplay}
            </Cta>
            <a className={link} href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className={link} href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <Cta ctx={{ section: "footer", product: "kodexa", type: "footer" }} href={site.institutionalUrl} event="institutional_site_click" variant="ghost-light" arrow={false}>
              Conocé Kodexa ↗
            </Cta>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Kodexa. Todos los derechos reservados.</p>
          <p>Argentina</p>
        </div>
      </div>
    </footer>
  )
}
