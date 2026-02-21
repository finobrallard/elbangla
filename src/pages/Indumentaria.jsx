import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

function NumeroInput({ value, onChange, placeholder = '-', disabled }) {
  return (
    <input
      type="number"
      min="0"
      max="99"
      value={value ?? ''}
      onChange={(e) => !disabled && onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={disabled}
      className={`w-14 text-center py-2 rounded-lg border text-sm ${
        disabled
          ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
          : 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
      }`}
    />
  )
}

export default function Indumentaria() {
  const { jugadores, indumentaria, updateIndumentaria, getEstadoPago, estaHabilitado, addJugador, loading } = useApp()
  const { isAdmin } = useAuth()
  const [nuevoNombre, setNuevoNombre] = useState('')

  const getIndumentaria = (jugadorId) => {
    return indumentaria.find((i) => i.jugador_id === jugadorId) || {}
  }

  const handleAddJugador = async (e) => {
    e.preventDefault()
    const nombre = nuevoNombre.trim()
    if (!nombre) return
    await addJugador(nombre)
    setNuevoNombre('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Gestión de Indumentaria</h2>
        <p className="text-slate-400 text-sm mt-1">Asigna números de camiseta por tipo</p>
      </div>

      {isAdmin && (
      <form onSubmit={handleAddJugador} className="flex gap-2">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre del jugador"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
        >
          Agregar
        </button>
      </form>
      )}

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-300">Jugador</th>
                <th className="text-center py-3 px-2 font-medium text-slate-300">Estado</th>
                <th className="text-center py-3 px-2 font-medium text-slate-300">Camiseta Blanca</th>
                <th className="text-center py-3 px-2 font-medium text-slate-300">Camiseta Azul</th>
                <th className="text-center py-3 px-2 font-medium text-slate-300">Camiseta Verde</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map((j) => {
                const ind = getIndumentaria(j.id)
                const habilitado = estaHabilitado(j.id)
                return (
                  <tr key={j.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-100">{j.nombre}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {habilitado ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
                          ✅ Habilitado
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">No habilitado</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <NumeroInput
                        value={ind.partido_a}
                        onChange={(v) => updateIndumentaria(j.id, 'partido_a', v)}
                        disabled={!isAdmin}
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <NumeroInput
                        value={ind.partido_b}
                        onChange={(v) => updateIndumentaria(j.id, 'partido_b', v)}
                        disabled={!isAdmin}
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <NumeroInput
                        value={ind.partido_c}
                        onChange={(v) => updateIndumentaria(j.id, 'partido_c', v)}
                        disabled={!isAdmin}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-slate-500 text-sm">
        Un jugador aparece como <strong className="text-emerald-400">✅ Habilitado</strong> solo si
        su cuota del mes está pagada. Marca la cuota en Tesorería.
      </p>
    </div>
  )
}
