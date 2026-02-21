import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (login(usuario.trim(), password)) {
      onClose()
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-slate-800 border border-slate-700 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Iniciar sesión como administrador</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
