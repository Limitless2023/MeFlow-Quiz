/* ============================================================
 * [INPUT]: 依赖 @/lib/supabase, @/lib/mock-data, @/types/quiz
 * [OUTPUT]: 对外提供 login, logout, getStoredUser
 * [POS]: lib/ 的认证逻辑，桥接 Supabase 与 localStorage
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { supabase, isMockMode } from '@/lib/supabase'
import { mockLogin } from '@/lib/mock-data'
import type { User } from '@/types/quiz'

const STORAGE_KEY = 'meflow_quiz_user'

export async function login(name: string, department: string): Promise<User> {
  if (isMockMode) {
    const user = mockLogin(name, department)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
  }

  const { data, error } = await supabase!
    .from('users')
    .upsert({ name, department }, { onConflict: 'name,department' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data as User
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}
