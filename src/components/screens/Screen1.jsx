import { useEffect, useState } from 'react'

export default function Screen1({ onNext }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className={`flex items-center justify-between px-6 py-5 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="font-display text-lg font-semibold tracking-tight text-stone-100">
          Property<span className="text-amber-400">Linker</span>
        </span>
        <span className="label">ACCESO ANTICIPADO</span>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto w-full">
        
        {/* Badge */}
        <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-mono tracking-widest uppercase mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-slow" />
            Beta privada
          </span>
        </div>

        {/* Headline */}
        <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] text-balance mb-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Encontrá oportunidades{' '}
          <em className="font-light italic text-amber-400 not-italic" style={{ fontStyle: 'italic' }}>
            alineadas
          </em>{' '}
          con tu perfil
        </h1>

        {/* Sub */}
        <p className={`font-body text-lg text-stone-400 leading-relaxed max-w-xl mb-12 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Decinos qué buscás y descubrí desarrollos inmobiliarios compatibles antes que el mercado.
        </p>

        {/* CTA */}
        <div className={`transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onNext}
            className="btn-primary text-base"
          >
            Encontrar mi oportunidad →
          </button>
        </div>

        {/* Social proof */}
        <div className={`mt-16 flex flex-col items-center gap-3 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex -space-x-2">
            {['#8B5E3C','#6B8F71','#5B7FA6','#9B6B8F','#7FA68B'].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-stone-950"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-stone-500 text-sm font-body">
            <span className="text-stone-300">+340 personas</span> ya encontraron su perfil esta semana
          </p>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
      <div className="py-5 text-center">
        <p className="text-stone-600 text-xs font-mono tracking-widest">
          DESARROLLOS · DATOS · DECISIONES
        </p>
      </div>
    </div>
  )
}
