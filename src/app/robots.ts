import type { MetadataRoute } from "next"
import { isPreview, site } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } }
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site.url}/sitemap.xml` }
}
