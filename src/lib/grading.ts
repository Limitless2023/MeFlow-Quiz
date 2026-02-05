/* ============================================================
 * [INPUT]: 依赖 @/types/quiz 的类型定义
 * [OUTPUT]: 对外提供 gradeQuestion 统一评分函数
 * [POS]: lib/ 的评分引擎，纯函数，零副作用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type {
  Question,
  QuestionResponse,
  ChoiceOption,
  FillBlankOption,
  OrderingOption,
} from '@/types/quiz'

/* -- 评分策略注册表 ------------------------------------------ */
type GraderFn = (options: Question['options'], response: QuestionResponse) => boolean

const graders: Record<string, GraderFn> = {
  single_choice(options, response) {
    const r = response as { selected: string }
    const correct = (options as ChoiceOption[]).find(o => o.is_correct)
    return correct?.id === r.selected
  },

  multiple_choice(options, response) {
    const r = response as { selected: string[] }
    const correctIds = (options as ChoiceOption[])
      .filter(o => o.is_correct)
      .map(o => o.id)
      .sort()
    const selectedIds = [...r.selected].sort()
    return correctIds.length === selectedIds.length
      && correctIds.every((id, i) => id === selectedIds[i])
  },

  true_false(options, response) {
    const r = response as { selected: string }
    const correct = (options as ChoiceOption[]).find(o => o.is_correct)
    return correct?.id === r.selected
  },

  fill_blank(options, response) {
    const r = response as { text: string }
    const answer = (options as FillBlankOption[])[0]
    if (!answer || !r.text) return false
    const normalized = r.text.trim().toLowerCase()
    if (answer.text.toLowerCase() === normalized) return true
    return answer.alternatives?.some(alt => alt.toLowerCase() === normalized) ?? false
  },

  ordering(options, response) {
    const r = response as { order: string[] }
    const correctOrder = [...(options as OrderingOption[])]
      .sort((a, b) => a.correct_order - b.correct_order)
      .map(o => o.id)
    return correctOrder.length === r.order.length
      && correctOrder.every((id, i) => id === r.order[i])
  },
}

/* -- 统一评分入口 -------------------------------------------- */
export function gradeQuestion(question: Question, response: QuestionResponse): boolean {
  const grader = graders[question.type]
  if (!grader) return false
  return grader(question.options, response)
}
