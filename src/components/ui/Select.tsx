/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 Select 下拉组件
 * [POS]: ui/ 的选择框原子组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { SelectHTMLAttributes } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: readonly string[]
  placeholder?: string
}

export function Select({ label, options, placeholder, className = '', id, ...rest }: Props) {
  const selectId = id || label?.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-4 py-2.5 text-sm rounded-lg
          border border-gray-300 bg-white
          focus:outline-none focus:ring-2 focus:ring-olive/20 focus:border-olive
          transition-colors duration-150 appearance-none
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
          bg-[position:right_12px_center] bg-no-repeat
          ${className}
        `}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
