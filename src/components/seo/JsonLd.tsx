import { site } from "@/lib/config"

/** Schema.org: Organization + ProfessionalService de Kodexa. Solo datos reales (sin ratings ni reseñas). */
export function JsonLd() {
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
        "@id": `${site.url}/#service`,
        name: "Kodexa",
        url: site.url,
        description: site.description,
        email: site.email,
        telephone: `+${site.whatsappNumber}`,
        areaServed: { "@type": "Country", name: "Argentina" },
        parentOrganization: { "@id": `${site.url}/#organization` },
        knowsAbout: ["Desarrollo web", "Diseño de páginas web", "Landing pages", "Sitios institucionales", "Software a medida", "Automatización de procesos", "CRM", "Inteligencia artificial para empresas"],
        makesOffer: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing Page" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sitio Institucional" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Institucional Pro" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Desarrollo de software a medida" } },
        ],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
