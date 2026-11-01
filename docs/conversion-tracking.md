# Medición de conversiones (GTM → GA4)

El sitio carga el contenedor de Google Tag Manager `GTM-PX8R7ZH8` (solo en producción, ver `lib/content/site.ts → loadTracking`). Ese contenedor incluye la etiqueta de Google con la propiedad de GA4 `G-BX1MFLCDJH`.

El código **no envía nada a GA4 directamente**: publica cada evento en `window.dataLayer` (`lib/analytics.ts`) y GTM decide qué reenviar. Por eso, para que los eventos aparezcan en GA4, hay que crear el disparador y la etiqueta en GTM (paso 1 de abajo). Sin eso, los eventos solo llegan a Vercel Analytics.

## Eventos que emite el sitio

| Evento | Cuándo | Parámetros (ninguno es dato personal) |
|---|---|---|
| `whatsapp_click` | Clic en cualquier botón de WhatsApp. **No** significa que se envió un mensaje. | `cta_location`, `cta_label`, `page_path`, `contact_method` (`whatsapp`), `service_type` (si aplica) |
| `form_start` | Primer foco en un campo del formulario. | `form_source` |
| `form_submit` | El servidor **confirmó** que guardó la consulta (Forminit). | `form_source`, `contact_method`, `project_type`, `lead_type`, `action` |
| `generate_lead` | Mismo momento que `form_submit`: consulta comercial registrada. Es la conversión. | igual que `form_submit` |
| `form_error` | Falla de validación o de guardado. | `form_source`, `error_type` (`validation` / `server`), `error_fields` (solo nombres de campo) |
| `contact_cta_click` | Clic en un CTA que lleva al formulario de contacto (hero en inglés, header, footer, bandas finales, artículo). **No** es un lead. | `cta_location`, `page_location`, `language` |
| `service_cta_click` | Clic en "Consultar por este servicio" (home y páginas de servicio). Lleva a `/contacto?servicio=<slug>#formulario` con el tipo de proyecto preseleccionado. **No** es un lead. | `cta_location` (`home_services`, `service_hero`), `service_name` (slug del servicio), `page_location`, `language` |
| `language_select` | La persona elige el idioma manualmente en el selector (no se emite por la detección automática). | `language_from`, `language_to`, `cta_location` (`navbar` / `mobile_menu`), `page_path` |
| `email_click` | Clic en un enlace de correo. Solo existe si `NEXT_PUBLIC_CONTACT_EMAIL` está configurada. | `cta_location`, `page_path`, `contact_method` (`email`) |

**Todos** los eventos incluyen además `language` (`es` / `en`, idioma de la página) y `page_location` (origen + ruta, **sin** query ni hash). `location` se publica como `cta_location` y `service` como `service_name`. En la versión inglesa, el formulario envía `source` con sufijo `_en` a la planilla y las páginas aparecen como `/en/...`.

`cta_location` posibles: `hero`, `home_services`, `service_hero`, `service_price`, `services`, `projects`, `products`, `contact`, `navbar`, `header`, `footer`, `floating`, `cta_final`, `article`, `article_case_final`.

En el hero en español el CTA principal abre WhatsApp (emite solo `whatsapp_click`); en inglés lleva al formulario (emite solo `contact_cta_click`). Un mismo clic nunca emite ambos. Los CTA de servicio que abren WhatsApp (precio) emiten únicamente `whatsapp_click` con `service_name`.

Un clic en WhatsApp **no** emite `generate_lead`: es una interacción, no un lead. Los eventos `lead_form_submit` y `cta_click` de WhatsApp fueron reemplazados por los de arriba (`cta_click` sigue usándose para botones que no son de WhatsApp).

## 1. Configuración en GTM (acción manual, una sola vez)

1. **Variables** → *Nuevas* → tipo *Variable de capa de datos*, una por parámetro (versión 2): `cta_location`, `cta_label`, `page_path`, `service_type`, `contact_method`, `form_source`, `project_type`, `lead_type`, `action`, `error_type`, `error_fields`, `language`, `language_from`, `language_to`, `page_location`, `service_name`.
2. **Activadores** → *Nuevo* → tipo *Evento personalizado*, nombre del evento (regex activado):
   `^(whatsapp_click|contact_cta_click|service_cta_click|form_start|form_submit|generate_lead|form_error|language_select|email_click)$`
3. **Etiquetas** → *Nueva* → *Evento de Google Analytics: GA4*
   - Etiqueta de configuración: la existente (`G-BX1MFLCDJH`).
   - Nombre del evento: `{{Event}}` (variable integrada; actívala en *Variables → Configurar*).
   - Parámetros del evento: uno por cada variable del paso 1 (nombre del parámetro = nombre de la variable).
   - Activador: el del paso 2.
4. Probar con *Vista previa* y publicar el contenedor.

## 2. Configuración en GA4 (acción manual)

- **Datos personalizados**: *Administrar → Definiciones personalizadas* → crear dimensiones de evento para `cta_location`, `cta_label`, `service_type`, `language` (para verlas en informes).
- **Evento clave**: *Administrar → Eventos* → marcar `generate_lead` como evento clave. **No** marques `whatsapp_click` ni `form_submit` como clave (el primero es solo un clic; marcar los dos últimos duplicaría la conversión).
- **Medición mejorada**: *Administrar → Flujos de datos → (tu flujo) → Medición mejorada → engranaje* → desactivar **Interacciones con formularios**. Si queda activada, GA4 genera por su cuenta `form_start` y `form_submit` cada vez que se toca el botón, aunque la validación falle o el guardado no ocurra, y se mezclan con los eventos propios del sitio.
  - El contenedor GTM publicado incluye esa medición automática de formularios (`ccd_em_form`), por lo que probablemente está activa.
