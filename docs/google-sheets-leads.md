# Leads e interacciones del sitio en Google Sheets

La planilla recibe dos cosas distintas, en dos pestañas:

| Pestaña | Qué guarda | Quién la escribe |
|---|---|---|
| `Leads` | Consultas enviadas desde los formularios (con datos de contacto). Forminit sigue recibiendo todo igual (respaldo y avisos por mail). | `/api/lead` |
| `Interacciones` | Clics en WhatsApp, anónimos. **No son leads.** Sin nombre, email ni teléfono. | `/api/interaction` |

## 1. Planilla y script
1. Crear una planilla de Google (ej. "Leads Kodexa").
2. Menú **Extensiones → Apps Script**, borrar lo que haya y pegar `google-sheets-leads.gs`.
3. Cambiar `SECRET` por una clave larga propia.
4. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Autorizar y copiar la URL que termina en `/exec`.

### Si ya tenías el script anterior
Actualizá el código del script y publicá una **nueva versión** (Implementar → Administrar implementaciones → editar → Versión nueva). La URL `/exec` no cambia.

En la pestaña `Leads` ya existente, agregá estos encabezados a la derecha de los actuales (columnas K a N): `Negocio`, `Medio preferido`, `Acción`, `Estado`. Las filas anteriores quedan intactas.
La pestaña `Interacciones` la crea el script sola con la primera interacción.

## 2. Netlify
En **Site configuration → Environment variables** (contexto Production):

| Variable | Valor | Para qué |
|---|---|---|
| `SHEETS_WEBHOOK_URL` | la URL `/exec` | ya existente, leads |
| `SHEETS_WEBHOOK_SECRET` | la misma clave del script | ya existente, leads |
| `SHEETS_INTERACTIONS_ENABLED` | `true` | **nueva**: activa el registro de clics en `Interacciones` |

Activá `SHEETS_INTERACTIONS_ENABLED` **recién después** de publicar el script nuevo: el script anterior no distingue interacciones y las anotaría como filas en `Leads`.

Volver a desplegar (Deploys → Trigger deploy).

## 3. Cómo comprobar que funciona
- **Lead:** enviar el formulario de `/contacto` con "Que me contacten". Debe aparecer una fila en `Leads` con `Estado = nuevo` y `Acción = contact_me`.
- **Clic en WhatsApp:** tocar cualquier botón de WhatsApp. Debe aparecer una fila en `Interacciones` con `event_type = whatsapp_click`, el `cta_location` del botón y la ruta de la página.
- Si falta una fila, mirá los logs de la función en Netlify (**Logs → Functions**): `/api/lead` y `/api/interaction` registran cuando el script no confirmó la escritura (sin datos personales).

## Notas
- Una respuesta distinta de `ok` del script se trata como error: el sitio no da por guardado un registro que el script no confirmó.
- `/api/interaction` limita la cantidad de pedidos por IP y solo acepta valores con formato válido; descarta lo demás.
- UTM y referrer son opcionales. Del referrer solo se guarda origen y ruta (nunca query ni hash).
