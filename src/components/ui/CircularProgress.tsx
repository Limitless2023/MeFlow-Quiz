/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 CircularProgress 圆形进度组件
 * [POS]: ui/ 的分数展示组件，用于 ResultPage
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

interface Props {
  score: number
  total: number
  size?: number
  passed: boolean
}

export function CircularProgress({ score, total, size = 160, passed }: Props) {
  const pct = total > 0 ? score / total : 0
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)
  const color = passed ? 'stroke-olive' : 'stroke-error'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth="10"
          className="stroke-gray-200"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth="10" strokeLinecap="round"
          className={`${color} transition-all duration-700 ease-out`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800 tabular-nums">{score}</span>
        <span className="text-sm text-gray-500">/ {total}</span>
      </div>
    </div>
  )
}
