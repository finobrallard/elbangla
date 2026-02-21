import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function Tesoreria() {
  const { isAdmin } = useAuth()
  const {
    jugadores,
    pagos,
    movimientos,
    ingresos,
    egresos,
    balance,
    marcarCuotaPagada,
    getEstadoPago,
    addMovimiento,
    loading,
  } = useApp()

  const [showNuevoMovimiento, setShowNuevoMovimiento] = useState(false)
  const [tipoMovimiento, setTipoMovimiento] = useState('ingreso')
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState('')
  const [jugadorId, setJugadorId] = useState('')

  const mesActual = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][
    new Date().getMonth()
  ]

  const handleGuardarMovimiento = (e) => {
    e.preventDefault()
    const m = parseFloat(monto)
    if (!concepto.trim() || isNaN(m) || m <= 0) return
    addMovimiento(tipoMovimiento, concepto.trim(), m, jugadorId || null)
    setConcepto('')
    setMonto('')
    setJugadorId('')
    setShowNuevoMovimiento(false)
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
        <h2 className="text-xl font-semibold text-slate-100">Tesorería</h2>
        <p className="text-slate-400 text-sm mt-1">Ingresos, egresos y cuotas</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Ingresos</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            ${ingresos.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Egresos</p>
          <p className="text-xl font-bold text-rose-400 mt-1">${egresos.toLocaleString('es-AR')}</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Balance</p>
          <p
            className={`text-xl font-bold mt-1 ${
              balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            ${balance.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Cuotas - Marcar como pagada */}
      <section>
        <h3 className="text-lg font-medium text-slate-200 mb-3">Cuotas del mes ({mesActual})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {jugadores.map((j) => {
            const estado = getEstadoPago(j.id)
            const pagado = estado === 'Pagado'
            return (
              <div
                key={j.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700"
              >
                <span className="font-medium text-slate-200">{j.nombre}</span>
                {isAdmin ? (
                  <button
                    onClick={() => marcarCuotaPagada(j.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      pagado
                        ? 'bg-emerald-600/80 text-white cursor-default'
                        : 'bg-slate-600 hover:bg-emerald-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    {pagado ? '✓ Cuota Pagada' : 'Marcar Pagada'}
                  </button>
                ) : (
                  <span className={`text-sm ${pagado ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {pagado ? '✓ Pagada' : 'Pendiente'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Movimientos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-slate-200">Movimientos</h3>
          {isAdmin && (
            <button
              onClick={() => setShowNuevoMovimiento(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition"
            >
              + Nuevo movimiento
            </button>
          )}
        </div>

        {isAdmin && showNuevoMovimiento && (
          <form
            onSubmit={handleGuardarMovimiento}
            className="mb-4 p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTipoMovimiento('ingreso')}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  tipoMovimiento === 'ingreso'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setTipoMovimiento('egreso')}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  tipoMovimiento === 'egreso'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                Egreso
              </button>
            </div>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Concepto"
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-emerald-500"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Monto"
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-emerald-500"
            />
            <select
              value={jugadorId}
              onChange={(e) => setJugadorId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:border-emerald-500"
            >
              <option value="">Sin jugador asociado</option>
              {jugadores.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNuevoMovimiento(false)}
                className="flex-1 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                Guardar
              </button>
            </div>
          </form>
        )}

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
          <div className="divide-y divide-slate-700 max-h-[400px] overflow-y-auto">
            {movimientos.length === 0 ? (
              <p className="p-6 text-center text-slate-500">No hay movimientos aún</p>
            ) : (
              movimientos.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-700/30"
                >
                  <div>
                    <p className="font-medium text-slate-200">{m.concepto}</p>
                    <p className="text-xs text-slate-500">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </p>
                  </div>
                  <span
                    className={`font-semibold ${
                      m.tipo === 'ingreso' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {m.tipo === 'ingreso' ? '+' : '-'}${Number(m.monto).toLocaleString('es-AR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
