/* ============================================================
 * [INPUT]: 依赖 @/contexts/AuthContext, react-router-dom
 * [OUTPUT]: 对外提供 AuthGuard, AdminGuard 路由守卫
 * [POS]: layout/ 的权限控制组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function AuthGuard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AdminGuard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
