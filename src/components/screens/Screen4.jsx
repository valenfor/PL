import { useState, useEffect } from 'react'
import { PROJECTS, PRICE_RANGES } from '../../lib/profiles'

const FINANCIAMIENTO = [
  { value: 'contado', label: 'Contado', icon: '💵' },
  { value: 'crédito', label: 'Crédito hipotecario', icon: '🏦' },
  { value: 'mixto', label: 'Mixto', icon: '⚖️' },
]

const INGRESOS = [
  { value: 'menos_1500', label: 'Menos de USD 1.500/mes' },
  { value: '1500_3000', label: 'USD 1.500 – 3.000/mes' },
  { value: '3000_6000', label: 'USD 3.000 – 6.000/mes' },
  { value: '6000_plus', label: 'Más de USD 6.000/mes' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decirlo' },
]

function PriceSlider({ value, onChange, min, max, step = 1000, label, sublabel, warning }) {
  const pct = ((value - min) / (max - min)) * 100

  const formatUSD = (n) =>
    n >= 1000 ? `USD ${(n / 1000).toFixed(0)}k` : `USD ${n.toLocaleString()}`

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="label">{label}</p>
          {sublabel && <p className="text-stone-500 text-xs font-body mt-0.5">{sublabel}</p>}
        </div>
        <div className="text-right">
          <div className={`font-mono text-lg font-medium transition-colors duration-200 ${
            warning ? 'text-amber-400' : 'text-stone-100'
          }`}>
            {formatUSD(value)}
          </div>
        </div>
      </div>

      <div className="relative py-3">
        <div className="h-1.5 bg-stone-800 rounded-full">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 w-full cursor-pointer"
          style={{ height: '100%' }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-amber-500 border-2 border-stone-950 shadow-lg pointer-events-none transition-all duration-150"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between text-stone-600 text-xs font-mono mt-1">
        <span>{formatUSD(min)}</span>
        <span>{formatUSD(max)}</span>
      </div>

      {warning && (
        <div className="mt-2 flex items-center gap-2 text-amber-400 text-xs font-body bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
          <span>⚠️</span>
          <span>Tu valor se aleja bastante del rango habitual para este tipo de desarrollo. ¿Querés revisarlo?</span>
        </div>
      )}
    </div>
  )
}

export default function Screen4({ formData, update, onNext }) {
  const [visible, setVisible] = useState(false)
  const [valorPercibido, setValorPercibido] = useState(null)
  const [willingness, setWillingness] = useState(null)
  const { proyecto_seleccionado, forma_financiamiento, rango_ingreso } = formData

  const project = PROJECTS.find(p => p.id === proyecto_seleccionado)
  const range = PRICE_RANGES[proyecto_seleccionado] || { min: 30000, max: 150000, reference: 80000 }

  // Initialize sliders at reference price
  useEffect(() => {
    setValorPercibido(range.reference)
    setWillingness(range.reference)
  }, [range.reference])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Anti-outlier detection
  const vpOutlier = valorPercibido && (valorPercibido < range.min * 0.6 || valorPercibido > range.max * 1.5)
  const wtpOutlier = willingness && (willingness < range.min * 0.5 || willingness > range.max * 1.6)

  const isValid = valorPercibido && willingness && forma_financiamiento

  const handleNext = () => {
    update('valor_percibido_mercado', valorPercibido)
    update('willingness_to_pay', willingness)
    onNext()
  }

  if (!project || valorPercibido === null) return null

  return (
    <div className={`min-h-screen flex flex-col max-w-2xl mx-auto px-6 py-10 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="mb-8">
        <span className="label">PASO 3 DE 4 · VALORACIÓN</span>
        <h2 className="font-display text-3xl sm:text-4xl font-light mt-3 text-stone-100">
          Tu perspectiva de valor
        </h2>
        <p className="text-stone-400 mt-2 font-body text-sm">
          No hay respuestas correctas. Esto nos ayuda a entender cómo percibís el mercado.
        </p>
      </div>

      {/* Project reminder */}
      <div className="card p-4 mb-8 flex items-center gap-3">
        <span className="text-2xl">{project.emoji}</span>
        <div>
          <p className="font-body font-medium text-stone-200 text-sm">{project.nombre}</p>
          <p className={`text-xs font-mono ${
            project.id === 'A' ? 'text-amber-400' :
            project.id === 'B' ? 'text-emerald-400' : 'text-sky-400'
          }`}>{project.tag}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-stone-500 text-xs font-mono">REFERENCIA</p>
          <p className="text-stone-300 text-sm font-mono">{project.rango}</p>
        </div>
      </div>

      <div className="space-y-10 flex-1">

        {/* Valor percibido */}
        <div className="card p-5">
          <PriceSlider
            label="¿CUÁL CREÉS QUE ES EL VALOR DE MERCADO?"
            sublabel="Tu estimación de lo que vale este tipo de desarrollo hoy"
            value={valorPercibido}
            onChange={setValorPercibido}
            min={Math.round(range.min * 0.5)}
            max={Math.round(range.max * 1.8)}
            step={range.reference > 80000 ? 5000 : 1000}
            warning={vpOutlier}
          />
        </div>

        {/* Willingness to pay */}
        <div className="card p-5">
          <PriceSlider
            label="¿CUÁNTO ESTARÍAS DISPUESTO/A A PAGAR?"
            sublabel="El máximo que invertirías si la oportunidad te convence"
            value={willingness}
            onChange={setWillingness}
            min={Math.round(range.min * 0.4)}
            max={Math.round(range.max * 1.8)}
            step={range.reference > 80000 ? 5000 : 1000}
            warning={wtpOutlier}
          />
          {willingness > valorPercibido && (
            <p className="mt-3 text-sky-400 text-xs font-body flex items-center gap-1.5">
              <span>ℹ️</span>
              Tu disposición a pagar supera tu estimación de mercado — eso suele indicar alta preferencia por este tipo de desarrollo.
            </p>
          )}
        </div>

        {/* Financiamiento */}
        <div>
          <p className="label mb-3">¿CÓMO FINANCIARÍAS LA COMPRA?</p>
          <div className="grid grid-cols-3 gap-3">
            {FINANCIAMIENTO.map(f => (
              <button
                key={f.value}
                onClick={() => update('forma_financiamiento', f.value)}
                className={`p-4 rounded-xl border text-center transition-all duration-150 ${
                  forma_financiamiento === f.value
                    ? 'border-amber-500/60 bg-amber-500/5 text-stone-100'
                    : 'border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="text-xl mb-1.5">{f.icon}</div>
                <div className="text-xs font-body">{f.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ingreso (optional) */}
        <div>
          <p className="label mb-1">RANGO DE INGRESO MENSUAL</p>
          <p className="text-stone-500 text-xs font-body mb-3">Opcional · Solo para calibrar opciones de financiamiento</p>
          <div className="space-y-2">
            {INGRESOS.map(i => (
              <button
                key={i.value}
                onClick={() => update('rango_ingreso', i.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 text-sm font-body ${
                  rango_ingreso === i.value
                    ? 'border-amber-500/60 bg-amber-500/5 text-stone-100'
                    : 'border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-stone-800">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-full font-body font-medium transition-all duration-300 ${
            isValid
              ? 'btn-primary'
              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
          }`}
        >
          Analizar mi compatibilidad →
        </button>
      </div>
    </div>
  )
}
