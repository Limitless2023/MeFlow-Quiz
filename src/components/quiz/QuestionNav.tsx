/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 QuestionNav 前后导航组件
 * [POS]: quiz/ 的导航辅助组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { Button } from '@/components/ui/Button'

interface Props {
  current: number
  total: number
  answered: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export function QuestionNav({ current, total, onPrev, onNext, onSubmit }: Props) {
  const isFirst = current === 0
  const isLast = current === total - 1

  return (
    <div className="flex items-center justify-between mt-6">
      <Button variant="outline" onClick={onPrev} disabled={isFirst}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        上一题
      </Button>

      {isLast ? (
        <Button onClick={onSubmit}>
          提交答卷
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </Button>
      ) : (
        <Button onClick={onNext}>
          下一题
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      )}
    </div>
  )
}
