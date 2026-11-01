import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Kodexa — Estudio de producto digital",
  description: "Diseñamos experiencias web, desarrollamos software y conectamos herramientas para que tu negocio trabaje mejor y crezca.",
  robots: { index: false, follow: false }, // quitar cuando la landing reemplace al sitio actual
}

export default function Page() {
  return <LandingPage />
}
