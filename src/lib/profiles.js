// ─────────────────────────────────────────────────────────────────────────────
// Profile Engine
// Maps user inputs → psychological profile + compatibility score
// Designed to feel intelligent; logic is intentionally simple and fast to iterate
// ─────────────────────────────────────────────────────────────────────────────

const PROFILES = {
  inversor_conservador: {
    label: 'Inversor Conservador',
    description: 'Orientado a preservar capital con valorización sostenida.',
    traits: ['valorización', 'precio', 'ubicación'],
    objectives: ['invertir'],
    projects: ['B'],
  },
  inversor_activo: {
    label: 'Inversor Activo',
    description: 'Busca oportunidades con retorno acelerado y posicionamiento temprano.',
    traits: ['valorización', 'conectividad', 'precio'],
    objectives: ['invertir'],
    projects: ['B', 'C'],
  },
  familia_permanente: {
    label: 'Familia con Horizonte de Permanencia',
    description: 'Prioriza seguridad, comunidad y calidad de vida a largo plazo.',
    traits: ['seguridad', 'espacios verdes', 'privacidad'],
    objectives: ['vivir'],
    projects: ['A'],
  },
  estilo_de_vida: {
    label: 'Perfil Lifestyle Urbano',
    description: 'Valora la conectividad, el diseño y la experiencia cotidiana.',
    traits: ['diseño', 'conectividad', 'cercanía urbana', 'amenities'],
    objectives: ['vivir', 'segunda vivienda'],
    projects: ['C'],
  },
  segunda_vivienda: {
    label: 'Comprador de Segunda Residencia',
    description: 'Combina uso personal con potencial de renta o valorización.',
    traits: ['ubicación', 'amenities', 'privacidad'],
    objectives: ['segunda vivienda'],
    projects: ['A', 'C'],
  },
  exploratorio: {
    label: 'Perfil en Exploración',
    description: 'Evalúa opciones antes de comprometerse. Alta apertura a distintos modelos.',
    traits: [],
    objectives: ['explorando'],
    projects: ['A', 'B', 'C'],
  },
}

export function generateProfile(formData) {
  const { objetivo, prioridades = [], proyecto } = formData

  // Score each profile
  let bestProfile = null
  let bestScore = -1

  for (const [key, profile] of Object.entries(PROFILES)) {
    let score = 0

    // Objective match (heavy weight)
    if (profile.objectives.includes(objetivo)) score += 40

    // Priority overlap
    const overlap = prioridades.filter(p => profile.traits.includes(p))
    score += overlap.length * 12

    // Project alignment
    if (proyecto && profile.projects.includes(proyecto)) score += 20

    if (score > bestScore) {
      bestScore = score
      bestProfile = { key, ...profile, rawScore: score }
    }
  }

  // Convert raw score to a compatibility % that feels meaningful (70–96 range)
  const compatibility = Math.min(96, Math.max(70, Math.round(70 + (bestScore / 80) * 26)))

  return {
    perfil: bestProfile?.label || 'Perfil Personalizado',
    descripcion: bestProfile?.description || '',
    compatibilidad: compatibility,
    key: bestProfile?.key || 'exploratorio',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects data — 3 psychologically distinct archetypes
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS = [
  {
    id: 'A',
    nombre: 'Reserva Santa Clara',
    tag: 'Premium · Comunidad Cerrada',
    tagColor: 'text-amber-400',
    descripcion: 'Un desarrollo de baja densidad con acceso controlado, diseño arquitectónico de autor y una comunidad de perfil homogéneo. Para quienes priorizan seguridad, privacidad y pertenencia.',
    ventajas: [
      'Seguridad 24 hs con control perimetral',
      'Lotes desde 1.200 m² con espacios verdes integrados',
      'Reglamento de convivencia y diseño coordinado',
      'Valorización histórica superior al promedio zonal',
    ],
    rango: 'USD 85.000 – 140.000',
    perfil: 'Familia · Permanencia · Conservador',
    gradiente: 'from-stone-800 to-stone-900',
    acento: 'border-amber-500/40',
    emoji: '🏡',
  },
  {
    id: 'B',
    nombre: 'Distrito Crecimiento',
    tag: 'Inversión · Alto Potencial',
    tagColor: 'text-emerald-400',
    descripcion: 'Zona en expansión con infraestructura proyectada y fuerte demanda futura. Ideal para inversores que quieren entrar antes del mercado y capturar valorización anticipada.',
    ventajas: [
      'Precio de acceso 30% por debajo del promedio consolidado',
      'Proyección de valorización: 18–25% en 3 años',
      'Zona con inversión pública confirmada en infraestructura',
      'Fácil salida: alta liquidez en el segmento',
    ],
    rango: 'USD 35.000 – 65.000',
    perfil: 'Inversor · Renta · Crecimiento',
    gradiente: 'from-stone-800 to-stone-900',
    acento: 'border-emerald-500/40',
    emoji: '📈',
  },
  {
    id: 'C',
    nombre: 'Núcleo Urbano',
    tag: 'Lifestyle · Moderno',
    tagColor: 'text-sky-400',
    descripcion: 'Unidades compactas y eficientes en zona consolidada. Diseño contemporáneo, amenities activos y máxima conectividad. Para quienes eligen calidad de vida sobre metros cuadrados.',
    ventajas: [
      'Ubicación a 8 min de nodos de transporte y servicios clave',
      'Amenities: coworking, rooftop, gimnasio y áreas comunes',
      'Unidades desde 42 m² con diseño inteligente del espacio',
      'Compatible con uso personal + renta temporal (Airbnb)',
    ],
    rango: 'USD 55.000 – 90.000',
    perfil: 'Lifestyle · Urbano · Dinámico',
    gradiente: 'from-stone-800 to-stone-900',
    acento: 'border-sky-500/40',
    emoji: '🏙️',
  },
]

export const PRICE_RANGES = {
  A: { min: 85000, max: 140000, reference: 110000 },
  B: { min: 35000, max: 65000, reference: 48000 },
  C: { min: 55000, max: 90000, reference: 70000 },
}
