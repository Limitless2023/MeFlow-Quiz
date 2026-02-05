/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 QuestionPalette 题号面板组件
 * [POS]: quiz/ 的状态概览组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

interface Props {
  total: number
  current: number
  answeredSet: Set<string>
  questionIds: string[]
  onJump: (index: number) => void
}

export function QuestionPalette({ total, current, answeredSet, questionIds, onJump }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card">
      <h4 className="text-sm font-medium text-gray-600 mb-3">答题卡</h4>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }, (_, i) => {
          const answered = answeredSet.has(questionIds[i])
          const isCurrent = i === current
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              className={`
                w-9 h-9 rounded-lg text-xs font-medium
                transition-all duration-150 cursor-pointer
                ${isCurrent
                  ? 'bg-olive text-white ring-2 ring-olive/30'
                  : answered
                    ? 'bg-olive-light text-olive'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        已答 {answeredSet.size}/{total} 题
      </p>
    </div>
  )
}
