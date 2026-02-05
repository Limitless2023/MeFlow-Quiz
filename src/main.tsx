/* ============================================================
 * [INPUT]: 依赖 react, react-dom, @/index.css, @/App
 * [OUTPUT]: React 应用挂载入口
 * [POS]: src/ 的启动点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
