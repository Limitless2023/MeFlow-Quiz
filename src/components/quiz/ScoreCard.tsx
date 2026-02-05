/* ============================================================
 * [INPUT]: 依赖 @/components/ui/CircularProgress, @/components/ui/Badge
 * [OUTPUT]: 对外提供 ScoreCard 分数展示组件
 * [POS]: quiz/ 的结果页核心展示组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { CircularProgress } from '@/components/ui/CircularProgress'
import { Badge } from '@/components/ui/Badge'

interface Props {
  score: number
  total: number
  passScore: number
  correctCount: number
  wrongCount: number
  unanswered: number
}

export function ScoreCard({ score, total, passScore, correctCount, wrongCount, unanswered }: Props) {
  const passed = score >= passScore

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <CircularProgress score={score} total={total} passed={passed} />

      <Badge variant={passed ? 'success' : 'error'} className="text-sm !px-4 !py-1.5">
        {passed ? '恭喜通过！' : '未达到及格分'}
      </Badge>

      <div className="flex items-center gap-8 text-center">
        <div>
          <div className="text-2xl font-bold text-olive tabular-nums">{correctCount}</div>
          <div className="text-xs text-gray-500 mt-1">答对</div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <div className="text-2xl font-bold text-error tabular-nums">{wrongCount}</div>
          <div className="text-xs text-gray-500 mt-1">答错</div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <div className="text-2xl font-bold text-gray-400 tabular-nums">{unanswered}</div>
          <div className="text-xs text-gray-500 mt-1">未答</div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        及格分: {passScore} 分 · 满分: {total} 分
      </p>
    </div>
  )
}
