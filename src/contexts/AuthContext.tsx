/* ============================================================
 * [INPUT]: 依赖 @/lib/auth, @/types/quiz
 * [OUTPUT]: 对外提供 AuthProvider, useAuth hook
 * [POS]: contexts/ 唯一成员，全局认证状态中枢
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { login as authLogin, logout as authLogout, getStoredUser } from '@/lib/auth'
import type { User } from '@/types/quiz'

interface AuthState {
  user: User | null
  loading: boolean
  login: (name: string, department: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (name: string, department: string) => {
    setLoading(true)
    try {
      const u = await authLogin(name, department)
      setUser(u)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
