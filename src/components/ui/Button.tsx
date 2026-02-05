/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 Button 组件 (primary / outline / ghost)
 * [POS]: ui/ 的按钮原子组件，全局复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-olive text-white border-olive hover:bg-olive-dark hover:border-olive-dark',
  outline: 'bg-transparent text-gray-700 border-gray-300 hover:border-olive hover:text-olive',
  ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-olive-light hover:text-olive',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function Button({ variant = 'primary', fullWidth, className = '', children, ...rest }: Props) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 px-5 py-2.5
        text-sm font-medium rounded-lg border
        transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}
