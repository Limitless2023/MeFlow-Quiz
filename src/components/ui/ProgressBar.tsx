/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 ProgressBar 进度条组件
 * [POS]: ui/ 的进度原子组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

interface Props {
  value: number
  max: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max, className = '', showLabel = true }: Props) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-olive rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
          {value}/{max}
        </span>
      )}
    </div>
  )
}
