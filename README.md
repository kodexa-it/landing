# Kodexa — Landing V2

Landing comercial de una sola página: **Tu negocio, conectado para crecer.**
Presenta el ecosistema **Web + Nexo + Nodo**, el proyecto Waste Treatment, las soluciones web, el desarrollo a medida y el contacto.

Aplicación independiente del sitio institucional (`../kodexa-landing`, que no se modifica ni se importa).

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide · `next/image` · IBM Plex Sans (alojada, licencia OFL).

## Requisitos
Node.js 20 o superior.

## Instalar y ejecutar
```bash
npm install
cp .env.example .env.local     # completar (ver "Variables de entorno")
npm run dev                    # desarrollo → http://localhost:3200
npm run typecheck              # TypeScript sin emitir
npm run build                  # build de producción
npm run start                  # producción → http://localhost:3200
```

## Variables de entorno
| Variable | Obligatoria | Para qué |
|---|---|---|
| `FORMINIT_API_KEY` | **Sí, para que el formulario envíe** | API key de Forminit (la misma de `kodexa-landing/.env.local`). Sin ella `/api/contact` responde 503 y el formulario avisa que no está disponible: **nunca simula un envío**. |
| `FORMINIT_FORM_ID` | No | Por defecto usa el formulario ya en producción (`920afmph8yf`), así las consultas llegan al mismo lugar que las de kodexa.ar. Se distinguen por el campo `source = landing-v2`. |
| `NEXT_PUBLIC_SITE_URL` | Al publicar | URL pública de esta landing (canonical, sitemap, Open Graph). Por defecto `https://kodexa.ar`. |
| `NEXT_PUBLIC_INSTITUTIONAL_URL` | No | Destino de "Conocé más sobre Kodexa". Por defecto `https://kodexa.ar`. |
| `NEXT_PUBLIC_SITE_PREVIEW` | Al publicar | `true` (por defecto) = `noindex` y `robots` bloqueado. Poner `false` cuando se publique la V2. |
| `NEXT_PUBLIC_GTM_ID` | No | Contenedor de GTM. El sitio original usa `GTM-PX8R7ZH8` (incluye GA4 `G-BX1MFLCDJH`). Si no se define, no se carga nada. |
| `NEXT_PUBLIC_CLARITY_ID` | No | Microsoft Clarity. El sitio original usa `yzr1ci43mv`. |

## Dónde cambiar cada cosa
- **WhatsApp, email, redes, URLs, opciones del formulario:** `src/lib/config.ts` (único lugar con el número).
- **Mensajes de WhatsApp por sección:** `src/lib/whatsapp.ts`.
- **Eventos de medición:** `src/lib/analytics.ts`.
- **Validación (cliente y servidor):** `src/lib/validation.ts`.
- **Envío del formulario:** `src/app/api/contact/route.ts`.

## Medición
Los eventos salen por `window.dataLayer` (GTM → GA4) y solo existen si se configura `NEXT_PUBLIC_GTM_ID`:
`click_whatsapp`, `click_contact`, `form_start`, `form_submit`, `ecosystem_view`, `service_interest`, `project_view`, `institutional_site_click`,
con parámetros `section`, `service`, `product` y `cta_type`. Nunca se envían datos personales.

## Formulario
- Validación en el navegador (mensajes por campo, accesibles) y de nuevo en el servidor.
- Anti-spam: campo trampa invisible, tiempo mínimo de completado y límite de 5 envíos por IP cada 10 minutos (en memoria; en serverless cada instancia cuenta por separado).
- Estados de carga, éxito y error. Tras enviar, ofrece seguir por WhatsApp con los datos precargados.

## Integraciones y decisiones pendientes
- **Forminit:** falta cargar `FORMINIT_API_KEY` en `.env.local` y en el hosting.
- **Analítica y consentimiento:** el sitio original muestra un banner de consentimiento antes de activar GTM/Clarity. Esta V2 no lo incluye: si se activan los IDs, conviene portar ese banner o resolver el consentimiento dentro de GTM. No instalar el mismo contenedor dos veces en un mismo dominio.
- **Waste Treatment:** el sitio del cliente todavía no tiene dominio publicado. "Ver proyecto" lleva al caso de estudio en kodexa.ar; cuando exista la URL real, cambiar `wasteTreatmentCaseUrl` en `src/lib/config.ts`.
- **Capturas de Nodo:** vienen de `assets/video-nodo` y muestran **datos de demostración** (rotulado en la interfaz). El estado público de Nodo está "pendiente de confirmar" en el sitio original, por eso no se declara un estado.
- **Mockups conceptuales:** la conversación de Nexo y los wireframes de las soluciones web son ilustrativos y están rotulados como ejemplo.
- **Open Graph:** `public/og-image.png` es una imagen propia de la V2 (1200×630).

## Estructura
```
src/
├── app/            layout, page, robots, sitemap, api/contact, estilos, fuentes
├── components/
│   ├── layout/     Header, Footer
│   ├── sections/   Hero, Ecosystem, EcosystemFlow, FeaturedProject, WebSolutions,
│   │               CustomDevelopment, ContactSection, AboutKodexa
│   ├── seo/        JsonLd, Tracking
│   └── ui/         Cta, ContactForm, Browser, Logo, Reveal, ViewTracker, Check
├── lib/            config, whatsapp, analytics, validation, rate-limit
└── types/
```

## Google Tag Manager y animaciones

- GTM: contenedor `GTM-KQFJZWBN` (variable `NEXT_PUBLIC_GTM_ID`). Se instala con el snippet estándar (head + noscript) y **solo carga en producción**; en desarrollo, `NEXT_PUBLIC_TRACKING_DEV=true`.
- Los eventos (`click_whatsapp`, `form_submit`, etc.) se envían a `window.dataLayer`; hay que crear triggers y tags en el contenedor.
- Animaciones: titular con revelado por palabra, hero con parallax al puntero, chats de Nexo que se "escriben", partículas en el flujo, barra de progreso de scroll y listas escalonadas. Todo respeta `prefers-reduced-motion`.
