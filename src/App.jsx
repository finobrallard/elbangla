import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginModal from './components/LoginModal'
import Indumentaria from './pages/Indumentaria'
import Tesoreria from './pages/Tesoreria'

function Nav() {
  const base = 'flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-slate-300'
  const active = 'bg-slate-700 text-emerald-400'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:bottom-auto md:col-span-2 lg:col-span-1">
      <div className="flex md:flex-col gap-1 p-2 md:p-0 md:pt-4 bg-slate-800/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-t-0 border-slate-700">
        <NavLink
          to="/"
          className={({ isActive }) => `${base} ${isActive ? active : 'hover:bg-slate-700/50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Indumentaria
        </NavLink>
        <NavLink
          to="/tesoreria"
          className={({ isActive }) => `${base} ${isActive ? active : 'hover:bg-slate-700/50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tesorería
        </NavLink>
      </div>
    </nav>
  )
}

function Layout({ children }) {
  const { isAdmin, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <aside className="hidden md:flex md:w-56 lg:w-64 md:flex-col md:border-r md:border-slate-700" style={{ backgroundColor: '#1e2a27' }}>
        <header className="p-4 border-b border-slate-700/50 flex flex-col items-center">
          <img src="/logo.png" alt="Bangladesh Fútbol Club" className="h-16 w-16 object-contain mb-2" />
          <h1 className="text-lg font-bold text-emerald-400">App Bangla</h1>
          <p className="text-xs text-slate-400 mt-0.5">Admin Equipo</p>
          <div className="mt-3">
            {isAdmin ? (
              <button
                onClick={logout}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Cerrar sesión (Admin)
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                Iniciar sesión como admin
              </button>
            )}
          </div>
        </header>
        <Nav />
      </aside>

      <div className="flex-1 flex flex-col md:pl-0 pb-20 md:pb-0">
        <header className="md:hidden sticky top-0 z-40 backdrop-blur border-b border-slate-700/50 px-4 py-3 flex items-center justify-between gap-3" style={{ backgroundColor: '#1e2a27' }}>
          <img src="/logo.png" alt="Bangladesh Fútbol Club" className="h-10 w-10 object-contain flex-shrink-0" />
          <h1 className="text-lg font-bold text-emerald-400 flex-1">App Bangla</h1>
          {isAdmin ? (
            <button
              onClick={logout}
              className="text-xs text-rose-400 py-1 px-2"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-xs text-emerald-400 py-1 px-2"
            >
              Admin
            </button>
          )}
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>

        <div className="md:hidden">
          <Nav />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Layout>
          <Routes>
            <Route path="/" element={<Indumentaria />} />
            <Route path="/tesoreria" element={<Tesoreria />} />
          </Routes>
          </Layout>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
