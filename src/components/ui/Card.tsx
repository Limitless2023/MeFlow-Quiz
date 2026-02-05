/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 Card 组件
 * [POS]: ui/ 的卡片原子组件，Oatmeal Olive 风格
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ hover = false, padding = 'md', className = '', children, ...rest }: Props) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-card
        ${paddings[padding]}
        ${hover ? 'hover:-translate-y-1 hover:shadow-card-hover hover:border-olive/30 transition-all duration-200' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  )
}
