import type { MetadataRoute } from "next"
import { site } from "@/lib/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const es = site.url
  const en = `${site.url}/en`
  return [
    { url: es, lastModified: new Date(), changeFrequency: "monthly", priority: 1, alternates: { languages: { es, en } } },
    { url: en, lastModified: new Date(), changeFrequency: "monthly", priority: 1, alternates: { languages: { es, en } } },
  ]
}
