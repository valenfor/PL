import { useState, useEffect } from 'react'
import { PROJECTS } from '../../lib/profiles'

export default function Screen3({ formData, update, onNext }) {
  const [visible, setVisible] = useState(false)
  const { proyecto_seleccionado } = formData

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col max-w-2xl mx-auto px-6 py-10 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="mb-8">
        <span className="label">PASO 2 DE 4 · OPORTUNIDADES</span>
        <h2 className="font-display text-3xl sm:text-4xl font-light mt-3 text-stone-100">
          Encontramos 3 desarrollos compatibles
        </h2>
        <p className="text-stone-400 mt-2 font-body text-sm">
          Analizamos tu perfil y seleccionamos estas oportunidades. ¿Cuál te genera más interés?
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {PROJECTS.map((project, idx) => {
          const selected = proyecto_seleccionado === project.id
          return (
            <button
              key={project.id}
              onClick={() => update('proyecto_seleccionado', project.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-250 ${
                selected
                  ? `border-amber-500/60 bg-stone-900/80 shadow-lg shadow-amber-500/5`
                  : 'border-stone-800/80 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900/60'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-stone-100">
                        {project.nombre}
                      </h3>
                      {selected && (
                        <span className="text-xs bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-mono font-medium">
                          SELECCIONADO
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-mono tracking-wide ${project.tagColor}`}>
                      {project.tag}
                    </span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                  selected ? 'border-amber-500 bg-amber-500' : 'border-stone-600'
                }`}>
                  {selected && (
                    <span className="flex items-center justify-center text-stone-950 text-xs font-bold leading-5">✓</span>
                  )}
                </div>
              </div>

              <p className="text-stone-400 text-sm font-body leading-relaxed mb-4">
                {project.descripcion}
              </p>

              <div className="space-y-1.5 mb-4">
                {project.ventajas.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-stone-400 text-xs font-body">
                    <span className="text-amber-500/70 mt-0.5 flex-shrink-0">—</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                <div>
                  <div className="label text-[10px] mb-0.5">RANGO DE MERCADO</div>
                  <div className="font-mono text-stone-200 font-medium text-sm">{project.rango}</div>
                </div>
                <div className="text-right">
                  <div className="label text-[10px] mb-0.5">PERFIL IDEAL</div>
                  <div className="text-stone-400 text-xs font-body">{project.perfil}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-800">
        <button
          onClick={onNext}
          disabled={!proyecto_seleccionado}
          className={`w-full py-4 rounded-full font-body font-medium transition-all duration-300 ${
            proyecto_seleccionado
              ? 'btn-primary'
              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
          }`}
        >
          Continuar con {proyecto_seleccionado
            ? PROJECTS.find(p => p.id === proyecto_seleccionado)?.nombre
            : 'el proyecto seleccionado'} →
        </button>
      </div>
    </div>
  )
}
