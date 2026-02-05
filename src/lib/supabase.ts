/* ============================================================
 * [INPUT]: 依赖 @supabase/supabase-js, 环境变量
 * [OUTPUT]: 对外提供 supabase client 实例
 * [POS]: lib/ 的数据层入口，被所有 hooks 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

/* -- Supabase 未配置时回退到 mock 模式 ----------------------- */
export const isMockMode = !supabaseUrl || !supabaseAnonKey
  || supabaseUrl === 'https://your-project.supabase.co'

export const supabase = isMockMode
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)
