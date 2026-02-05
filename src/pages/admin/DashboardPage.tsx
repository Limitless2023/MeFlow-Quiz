/* ============================================================
 * [INPUT]: 依赖 @/lib/mock-data, @/components/ui/*
 * [OUTPUT]: 对外提供 DashboardPage Admin 仪表盘
 * [POS]: pages/admin/ 的首页，统计总览
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockGetStats, mockGetAllAttempts } from '@/lib/mock-data'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function DashboardPage() {
  const stats = useMemo(() => mockGetStats(), [])
  const attempts = useMemo(() => mockGetAllAttempts(), [])

  const statCards = [
    { label: '参与人数', value: stats.totalParticipants, suffix: '人' },
    { label: '平均分', value: stats.avgScore, suffix: `/${stats.totalPoints}` },
    { label: '及格率', value: stats.passRate, suffix: '%' },
    { label: '培训场次', value: 1, suffix: '场' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-gray-800">管理后台</h1>
          <p className="text-sm text-gray-500 mt-1">查看培训测验数据</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="text-xs">返回首页</Button>
        </Link>
      </div>

      {/* -- 统计卡片 -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <Card key={s.label} padding="md">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">
              {s.value}<span className="text-sm font-normal text-gray-400 ml-1">{s.suffix}</span>
            </p>
          </Card>
        ))}
      </div>

      {/* -- 部门统计 -- */}
      {stats.byDepartment.length > 0 && (
        <Card padding="lg" className="mb-8">
          <h3 className="font-medium text-gray-700 mb-4">部门统计</h3>
          <div className="flex flex-col gap-3">
            {stats.byDepartment.map(d => (
              <div key={d.department} className="flex items-center gap-4">
                <Badge variant="gray" className="min-w-[80px] justify-center">{d.department}</Badge>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-olive/70 rounded-full transition-all duration-500"
                    style={{ width: `${(d.avgScore / stats.totalPoints) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 tabular-nums w-20 text-right">
                  均分 {d.avgScore}
                </span>
                <span className="text-xs text-gray-400 w-12 text-right">{d.count}人</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* -- 最近答题记录 -- */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">答题记录</h3>
          <button
            type="button"
            onClick={() => {
              const csv = [
                '姓名,部门,分数,满分,状态,提交时间',
                ...attempts.map(a =>
                  `${a.user_name},${a.user_department},${a.score ?? 0},${a.total_points ?? 100},${(a.score ?? 0) >= 60 ? '及格' : '不及格'},${a.submitted_at ?? ''}`
                ),
              ].join('\n')
              const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = 'quiz-results.csv'
              link.click()
              URL.revokeObjectURL(url)
            }}
            className="text-xs text-olive hover:text-olive-dark cursor-pointer"
          >
            导出 CSV
          </button>
        </div>

        {attempts.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">暂无答题记录</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">姓名</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">部门</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">试卷</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">得分</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">状态</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">提交时间</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-olive-bg/30 transition-colors">
                    <td className="py-2.5 px-3 text-gray-800">{a.user_name}</td>
                    <td className="py-2.5 px-3"><Badge variant="gray">{a.user_department}</Badge></td>
                    <td className="py-2.5 px-3 text-gray-600">{a.quiz_title}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-medium text-gray-800">{a.score ?? 0}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant={(a.score ?? 0) >= 60 ? 'success' : 'error'}>
                        {(a.score ?? 0) >= 60 ? '及格' : '不及格'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right text-xs text-gray-400">
                      {a.submitted_at ? new Date(a.submitted_at).toLocaleString('zh-CN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
