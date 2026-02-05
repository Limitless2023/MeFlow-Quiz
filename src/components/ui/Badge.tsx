/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 Badge 药丸组件
 * [POS]: ui/ 的标签原子组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

type Variant = 'olive' | 'gray' | 'success' | 'error'

const variants: Record<Variant, string> = {
  olive: 'bg-olive-light text-olive',
  gray: 'bg-gray-100 text-gray-600',
  success: 'bg-green-50 text-green-700',
  error: 'bg-red-50 text-red-700',
}

interface Props {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'olive', children, className = '' }: Props) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
