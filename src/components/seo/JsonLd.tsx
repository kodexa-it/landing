import { site } from "@/lib/config"
import type { Dict } from "@/lib/dict/es"
import type { Locale } from "@/lib/i18n"

/** Schema.org: Organization + ProfessionalService de Kodexa. Solo datos reales (sin ratings ni reseñas). */
export function JsonLd({ d, locale }: { d: Dict; locale: Locale }) {
  const url = locale === "en" ? `${site.url}/en` : site.url
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/favicon.svg`,
        email: site.email,
        sameAs: [site.instagram, site.linkedin],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#service`,
        name: "Kodexa",
        url,
        inLanguage: locale,
        description: d.meta.description,
        email: site.email,
        telephone: `+${site.whatsappNumber}`,
        areaServed: { "@type": "Country", name: d.meta.schemaCountry },
        parentOrganization: { "@id": `${site.url}/#organization` },
        knowsAbout: d.meta.schemaKnows,
        makesOffer: d.meta.schemaOffers.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
