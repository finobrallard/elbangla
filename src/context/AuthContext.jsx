import { createContext, useContext, useState, useEffect } from 'react'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin'
const STORAGE_KEY = 'bangla_admin_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem(STORAGE_KEY)
    if (session === 'true') setIsAdmin(true)
  }, [])

  const login = (usuario, password) => {
    if (usuario === ADMIN_USER && password === ADMIN_PASS) {
      setIsAdmin(true)
      localStorage.setItem(STORAGE_KEY, 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = { isAdmin, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
