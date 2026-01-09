import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) {
      setLoading(false)
      return
    }
    auth.me()
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const r = await auth.login({ username, password })
    localStorage.setItem('access', r.data.access)
    if (r.data.refresh) localStorage.setItem('refresh', r.data.refresh)
    const me = await auth.me()
    setUser(me.data)
  }

  const logout = async () => {
    const refresh = localStorage.getItem('refresh')
    try {
      if (refresh) await auth.logout({ refresh })
    } catch {}
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
