/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 SingleChoiceBody 单选题渲染器
 * [POS]: quiz/ 的题型渲染器之一
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { ChoiceOption, SingleChoiceResponse } from '@/types/quiz'

interface Props {
  options: ChoiceOption[]
  response: SingleChoiceResponse | null
  onChange: (response: SingleChoiceResponse) => void
  disabled?: boolean
}

export function SingleChoiceBody({ options, response, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => {
        const selected = response?.selected === opt.id
        return (
          <label
            key={opt.id}
            onClick={() => onChange({ selected: opt.id })}
            className={`
              flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer
              transition-all duration-150
              ${selected
                ? 'border-olive bg-olive-light/50 ring-1 ring-olive/20'
                : 'border-gray-200 bg-white hover:border-olive/30 hover:bg-olive-bg/30'
              }
              ${disabled ? 'opacity-60 pointer-events-none' : ''}
            `}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
              transition-colors duration-150
              ${selected ? 'border-olive bg-olive' : 'border-gray-300'}
            `}>
              {selected && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-sm text-gray-700">{opt.text}</span>
          </label>
        )
      })}
    </div>
  )
}
