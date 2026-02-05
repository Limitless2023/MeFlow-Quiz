/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 FillBlankBody 填空题渲染器
 * [POS]: quiz/ 的题型渲染器之一
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { FillBlankResponse } from '@/types/quiz'

interface Props {
  response: FillBlankResponse | null
  onChange: (response: FillBlankResponse) => void
  disabled?: boolean
}

export function FillBlankBody({ response, onChange, disabled }: Props) {
  return (
    <div className="max-w-md">
      <input
        type="text"
        value={response?.text ?? ''}
        onChange={e => onChange({ text: e.target.value })}
        disabled={disabled}
        placeholder="请输入答案..."
        className={`
          w-full px-4 py-3 text-sm rounded-xl
          border-2 border-dashed border-gray-300 bg-white
          placeholder:text-gray-400
          focus:outline-none focus:border-olive focus:border-solid focus:ring-2 focus:ring-olive/20
          transition-all duration-150
          ${disabled ? 'opacity-60' : ''}
        `}
      />
    </div>
  )
}
