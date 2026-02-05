/* ============================================================
 * [INPUT]: 依赖 react-router-dom, @/contexts/AuthContext, 所有页面组件
 * [OUTPUT]: 对外提供 App 根组件 (路由定义)
 * [POS]: src/ 的路由中枢，组织所有页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard, AdminGuard } from '@/components/layout/AuthGuard'
import { LoginPage } from '@/pages/LoginPage'
import { TrainingListPage } from '@/pages/TrainingListPage'
import { QuizPage } from '@/pages/QuizPage'
import { ResultPage } from '@/pages/ResultPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* -- 公开路由 -- */}
          <Route path="/login" element={<LoginPage />} />

          {/* -- 需要登录 -- */}
          <Route element={<AuthGuard />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<TrainingListPage />} />
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/quiz/:id/result" element={<ResultPage />} />

              {/* -- Admin 路由 -- */}
              <Route element={<AdminGuard />}>
                <Route path="/admin" element={<DashboardPage />} />
              </Route>
            </Route>
          </Route>

          {/* -- 兜底 -- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
