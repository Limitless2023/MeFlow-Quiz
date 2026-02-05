/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 MultipleChoiceBody 多选题渲染器
 * [POS]: quiz/ 的题型渲染器之一
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { ChoiceOption, MultipleChoiceResponse } from '@/types/quiz'

interface Props {
  options: ChoiceOption[]
  response: MultipleChoiceResponse | null
  onChange: (response: MultipleChoiceResponse) => void
  disabled?: boolean
}

export function MultipleChoiceBody({ options, response, onChange, disabled }: Props) {
  const selected = response?.selected ?? []

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id]
    onChange({ selected: next })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-500 mb-1">可选择多个答案</p>
      {options.map(opt => {
        const checked = selected.includes(opt.id)
        return (
          <label
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`
              flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer
              transition-all duration-150
              ${checked
                ? 'border-olive bg-olive-light/50 ring-1 ring-olive/20'
                : 'border-gray-200 bg-white hover:border-olive/30 hover:bg-olive-bg/30'
              }
              ${disabled ? 'opacity-60 pointer-events-none' : ''}
            `}
          >
            <div className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
              transition-colors duration-150
              ${checked ? 'border-olive bg-olive' : 'border-gray-300'}
            `}>
              {checked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700">{opt.text}</span>
          </label>
        )
      })}
    </div>
  )
}
