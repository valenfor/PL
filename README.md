# PropertyLinker MVP

Demo web de validación temprana. Captura preferencias, willingness to pay y comportamiento de usuarios en el mercado inmobiliario de nuevos desarrollos.

---

## Correr localmente

```bash
# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

La app corre en `http://localhost:5173`

---

## Conectar Google Sheets (15 min, una sola vez)

### 1. Crear la planilla

1. Ir a [sheets.google.com](https://sheets.google.com) → Nueva planilla
2. Renombrarla: **"PropertyLinker Leads"**
3. En la **Fila 1**, agregar estos headers exactamente (uno por columna):

```
timestamp | completion_status | tipo_propiedad | objetivo_compra | horizonte | prioridades | proyecto_seleccionado | valor_percibido_mercado | willingness_to_pay | forma_financiamiento | rango_ingreso | perfil_generado | completion_rate | nombre | email | whatsapp | session_id | tiempo_total_segundos | pantalla_abandono
```

### 2. Crear el Apps Script

1. En la planilla: **Extensiones → Apps Script**
2. Borrar el código existente y pegar esto:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.timestamp,
      data.completion_status,
      data.tipo_propiedad,
      data.objetivo_compra,
      data.horizonte,
      data.prioridades,
      data.proyecto_seleccionado,
      data.valor_percibido_mercado,
      data.willingness_to_pay,
      data.forma_financiamiento,
      data.rango_ingreso,
      data.perfil_generado,
      data.completion_rate,
      data.nombre,
      data.email,
      data.whatsapp,
      data.session_id,
      data.tiempo_total_segundos,
      data.pantalla_abandono
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Guardar** (Ctrl+S)

### 3. Deployar el Web App

1. Click en **"Implementar"** → **"Nueva implementación"**
2. Tipo: **Aplicación web**
3. Ejecutar como: **Yo**
4. Quién tiene acceso: **Cualquier usuario**
5. Click en **"Implementar"**
6. Copiar la URL del Web App (algo como `https://script.google.com/macros/s/ABC.../exec`)

### 4. Configurar la variable de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```
VITE_SHEETS_URL=https://script.google.com/macros/s/TU_URL_AQUI/exec
```

Reiniciar el servidor de desarrollo (`npm run dev`).

---

## Deploy en Vercel (gratis)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variable de entorno en el dashboard de Vercel:
# Settings → Environment Variables → VITE_SHEETS_URL
```

O conectar el repo de GitHub directamente desde [vercel.com](https://vercel.com).

---

## Datos y análisis

### Ver respuestas locales (sin Sheets configurado)

Abrir consola del navegador:
```javascript
window.__viewResponses()   // Ver todas las respuestas
window.__exportCSV()       // Descargar CSV
```

### Columnas clave para análisis

| Columna | Para qué sirve |
|---|---|
| `willingness_to_pay` | Core del experimento: disposición real a pagar |
| `valor_percibido_mercado` | Percepción de valor vs. WTP |
| `proyecto_seleccionado` | Preferencia de arquetipo |
| `prioridades` | Atributos más valorados |
| `perfil_generado` | Segmento detectado |
| `completion_rate` | Hasta dónde llegó el usuario |
| `pantalla_abandono` | Dónde se perdió |
| `tiempo_total_segundos` | Engagement total |
| `session_id` | Para rastrear sesiones únicas |

---

## Estructura del proyecto

```
src/
  components/
    screens/
      Screen1.jsx   — Hero / Landing
      Screen2.jsx   — Perfil del comprador
      Screen3.jsx   — Selección de proyecto
      Screen4.jsx   — Revelación de precio (crítica)
      Screen5.jsx   — Resultado / Wow moment
      Screen6.jsx   — Captura de lead
    ProgressBar.jsx
  hooks/
    useFlow.js      — Estado global y lógica de sesión
  lib/
    sheets.js       — Integración Google Sheets
    profiles.js     — Motor de perfiles + datos de proyectos
  App.jsx
  main.jsx
  index.css
```

---

## Iterar rápido

- **Cambiar proyectos**: editar `src/lib/profiles.js` → array `PROJECTS`
- **Cambiar rangos de precio**: editar `PRICE_RANGES` en el mismo archivo
- **Cambiar perfiles**: editar `PROFILES` en `src/lib/profiles.js`
- **Cambiar copy**: cada pantalla es un archivo independiente
- **Agregar preguntas**: agregar campos en `Screen2.jsx` y el estado en `useFlow.js`
