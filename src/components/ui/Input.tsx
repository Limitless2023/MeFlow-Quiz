/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 Input 组件
 * [POS]: ui/ 的输入框原子组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', id, ...rest }: Props) {
  const inputId = id || label?.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 text-sm rounded-lg
          border border-gray-300 bg-white
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-olive/20 focus:border-olive
          transition-colors duration-150
          ${className}
        `}
        {...rest}
      />
    </div>
  )
}
