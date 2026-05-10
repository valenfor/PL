// ─────────────────────────────────────────────────────────────────────────────
// Google Sheets Integration via Apps Script Web App
//
// SETUP INSTRUCTIONS (one-time, takes ~5 min):
//
// 1. Go to: https://sheets.google.com → create a new sheet named "PropertyLinker Leads"
// 2. Add these headers in row 1 (copy exactly):
//    A: timestamp | B: completion_status | C: tipo_propiedad | D: objetivo_compra
//    E: horizonte | F: prioridades | G: proyecto_seleccionado | H: valor_percibido_mercado
//    I: willingness_to_pay | J: forma_financiamiento | K: rango_ingreso
//    L: perfil_generado | M: completion_rate | N: nombre | O: email | P: whatsapp
//    Q: session_id | R: tiempo_total_segundos | S: pantalla_abandono
//
// 3. In the sheet: Extensions → Apps Script → paste the code below → Save → Deploy
//
// APPS SCRIPT CODE (paste in Apps Script editor):
// ─────────────────────────────────────────────────────────────────────────────
// function doPost(e) {
//   try {
//     const data = JSON.parse(e.postData.contents);
//     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     sheet.appendRow([
//       data.timestamp, data.completion_status, data.tipo_propiedad,
//       data.objetivo_compra, data.horizonte, data.prioridades,
//       data.proyecto_seleccionado, data.valor_percibido_mercado,
//       data.willingness_to_pay, data.forma_financiamiento, data.rango_ingreso,
//       data.perfil_generado, data.completion_rate, data.nombre,
//       data.email, data.whatsapp, data.session_id,
//       data.tiempo_total_segundos, data.pantalla_abandono
//     ]);
//     return ContentService
//       .createTextOutput(JSON.stringify({ result: 'success' }))
//       .setMimeType(ContentService.MimeType.JSON);
//   } catch(err) {
//     return ContentService
//       .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────
// 4. Deploy: Click "Deploy" → "New deployment" → Type: "Web app"
//    → Execute as: "Me" → Who has access: "Anyone" → Deploy
// 5. Copy the Web App URL and paste it below as SHEETS_URL
// ─────────────────────────────────────────────────────────────────────────────

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || ''

/**
 * Submits data to Google Sheets via Apps Script Web App
 * Falls back to localStorage if URL not configured
 */
export async function submitToSheets(data) {
  const payload = {
    timestamp: new Date().toISOString(),
    completion_status: data.completion_status || 'partial',
    tipo_propiedad: data.tipo_propiedad || '',
    objetivo_compra: data.objetivo_compra || '',
    horizonte: data.horizonte || '',
    prioridades: Array.isArray(data.prioridades) ? data.prioridades.join(' | ') : '',
    proyecto_seleccionado: data.proyecto_seleccionado || '',
    valor_percibido_mercado: data.valor_percibido_mercado || '',
    willingness_to_pay: data.willingness_to_pay || '',
    forma_financiamiento: data.forma_financiamiento || '',
    rango_ingreso: data.rango_ingreso || '',
    perfil_generado: data.perfil_generado || '',
    completion_rate: data.completion_rate || 0,
    nombre: data.nombre || '',
    email: data.email || '',
    whatsapp: data.whatsapp || '',
    session_id: data.session_id || generateSessionId(),
    tiempo_total_segundos: data.tiempo_total_segundos || 0,
    pantalla_abandono: data.pantalla_abandono || '',
  }

  // Always save locally as backup
  saveLocalBackup(payload)

  if (!SHEETS_URL) {
    console.warn('[PropertyLinker] VITE_SHEETS_URL not set. Data saved locally only.')
    console.table(payload)
    return { success: true, mode: 'local' }
  }

  try {
    // Using no-cors mode because Apps Script doesn't support CORS preflight
    // Data still gets written; we just can't read the response
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return { success: true, mode: 'sheets' }
  } catch (err) {
    console.error('[PropertyLinker] Sheets submission failed:', err)
    return { success: false, mode: 'local', error: err.message }
  }
}

function saveLocalBackup(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem('pl_responses') || '[]')
    existing.push(payload)
    localStorage.setItem('pl_responses', JSON.stringify(existing))
  } catch {
    // localStorage unavailable
  }
}

export function generateSessionId() {
  return `pl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Export all locally stored responses as CSV
 * Call from browser console: window.__exportCSV()
 */
export function exportLocalCSV() {
  try {
    const data = JSON.parse(localStorage.getItem('pl_responses') || '[]')
    if (!data.length) {
      console.warn('No local responses found.')
      return
    }
    const headers = Object.keys(data[0])
    const rows = data.map(row =>
      headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `propertylinker_responses_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    console.log(`Exported ${data.length} responses.`)
  } catch (err) {
    console.error('Export failed:', err)
  }
}

// Expose CSV export globally for easy access from console
if (typeof window !== 'undefined') {
  window.__exportCSV = exportLocalCSV
  window.__viewResponses = () => JSON.parse(localStorage.getItem('pl_responses') || '[]')
}
