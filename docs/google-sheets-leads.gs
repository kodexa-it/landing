// Apps Script: recibe los datos de kodexa.ar y los agrega a la planilla.
//  - Consultas (leads)            → pestaña "Leads"
//  - Interacciones anónimas        → pestaña "Interacciones" (por ejemplo, clics en WhatsApp)
// Una interacción NO es un lead: no tiene datos personales y nunca se mezcla con "Leads".
// Responde "ok" solo si escribió la fila; el sitio no da nada por guardado si la respuesta es otra.
const SECRET = 'CAMBIAR-POR-UNA-CLAVE-LARGA';

// Las primeras 10 columnas son las de siempre (no cambia el orden de las filas existentes);
// las nuevas van al final.
const LEAD_HEADERS = ['Fecha', 'Nombre', 'Email', 'WhatsApp', 'Tipo de proyecto', 'Presupuesto', 'Mensaje', 'Origen', 'Interés producto', 'Página', 'Negocio', 'Medio preferido', 'Acción', 'Estado'];
const INTERACTION_HEADERS = ['timestamp', 'event_type', 'page_path', 'cta_location', 'cta_label', 'service_type', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer'];

// Evita que un texto que empiece con = + - @ se interprete como fórmula.
function safe(v) {
  const s = String(v || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function sheetWithHeaders(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return ContentService.createTextOutput('bad-request');
  }
  if (data.secret !== SECRET) return ContentService.createTextOutput('forbidden');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (data.kind === 'interaction') {
      sheetWithHeaders('Interacciones', INTERACTION_HEADERS).appendRow([
        new Date(), safe(data.event_type), safe(data.page_path), safe(data.cta_location), safe(data.cta_label),
        safe(data.service_type), safe(data.utm_source), safe(data.utm_medium), safe(data.utm_campaign), safe(data.referrer),
      ]);
    } else {
      sheetWithHeaders('Leads', LEAD_HEADERS).appendRow([
        new Date(), safe(data.name), safe(data.email), safe(data.whatsapp), safe(data.projectType),
        safe(data.budget), safe(data.message), safe(data.source), safe(data.productInterest), safe(data.page),
        safe(data.business), safe(data.contactMethod), safe(data.action), safe(data.status),
      ]);
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
