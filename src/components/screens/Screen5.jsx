import { useState, useEffect } from 'react'
import { PROJECTS } from '../../lib/profiles'

const LOADING_STEPS = [
  { text: 'Analizando preferencias...', duration: 900 },
  { text: 'Procesando disposición a pagar...', duration: 800 },
  { text: 'Calibrando perfil de demanda...', duration: 700 },
  { text: 'Calculando compatibilidad...', duration: 600 },
]

function LoadingState() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    let i = 0
    const advance = () => {
      i++
      setStep(i)
      if (i < LOADING_STEPS.length - 1) {
        setTimeout(advance, LOADING_STEPS[i]?.duration || 700)
      }
    }
    const t = setTimeout(advance, LOADING_STEPS[0].duration)
    return () => clearTimeout(t)
  }, [])

  const total = LOADING_STEPS.reduce((a, b) => a + b.duration, 0)
  const elapsed = LOADING_STEPS.slice(0, step).reduce((a, b) => a + b.duration, 0)
  const pct = Math.round((elapsed / total) * 100)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
        <p className="font-display text-2xl text-stone-100 mb-2">Procesando tu perfil</p>
        <p className="text-stone-500 text-sm font-body">
          {LOADING_STEPS[step]?.text || 'Finalizando...'}
        </p>
      </div>
      <div className="w-full max-w-xs">
        <div className="progress-bar rounded-full">
          <div className="progress-fill rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-stone-600 text-xs font-mono mt-2">{pct}%</p>
      </div>
    </div>
  )
}

export default function Screen5({ profile, formData, onNext }) {
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)

  const project = PROJECTS.find(p => p.id === formData.proyecto_seleccionado)
  const totalDuration = LOADING_STEPS.reduce((a, b) => a + b.duration, 0) + 400

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setRevealed(true), 100)
    }, totalDuration)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <LoadingState />

  const compat = profile?.compatibilidad || 82
  const circumference = 2 * Math.PI * 45 // r=45
  const dashOffset = circumference * (1 - compat / 100)

  return (
    <div className={`min-h-screen flex flex-col max-w-2xl mx-auto px-6 py-10 transition-all duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="mb-8">
        <span className="label">RESULTADO · TU PERFIL</span>
        <h2 className="font-display text-3xl sm:text-4xl font-light mt-3 text-stone-100">
          Perfil identificado
        </h2>
      </div>

      {/* Compatibility ring + profile */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-6">
          {/* Ring */}
          <div className="flex-shrink-0 relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#292524" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="#f59e0b" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={revealed ? dashOffset : circumference}
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-medium text-amber-400">{compat}%</span>
              <span className="text-stone-500 text-[10px] font-mono">COMPAT.</span>
            </div>
          </div>

          {/* Profile text */}
          <div className="flex-1">
            <p className="text-stone-500 text-xs font-mono tracking-widest uppercase mb-1">Perfil detectado</p>
            <h3 className="font-display text-xl font-semibold text-stone-100 mb-2">
              {profile?.perfil}
            </h3>
            <p className="text-stone-400 text-sm font-body leading-relaxed">
              {profile?.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* Project match */}
      {project && (
        <div className="card p-5 mb-6">
          <p className="label mb-3">DESARROLLO MÁS COMPATIBLE</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.emoji}</span>
            <div className="flex-1">
              <p className="font-body font-semibold text-stone-100">{project.nombre}</p>
              <p className={`text-xs font-mono ${
                project.id === 'A' ? 'text-amber-400' :
                project.id === 'B' ? 'text-emerald-400' : 'text-sky-400'
              }`}>{project.tag}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 text-amber-400 text-xs font-mono">
              Match ✓
            </div>
          </div>
        </div>
      )}

      {/* Data insights */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-4">
          <p className="label text-[10px] mb-1">VALOR PERCIBIDO</p>
          <p className="font-mono text-stone-200 font-medium">
            USD {Number(formData.valor_percibido_mercado || 0).toLocaleString()}
          </p>
          <p className="text-stone-600 text-xs font-body mt-1">Estimación de mercado</p>
        </div>
        <div className="card p-4">
          <p className="label text-[10px] mb-1">DISPOSICIÓN A PAGAR</p>
          <p className="font-mono text-stone-200 font-medium">
            USD {Number(formData.willingness_to_pay || 0).toLocaleString()}
          </p>
          <p className="text-stone-600 text-xs font-body mt-1">Máximo declarado</p>
        </div>
      </div>

      {/* Priority summary */}
      <div className="card p-4 mb-6">
        <p className="label text-[10px] mb-3">TUS PRIORIDADES PRINCIPALES</p>
        <div className="flex flex-wrap gap-2">
          {(formData.prioridades || []).map((p, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-body border border-stone-700">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Teaser */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-8">
        <p className="text-amber-400 font-body text-sm font-medium mb-1">
          📬 Tu perfil está listo
        </p>
        <p className="text-stone-400 text-sm font-body">
          Dejanos tus datos y te notificamos cuando aparezcan oportunidades que realmente matchean con tu perfil y disposición a pagar.
        </p>
      </div>

      <button
        onClick={onNext}
        className="btn-primary w-full text-center"
      >
        Recibir oportunidades →
      </button>
    </div>
  )
}
