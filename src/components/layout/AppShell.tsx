/* ============================================================
 * [INPUT]: 依赖 react-router-dom, @/components/layout/Navbar
 * [OUTPUT]: 对外提供 AppShell 布局壳组件
 * [POS]: layout/ 的整体布局骨架
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="pt-[72px] pb-12">
        <Outlet />
      </main>
    </div>
  )
}
