import { useState, useEffect } from 'react'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Screen6({ formData, update, onSubmit, isSubmitting, submitted }) {
  const [visible, setVisible] = useState(false)
  const { nombre, email, whatsapp } = formData

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const isValid = nombre?.trim().length > 1 && isValidEmail(email)

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="font-display text-3xl font-light text-stone-100 mb-3 animate-fade-up">
          Todo listo, {nombre?.split(' ')[0]}
        </h2>
        <p className="text-stone-400 font-body text-sm leading-relaxed mb-8 animate-fade-up animate-delay-100">
          Tu perfil quedó registrado. Te vamos a contactar cuando tengamos una oportunidad real alineada con lo que buscás.
        </p>
        <div className="card p-5 w-full text-left animate-fade-up animate-delay-200">
          <p className="label text-[10px] mb-3">RESUMEN DE TU SESIÓN</p>
          <div className="space-y-2 text-sm font-body text-stone-400">
            <div className="flex justify-between">
              <span>Perfil</span>
              <span className="text-stone-200">{formData.perfil_generado}</span>
            </div>
            <div className="flex justify-between">
              <span>Desarrollo</span>
              <span className="text-stone-200">Proyecto {formData.proyecto_seleccionado}</span>
            </div>
            <div className="flex justify-between">
              <span>WTP</span>
              <span className="text-stone-200">USD {Number(formData.willingness_to_pay || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <p className="text-stone-600 text-xs font-mono mt-8 tracking-widest">
          PROPERTYLINKER · BETA
        </p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col max-w-2xl mx-auto px-6 py-10 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="mb-8">
        <span className="label">PASO 4 DE 4 · TUS DATOS</span>
        <h2 className="font-display text-3xl sm:text-4xl font-light mt-3 text-stone-100">
          ¿A dónde te avisamos?
        </h2>
        <p className="text-stone-400 mt-2 font-body text-sm">
          Te notificamos cuando aparezcan oportunidades alineadas con tu perfil.
          Sin spam. Sin intermediarios.
        </p>
      </div>

      <div className="space-y-5 flex-1">

        {/* Nombre */}
        <div>
          <label className="label block mb-2">NOMBRE</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre || ''}
            onChange={e => update('nombre', e.target.value)}
            className="input-field"
            autoComplete="given-name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="label block mb-2">EMAIL</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email || ''}
            onChange={e => update('email', e.target.value)}
            className={`input-field ${
              email && !isValidEmail(email) ? 'border-red-500/40 focus:border-red-500/60' : ''
            }`}
            autoComplete="email"
          />
          {email && !isValidEmail(email) && (
            <p className="text-red-400 text-xs font-body mt-1">Email inválido</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="label block mb-2">
            WHATSAPP <span className="text-stone-600 normal-case font-body tracking-normal">· opcional</span>
          </label>
          <input
            type="tel"
            placeholder="+54 9 11 1234 5678"
            value={whatsapp || ''}
            onChange={e => update('whatsapp', e.target.value)}
            className="input-field"
            autoComplete="tel"
          />
          <p className="text-stone-600 text-xs font-body mt-1">
            Solo para contacto directo si encontramos algo relevante
          </p>
        </div>

        {/* Privacy note */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-4">
          <p className="text-stone-500 text-xs font-body leading-relaxed">
            🔒 Tus datos se usan exclusivamente para notificarte oportunidades compatibles con tu perfil.
            No los compartimos con terceros. Podés darte de baja en cualquier momento.
          </p>
        </div>

        {/* Profile reminder */}
        <div className="card p-4">
          <p className="label text-[10px] mb-2">SE VA A GUARDAR CON TU PERFIL</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
              {formData.perfil_generado}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 text-xs font-body border border-stone-700">
              Proyecto {formData.proyecto_seleccionado}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 text-xs font-body border border-stone-700">
              WTP: USD {Number(formData.willingness_to_pay || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-stone-800">
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 rounded-full font-body font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            isValid && !isSubmitting
              ? 'btn-primary'
              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-stone-600 border-t-stone-300 animate-spin" />
              Guardando...
            </>
          ) : (
            'Confirmar y recibir oportunidades →'
          )}
        </button>
      </div>
    </div>
  )
}