- **`/gracias`**: la página de agradecimiento no mide nada por su cuenta. **No crees una conversión basada en la URL `/gracias`**: una visita directa no es un lead. `generate_lead` es el único evento clave y se emite en el navegador solo después de que el servidor confirmó el guardado.

## 2 bis. Protección de `/gracias` (qué verifica y qué no)

- Al recibir de Forminit una respuesta `success: true`, el proxy (`app/api/forminit/route.ts`) emite una cookie firmada `kx_sent` (HMAC-SHA256, `HttpOnly`, `SameSite=Lax`, 10 minutos). `/gracias` la verifica **en el servidor** (`lib/lead-proof.ts`): sin cookie válida o con cookie falsificada/vencida muestra una pantalla neutra con enlaces para escribir, sin texto de "consulta enviada".
- Un fallo de envío nunca emite la cookie y la pantalla del formulario no redirige.
- Variables: `FORMINIT_API_KEY` (ya existente) y, opcionalmente, `LEAD_PROOF_SECRET`. Sin `LEAD_PROOF_SECRET` se deriva de `FORMINIT_API_KEY`; sin ninguna de las dos no se emite prueba y `/gracias` queda siempre neutra.
- **Limitaciones**: la cookie sirve para recargar la página durante 10 minutos (no es de un solo uso; no hay base de datos que lo registre). Si un bot completa el honeypot, el redirect muestra la pantalla neutra. No se verifica de forma independiente que la fila haya llegado a Sheets/CRM: eso depende de Forminit y del webhook (ver `docs/google-sheets-leads.md`).

## 3. Consentimiento (banner + Consent Mode v2)

- El sitio muestra un aviso de cookies (`components/consent/cookie-banner.tsx`) con **Aceptar** y **Rechazar** de igual peso. La elección se guarda en la cookie propia `kx_consent` (`granted` / `denied`, 6 meses) y se puede cambiar desde "Preferencias de cookies" en el pie.
- **Antes de cargar GTM** se publica `consent default` con todo en `denied` (`lib/consent.ts`, `components/seo/google-tag-manager.tsx`). Si la cookie ya es `granted`, se publica `consent update` de forma síncrona antes de `gtm.js`. Al aceptar/rechazar en el banner se publica `consent update`.
- **Aceptar** concede solo `analytics_storage`. `ad_storage`, `ad_user_data` y `ad_personalization` quedan siempre `denied` (no hay publicidad).
- **Microsoft Clarity** no se carga hasta que la cookie es `granted`; al rechazar después se llama `clarity('consent', false)`.
- **Vercel Analytics** (visitas agregadas) no usa cookies y sigue activo.
- Con `denied`, la etiqueta de Google (GA4) respeta el consentimiento sola: no escribe cookies `_ga` y envía pings sin identificadores. Para que GA4 también modele esos datos, mantené la configuración de consentimiento por defecto del contenedor en "no configurado" (el sitio ya lo fija por código) y revisá en GTM *Vista previa → pestaña Consentimiento* que `analytics_storage` pase de `denied` a `granted` tras aceptar.
- Los eventos propios siguen sin incluir nombre, email, teléfono ni mensaje. Los UTM y el referrer solo viajan al servidor propio (planilla), no a GA4.
- Páginas legales: `/privacidad` (`/en/privacy`) y `/cookies` (`/en/cookies`), texto en `messages/<idioma>/legal.json`. El formulario muestra "Usaremos tus datos únicamente para responder tu consulta" con enlace a la política.

### Pendientes del titular (no los puedo definir yo)
- Revisión legal de ambas políticas, en especial la transferencia internacional de datos (Forminit, Google, Netlify, Vercel, Microsoft).
- Definir un **plazo de conservación** concreto (hoy el texto dice "mientras sea necesario" y "hasta que pidas eliminarlos").
- Evaluar la inscripción de la base de datos de contactos en el registro de la AAIP (Ley 25.326) y agregar domicilio/CUIT del responsable si corresponde.
- Si se suman píxeles de publicidad (Meta, Google Ads), hay que sumarlos al banner y a la política de cookies.

## 4. Cómo comprobar que funciona

- **GA4 DebugView**: en GTM, *Vista previa* con la URL de producción; en GA4, *Administrar → DebugView*. Tocar un botón de WhatsApp → debe aparecer `whatsapp_click` con sus parámetros. Enviar el formulario → `form_start`, `form_submit`, `generate_lead`.
- **Informes en tiempo real** de GA4 → *Recuento de eventos por Nombre del evento*.
- **Consola del navegador** (sitio publicado): escribir `dataLayer.filter(e => e.event)` y verificar los eventos.
- **Planilla**: ver `docs/google-sheets-leads.md` (pestañas `Leads` e `Interacciones`).
- Banner: en una ventana de incógnito debe aparecer; `dataLayer` debe empezar con `consent default` (todo `denied`). Tras aceptar, `dataLayer.filter(e => e[0]==='consent')` muestra el `update` con `analytics_storage: granted`.
- Los eventos solo se emiten desde el sitio publicado: ni en desarrollo local ni en previews de Netlify carga GTM.
