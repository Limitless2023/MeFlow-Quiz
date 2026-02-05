/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 TrueFalseBody 判断题渲染器
 * [POS]: quiz/ 的题型渲染器之一
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { ChoiceOption, TrueFalseResponse } from '@/types/quiz'

interface Props {
  options: ChoiceOption[]
  response: TrueFalseResponse | null
  onChange: (response: TrueFalseResponse) => void
  disabled?: boolean
}

export function TrueFalseBody({ options, response, onChange, disabled }: Props) {
  return (
    <div className="flex gap-4">
      {options.map(opt => {
        const selected = response?.selected === opt.id
        const isTrue = opt.id === 'true'
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ selected: opt.id as 'true' | 'false' })}
            className={`
              flex-1 py-6 rounded-xl border-2 text-center font-medium
              transition-all duration-150 cursor-pointer
              ${selected
                ? isTrue
                  ? 'border-olive bg-olive-light text-olive'
                  : 'border-error bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-olive/30'
              }
              ${disabled ? 'opacity-60 pointer-events-none' : ''}
            `}
          >
            <div className="text-2xl mb-1">{isTrue ? '✓' : '✗'}</div>
            <div className="text-sm">{opt.text}</div>
          </button>
        )
      })}
    </div>
  )
}
