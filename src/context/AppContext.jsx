import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEYS = {
  jugadores: 'bangla_jugadores',
  pagos: 'bangla_pagos',
  indumentaria: 'bangla_indumentaria',
  movimientos: 'bangla_movimientos',
}

const defaultJugadores = [
  { id: '1', nombre: 'Juan Pérez' },
  { id: '2', nombre: 'Carlos Rodríguez' },
  { id: '3', nombre: 'Luis Martínez' },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [jugadores, setJugadores] = useState([])
  const [pagos, setPagos] = useState([])
  const [indumentaria, setIndumentaria] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      if (supabase) {
        const [jugRes, pagRes, indRes, movRes] = await Promise.all([
          supabase.from('jugadores').select('*').order('nombre'),
          supabase.from('pagos').select('*'),
          supabase.from('indumentaria').select('*'),
          supabase.from('movimientos').select('*').order('created_at', { ascending: false }),
        ])

        if (!jugRes.error) setJugadores(jugRes.data || [])
        if (!pagRes.error) setPagos(pagRes.data || [])
        if (!indRes.error) setIndumentaria(indRes.data || [])
        if (!movRes.error) setMovimientos(movRes.data || [])
      } else {
        const storedJugadores = loadFromStorage(STORAGE_KEYS.jugadores)
        const storedPagos = loadFromStorage(STORAGE_KEYS.pagos)
        const storedIndumentaria = loadFromStorage(STORAGE_KEYS.indumentaria)
        const storedMovimientos = loadFromStorage(STORAGE_KEYS.movimientos)

        setJugadores(storedJugadores?.length ? storedJugadores : defaultJugadores)
        setPagos(storedPagos || [])
        setIndumentaria(storedIndumentaria || [])
        setMovimientos(storedMovimientos || [])
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setJugadores(loadFromStorage(STORAGE_KEYS.jugadores) || defaultJugadores)
      setPagos(loadFromStorage(STORAGE_KEYS.pagos) || [])
      setIndumentaria(loadFromStorage(STORAGE_KEYS.indumentaria) || [])
      setMovimientos(loadFromStorage(STORAGE_KEYS.movimientos) || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const persist = useCallback(async (key, data, setter) => {
    setter(data)
    if (supabase) {
      // Supabase sync se hace en cada operación individual
      return
    }
    saveToStorage(key, data)
  }, [])

  const addJugador = useCallback(async (nombre) => {
    const nuevo = { id: crypto.randomUUID(), nombre }
    if (supabase) {
      const { data, error } = await supabase.from('jugadores').insert({ nombre: nuevo.nombre }).select().single()
      if (!error) {
        setJugadores((prev) => [...prev, data])
        return data.id
      }
    }
    setJugadores((prev) => {
      const next = [...prev, nuevo]
      saveToStorage(STORAGE_KEYS.jugadores, next)
      return next
    })
    return nuevo.id
  }, [])

  const marcarCuotaPagada = useCallback(async (jugadorId, mes, ano = new Date().getFullYear()) => {
    const mesActual = mes || ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][new Date().getMonth()]
    const nuevo = {
      jugador_id: jugadorId,
      mes: mesActual,
      ano,
      estado: 'pagado',
      monto: 0,
      fecha_pago: new Date().toISOString(),
    }
    if (supabase) {
      const { data, error } = await supabase.from('pagos').upsert(nuevo, {
        onConflict: 'jugador_id,mes,ano',
      }).select().single()
      if (!error) {
        setPagos((prev) => prev.filter(p => !(p.jugador_id === jugadorId && p.mes === mesActual && p.ano === ano)))
        setPagos(prev => [...prev, data])
        return
      }
    }
    setPagos((prev) => {
      const filtered = prev.filter(p => !(p.jugador_id === jugadorId && p.mes === mesActual && p.ano === ano))
      const next = [...filtered, { ...nuevo, id: crypto.randomUUID() }]
      saveToStorage(STORAGE_KEYS.pagos, next)
      return next
    })
  }, [])

  const getEstadoPago = useCallback((jugadorId) => {
    const mesActual = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][new Date().getMonth()]
    const ano = new Date().getFullYear()
    const pago = pagos.find(p => p.jugador_id === jugadorId && p.mes === mesActual && p.ano === ano)
    return pago?.estado === 'pagado' ? 'Pagado' : 'Pendiente'
  }, [pagos])

  const estaHabilitado = useCallback((jugadorId) => getEstadoPago(jugadorId) === 'Pagado', [getEstadoPago])

  const updateIndumentaria = useCallback(async (jugadorId, field, value) => {
    const current = indumentaria.find(i => i.jugador_id === jugadorId) || { jugador_id: jugadorId }
    const updated = { ...current, [field]: value, updated_at: new Date().toISOString() }

    if (supabase) {
      const { data, error } = await supabase.from('indumentaria').upsert(updated, {
        onConflict: 'jugador_id',
      }).select().single()
      if (!error) {
        setIndumentaria((prev) => {
          const filtered = prev.filter(i => i.jugador_id !== jugadorId)
          return [...filtered, data]
        })
        return
      }
    }

    setIndumentaria((prev) => {
      const filtered = prev.filter(i => i.jugador_id !== jugadorId)
      const next = [...filtered, { ...updated, id: updated.id || crypto.randomUUID() }]
      saveToStorage(STORAGE_KEYS.indumentaria, next)
      return next
    })
  }, [indumentaria])

  const addMovimiento = useCallback(async (tipo, concepto, monto, jugadorId = null) => {
    const nuevo = { tipo, concepto, monto, jugador_id: jugadorId || null }
    if (supabase) {
      const { data, error } = await supabase.from('movimientos').insert(nuevo).select().single()
      if (!error) {
        setMovimientos(prev => [data, ...prev])
        return data.id
      }
    }
    setMovimientos(prev => {
      const next = [{ ...nuevo, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...prev]
      saveToStorage(STORAGE_KEYS.movimientos, next)
      return next
    })
    return crypto.randomUUID()
  }, [])

  const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + Number(m.monto), 0)
  const egresos = movimientos.filter(m => m.tipo === 'egreso').reduce((s, m) => s + Number(m.monto), 0)
  const balance = ingresos - egresos

  const value = {
    jugadores,
    pagos,
    indumentaria,
    movimientos,
    loading,
    addJugador,
    marcarCuotaPagada,
    getEstadoPago,
    estaHabilitado,
    updateIndumentaria,
    addMovimiento,
    loadData,
    ingresos,
    egresos,
    balance,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
