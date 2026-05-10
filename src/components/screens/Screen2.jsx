import { useState, useEffect } from 'react'

const TIPOS = [
  { value: 'lote', label: 'Lote', icon: '🌿', desc: 'Terreno para construir' },
  { value: 'casa', label: 'Casa', icon: '🏡', desc: 'Vivienda independiente' },
  { value: 'departamento', label: 'Departamento', icon: '🏙️', desc: 'Unidad en edificio' },
]

const OBJETIVOS = [
  { value: 'vivir', label: 'Vivienda principal', icon: '🏠' },
  { value: 'invertir', label: 'Inversión', icon: '📈' },
  { value: 'segunda vivienda', label: 'Segunda vivienda', icon: '🌅' },
  { value: 'explorando', label: 'Estoy explorando', icon: '🔍' },
]

const HORIZONTES = [
  { value: 'inmediato', label: 'Inmediato', sub: 'Listo para decidir' },
  { value: '6 meses', label: '6 meses', sub: 'En proceso de búsqueda' },
  { value: '1 año', label: '1 año', sub: 'Planificando a mediano plazo' },
  { value: 'explorando', label: 'Sin definir', sub: 'Solo estoy mirando' },
]

const PRIORIDADES = [
  { value: 'seguridad', label: 'Seguridad', icon: '🔒' },
  { value: 'ubicación', label: 'Ubicación', icon: '📍' },
  { value: 'precio', label: 'Precio', icon: '💰' },
  { value: 'espacios verdes', label: 'Espacios verdes', icon: '🌳' },
  { value: 'valorización', label: 'Valorización', icon: '📊' },
  { value: 'amenities', label: 'Amenities', icon: '🏊' },
  { value: 'privacidad', label: 'Privacidad', icon: '🧘' },
  { value: 'conectividad', label: 'Conectividad', icon: '🚇' },
  { value: 'diseño', label: 'Diseño', icon: '✨' },
  { value: 'cercanía urbana', label: 'Cercanía urbana', icon: '🌆' },
]

function SelectCard({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`card-hover p-4 text-left transition-all duration-200 rounded-xl border ${
        selected
          ? 'border-amber-500/60 bg-amber-500/5'
          : 'border-stone-800/80'
      }`}
    >
      {children}
    </button>
  )
}

export default function Screen2({ formData, update, updateMany, onNext }) {
  const [visible, setVisible] = useState(false)
  const { tipo_propiedad, objetivo_compra, horizonte, prioridades } = formData

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const togglePrioridad = (val) => {
    const current = prioridades || []
    if (current.includes(val)) {
      update('prioridades', current.filter(p => p !== val))
    } else if (current.length < 3) {
      update('prioridades', [...current, val])
    }
  }

  const isValid = tipo_propiedad && objetivo_compra && horizonte && prioridades?.length > 0

  return (
    <div className={`min-h-screen flex flex-col max-w-2xl mx-auto px-6 py-10 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="mb-8">
        <span className="label">PASO 1 DE 4 · TU PERFIL</span>
        <h2 className="font-display text-3xl sm:text-4xl font-light mt-3 text-stone-100">
          ¿Qué estás buscando?
        </h2>
        <p className="text-stone-400 mt-2 font-body text-sm">
          Esto nos permite identificar oportunidades realmente compatibles con vos.
        </p>
      </div>

      <div className="space-y-8 flex-1">

        {/* Tipo */}
        <div>
          <p className="label mb-3">¿Qué tipo de propiedad?</p>
          <div className="grid grid-cols-3 gap-3">
            {TIPOS.map(t => (
              <SelectCard
                key={t.value}
                selected={tipo_propiedad === t.value}
                onClick={() => update('tipo_propiedad', t.value)}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-body font-medium text-stone-100 text-sm">{t.label}</div>
                <div className="text-stone-500 text-xs mt-0.5">{t.desc}</div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* Objetivo */}
        <div>
          <p className="label mb-3">¿Cuál es tu objetivo?</p>
          <div className="grid grid-cols-2 gap-3">
            {OBJETIVOS.map(o => (
              <SelectCard
                key={o.value}
                selected={objetivo_compra === o.value}
                onClick={() => update('objetivo_compra', o.value)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{o.icon}</span>
                  <span className="font-body text-sm font-medium text-stone-100">{o.label}</span>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* Horizonte */}
        <div>
          <p className="label mb-3">¿En qué horizonte temporal?</p>
          <div className="grid grid-cols-2 gap-3">
            {HORIZONTES.map(h => (
              <SelectCard
                key={h.value}
                selected={horizonte === h.value}
                onClick={() => update('horizonte', h.value)}
              >
                <div className="font-body font-medium text-stone-100 text-sm">{h.label}</div>
                <div className="text-stone-500 text-xs mt-0.5">{h.sub}</div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* Prioridades */}
        <div>
          <p className="label mb-1">¿Qué priorizás? <span className="text-stone-600 normal-case tracking-normal font-body text-xs">(elegí hasta 3)</span></p>
          <p className="text-stone-500 text-xs font-body mb-3">
            Seleccionadas: {prioridades?.length || 0}/3
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PRIORIDADES.map(p => {
              const selected = prioridades?.includes(p.value)
              const disabled = !selected && prioridades?.length >= 3
              return (
                <button
                  key={p.value}
                  onClick={() => togglePrioridad(p.value)}
                  disabled={disabled}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-150 ${
                    selected
                      ? 'border-amber-500/60 bg-amber-500/5 text-stone-100'
                      : disabled
                      ? 'border-stone-800/40 text-stone-600 cursor-not-allowed opacity-40'
                      : 'border-stone-800/80 text-stone-300 hover:border-stone-700 hover:text-stone-100'
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="font-body text-sm">{p.label}</span>
                  {selected && (
                    <span className="ml-auto text-amber-400 text-xs">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-stone-800">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-full font-body font-medium transition-all duration-300 ${
            isValid
              ? 'btn-primary'
              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
          }`}
        >
          Ver desarrollos compatibles →
        </button>
        {!isValid && (
          <p className="text-center text-stone-600 text-xs mt-2 font-body">
            Completá todas las opciones para continuar
          </p>
        )}
      </div>
    </div>
  )
}
