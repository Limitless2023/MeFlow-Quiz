/* ============================================================
 * [INPUT]: 依赖 @/contexts/AuthContext, react-router-dom
 * [OUTPUT]: 对外提供 Navbar 导航栏组件
 * [POS]: layout/ 的顶部导航，backdrop-blur + Oatmeal Olive 风格
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* -- Logo -- */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-olive rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="font-serif text-lg font-semibold text-gray-800 group-hover:text-olive transition-colors">
            MeFlow Quiz
          </span>
        </Link>

        {/* -- 右侧: 用户信息 + 导航 -- */}
        {user && (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm text-gray-600 hover:text-olive transition-colors">
                管理后台
              </Link>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{user.name}</span>
              <Badge variant="gray">{user.department}</Badge>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-xs !px-3 !py-1.5">
              退出
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
