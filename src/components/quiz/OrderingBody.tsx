/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 OrderingBody 排序题渲染器
 * [POS]: quiz/ 的题型渲染器之一，支持上下按钮排序
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { useState, useEffect } from 'react'
import type { OrderingOption, OrderingResponse } from '@/types/quiz'

interface Props {
  options: OrderingOption[]
  response: OrderingResponse | null
  onChange: (response: OrderingResponse) => void
  disabled?: boolean
}

export function OrderingBody({ options, response, onChange, disabled }: Props) {
  /* -- 初始化: 随机打乱或恢复已有回答 -- */
  const [items, setItems] = useState<OrderingOption[]>(() => {
    if (response?.order) {
      return response.order
        .map(id => options.find(o => o.id === id))
        .filter((o): o is OrderingOption => !!o)
    }
    return [...options].sort(() => Math.random() - 0.5)
  })

  useEffect(() => {
    onChange({ order: items.map(i => i.id) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setItems(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 mb-1">请用箭头调整顺序</p>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl border bg-white
            border-gray-200 transition-all duration-150
            ${disabled ? 'opacity-60' : ''}
          `}
        >
          {/* -- 序号 -- */}
          <span className="w-7 h-7 rounded-full bg-olive-light text-olive text-xs font-bold flex items-center justify-center shrink-0">
            {idx + 1}
          </span>

          {/* -- 文本 -- */}
          <span className="flex-1 text-sm text-gray-700">{item.text}</span>

          {/* -- 上下按钮 -- */}
          {!disabled && (
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(idx, idx - 1)}
                disabled={idx === 0}
                className="p-1 rounded hover:bg-olive-light disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => move(idx, idx + 1)}
                disabled={idx === items.length - 1}
                className="p-1 rounded hover:bg-olive-light disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
