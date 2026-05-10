import { useState, useRef, useCallback } from 'react'
import { generateProfile } from '../lib/profiles'
import { submitToSheets, generateSessionId } from '../lib/sheets'

const TOTAL_SCREENS = 6

const initialFormData = {
  // Screen 2
  tipo_propiedad: '',
  objetivo_compra: '',
  horizonte: '',
  prioridades: [],
  // Screen 3
  proyecto_seleccionado: '',
  // Screen 4
  valor_percibido_mercado: '',
  willingness_to_pay: '',
  forma_financiamiento: '',
  rango_ingreso: '',
  // Screen 5 (generated)
  perfil_generado: '',
  // Screen 6
  nombre: '',
  email: '',
  whatsapp: '',
}

export function useFlow() {
  const [screen, setScreen] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [profile, setProfile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const sessionId = useRef(generateSessionId())
  const startTime = useRef(Date.now())
  const lastSubmitTime = useRef(null)

  const completionRate = Math.round(((screen - 1) / (TOTAL_SCREENS - 1)) * 100)

  const update = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateMany = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  // Partial submit on key transitions (silent, fire-and-forget)
  const submitPartial = useCallback(async (extraData = {}) => {
    const now = Date.now()
    // Debounce: don't submit more than once every 3s
    if (lastSubmitTime.current && now - lastSubmitTime.current < 3000) return
    lastSubmitTime.current = now

    const seconds = Math.round((now - startTime.current) / 1000)
    await submitToSheets({
      ...formData,
      ...extraData,
      completion_status: 'partial',
      completion_rate: completionRate,
      session_id: sessionId.current,
      tiempo_total_segundos: seconds,
      pantalla_abandono: `pantalla_${screen}`,
    })
  }, [formData, completionRate, screen])

  const goToScreen = useCallback(async (next) => {
    // Submit partial data at key moments
    if (next === 4) {
      // User selected a project — important behavioral signal
      await submitPartial({ completion_status: 'reached_pricing' })
    }
    if (next === 5) {
      // User completed pricing — highest-value data point
      const p = generateProfile({
        objetivo: formData.objetivo_compra,
        prioridades: formData.prioridades,
        proyecto: formData.proyecto_seleccionado,
      })
      setProfile(p)
      updateMany({ perfil_generado: p.perfil })
      await submitPartial({
        perfil_generado: p.perfil,
        completion_status: 'reached_result',
      })
    }
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [formData, submitPartial, updateMany])

  const submitFinal = useCallback(async () => {
    setIsSubmitting(true)
    const seconds = Math.round((Date.now() - startTime.current) / 1000)

    await submitToSheets({
      ...formData,
      completion_status: 'completed',
      completion_rate: 100,
      session_id: sessionId.current,
      tiempo_total_segundos: seconds,
      pantalla_abandono: '',
    })

    setSubmitted(true)
    setIsSubmitting(false)
  }, [formData])

  return {
    screen,
    formData,
    profile,
    isSubmitting,
    submitted,
    completionRate,
    update,
    updateMany,
    goToScreen,
    submitFinal,
    submitPartial,
  }
}
