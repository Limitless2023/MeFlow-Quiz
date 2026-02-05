/* ============================================================
 * [INPUT]: 依赖 @/contexts/AuthContext, @/components/ui/*, @/types/quiz
 * [OUTPUT]: 对外提供 LoginPage 登录页组件
 * [POS]: pages/ 的入口页面，用户首次接触点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { DEPARTMENTS } from '@/types/quiz'

export function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('请输入姓名')
    if (!department) return setError('请选择部门')

    try {
      await login(name.trim(), department)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-olive-bg px-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* -- Logo 区域 -- */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-olive rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-gray-800">
            MeFlow <span className="italic text-olive">Quiz</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">培训知识测验平台</p>
        </div>

        {/* -- 登录卡片 -- */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="姓名"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入你的姓名"
              autoFocus
            />
            <Select
              label="部门"
              options={DEPARTMENTS}
              value={department}
              onChange={e => setDepartment(e.target.value)}
              placeholder="请选择所在部门"
            />
            {error && (
              <p className="text-sm text-error">{error}</p>
            )}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? '登录中...' : '进入测验'}
            </Button>
          </form>
        </Card>

        <p className="text-xs text-gray-400 text-center mt-6">
          MeFlow Training Quiz Platform
        </p>
      </div>
    </div>
  )
}
