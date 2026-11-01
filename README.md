# Kodexa — Landing V2

Landing "Digital Product Studio" (diseño en Claude Design, boards MainV2 / MobileV2).

## Estado
- Lista: sección de contacto `04 — HABLEMOS` (`components/sections/landing-contact.tsx`).
- Pendiente: Hero, Servicios, Ecosistema, Proyectos, Footer.

## Contacto: se reutiliza el manejo del sitio actual (kodexa-landing)
Copiado tal cual: `app/api/forminit`, `app/api/lead`, `app/api/interaction`, `lib/lead-validation.ts`, `lib/lead-proof.ts`,
`lib/rate-limit.ts`, `lib/attribution.ts`, `lib/interaction.ts`, `lib/analytics.ts`, `docs/` (planilla de Google y eventos).
- Mismo formulario de Forminit (`site.forminitFormId`) y misma planilla: las consultas llegan al mismo lugar.
- Campo `source`: esta landing envía `landing`; el sitio envía `contacto`, `home`, `productos`… (así se distingue el origen).
- Eventos: `form_start`, `form_submit`, `generate_lead`, `form_error`, `whatsapp_click`, `project_type_select` (ver `docs/conversion-tracking.md`).

## Correr
```
npm install
cp .env.example .env.local   # completar con los valores del sitio actual
npm run dev                  # http://localhost:3200
```
