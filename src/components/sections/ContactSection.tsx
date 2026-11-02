import { Mail, MessageCircle } from "lucide-react"
import { ContactForm } from "@/components/ui/ContactForm"
import { Cta } from "@/components/ui/Cta"
import { Reveal } from "@/components/ui/Reveal"
import { site } from "@/lib/config"

export function ContactSection() {
  return (
    <section id="contacto" className="py-24 lg:py-32">
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="t-label mb-5 text-muted">Contacto</p>
          <h2 className="t-h2">Empecemos a construir algo juntos.</h2>
          <p className="t-lead mt-5 max-w-md">
            Contanos qué necesitás y encontramos la mejor manera de llevar tu negocio al siguiente nivel digital.
          </p>

          <div className="mt-10 space-y-4">
            <Cta ctx={{ section: "contacto", type: "primary" }} whatsapp="contacto" arrow={false} className="w-full sm:w-auto">
              <MessageCircle className="size-4" aria-hidden /> Hablemos por WhatsApp
            </Cta>
            <p className="text-sm text-muted">{site.whatsappDisplay}</p>
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-[0.95rem] underline-offset-4 hover:underline">
              <Mail className="size-4" aria-hidden /> {site.email}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
