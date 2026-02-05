/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 ReviewItem 逐题回顾组件
 * [POS]: quiz/ 的结果页回顾组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { Question, QuestionResponse, QuestionType, ChoiceOption, OrderingOption } from '@/types/quiz'
import { Badge } from '@/components/ui/Badge'

const TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: '单选题',
  multiple_choice: '多选题',
  true_false: '判断题',
  fill_blank: '填空题',
  ordering: '排序题',
}

interface Props {
  question: Question
  index: number
  response: QuestionResponse | null
  isCorrect: boolean | null
}

function formatUserAnswer(question: Question, response: QuestionResponse | null): string {
  if (!response) return '未作答'
  const opts = question.options as ChoiceOption[]

  switch (question.type) {
    case 'single_choice':
    case 'true_false': {
      const r = response as { selected: string }
      return opts.find(o => o.id === r.selected)?.text ?? '未知'
    }
    case 'multiple_choice': {
      const r = response as { selected: string[] }
      return r.selected.map(id => opts.find(o => o.id === id)?.text).filter(Boolean).join('、') || '未知'
    }
    case 'fill_blank': {
      const r = response as { text: string }
      return r.text || '未填写'
    }
    case 'ordering': {
      const r = response as { order: string[] }
      const ordOpts = question.options as OrderingOption[]
      return r.order.map(id => ordOpts.find(o => o.id === id)?.text).filter(Boolean).join(' → ') || '未知'
    }
    default:
      return '未知'
  }
}

function formatCorrectAnswer(question: Question): string {
  const opts = question.options as ChoiceOption[]

  switch (question.type) {
    case 'single_choice':
    case 'true_false':
      return opts.find(o => o.is_correct)?.text ?? ''
    case 'multiple_choice':
      return opts.filter(o => o.is_correct).map(o => o.text).join('、')
    case 'fill_blank':
      return (question.options[0] as { text: string }).text
    case 'ordering':
      return [...(question.options as OrderingOption[])]
        .sort((a, b) => a.correct_order - b.correct_order)
        .map(o => o.text)
        .join(' → ')
    default:
      return ''
  }
}

export function ReviewItem({ question, index, response, isCorrect }: Props) {
  return (
    <div className={`
      rounded-xl border p-5 transition-all duration-150
      ${isCorrect === true ? 'border-green-200 bg-green-50/50' : isCorrect === false ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-gray-50'}
    `}>
      {/* -- 头部 -- */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-500">第 {index + 1} 题</span>
        <Badge>{TYPE_LABELS[question.type]}</Badge>
        <span className="text-xs text-gray-400">{question.points} 分</span>
        <div className="ml-auto">
          {isCorrect === true && <Badge variant="success">正确</Badge>}
          {isCorrect === false && <Badge variant="error">错误</Badge>}
          {isCorrect === null && <Badge variant="gray">未答</Badge>}
        </div>
      </div>

      {/* -- 题干 -- */}
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{question.content}</p>

      {/* -- 你的回答 vs 正确答案 -- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">你的答案：</span>
          <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
            {formatUserAnswer(question, response)}
          </span>
        </div>
        {!isCorrect && (
          <div>
            <span className="text-gray-500">正确答案：</span>
            <span className="text-olive font-medium">{formatCorrectAnswer(question)}</span>
          </div>
        )}
      </div>

      {/* -- 解析 -- */}
      {question.explanation && (
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-600">解析：</span>{question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
