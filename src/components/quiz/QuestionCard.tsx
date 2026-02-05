/* ============================================================
 * [INPUT]: 依赖 @/types/quiz, 所有题型渲染器
 * [OUTPUT]: 对外提供 QuestionCard 组件 (统一分发给题型渲染器)
 * [POS]: quiz/ 的核心路由组件，策略模式消除分支
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { ComponentType } from 'react'
import type { Question, QuestionResponse, QuestionType } from '@/types/quiz'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SingleChoiceBody } from './SingleChoiceBody'
import { MultipleChoiceBody } from './MultipleChoiceBody'
import { TrueFalseBody } from './TrueFalseBody'
import { FillBlankBody } from './FillBlankBody'
import { OrderingBody } from './OrderingBody'

/* -- 题型标签映射 -------------------------------------------- */
const TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: '单选题',
  multiple_choice: '多选题',
  true_false: '判断题',
  fill_blank: '填空题',
  ordering: '排序题',
}

/* -- 策略注册表: 题型 → 渲染器 ------------------------------ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDERERS: Record<QuestionType, ComponentType<any>> = {
  single_choice: SingleChoiceBody,
  multiple_choice: MultipleChoiceBody,
  true_false: TrueFalseBody,
  fill_blank: FillBlankBody,
  ordering: OrderingBody,
}

interface Props {
  question: Question
  index: number
  total: number
  response: QuestionResponse | null
  onChange: (response: QuestionResponse) => void
  disabled?: boolean
}

export function QuestionCard({ question, index, total, response, onChange, disabled }: Props) {
  const Renderer = RENDERERS[question.type]

  return (
    <Card padding="lg" className="animate-fade-in">
      {/* -- 头部: 序号 + 题型 + 分值 -- */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            第 {index + 1}/{total} 题
          </span>
          <Badge>{TYPE_LABELS[question.type]}</Badge>
        </div>
        <span className="text-xs text-gray-400">{question.points} 分</span>
      </div>

      {/* -- 题干 -- */}
      <h3 className="text-base font-medium text-gray-800 leading-relaxed mb-6">
        {question.content}
      </h3>

      {/* -- 选项区 (策略模式渲染) -- */}
      <Renderer
        options={question.options}
        response={response}
        onChange={onChange}
        disabled={disabled}
      />
    </Card>
  )
}
