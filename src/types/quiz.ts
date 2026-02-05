/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 全局类型定义 -- 数据库模型、题型、评分
 * [POS]: types/ 唯一成员，全项目类型中枢
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

/* -- 用户 ---------------------------------------------------- */
export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  department: string
  role: UserRole
  created_at: string
}

/* -- 培训 ---------------------------------------------------- */
export interface Training {
  id: string
  title: string
  description: string | null
  date: string | null
  cover_image: string | null
  is_active: boolean
  created_at: string
}

/* -- 试卷 ---------------------------------------------------- */
export interface Quiz {
  id: string
  training_id: string
  title: string
  description: string | null
  time_limit: number | null
  pass_score: number
  total_points: number
  is_active: boolean
}

/* -- 题型枚举 ------------------------------------------------ */
export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'ordering'

/* -- 选项: JSONB 多态结构 ------------------------------------ */
export interface ChoiceOption {
  id: string
  text: string
  is_correct: boolean
}

export interface FillBlankOption {
  id: 'answer'
  text: string
  alternatives?: string[]
}

export interface OrderingOption {
  id: string
  text: string
  correct_order: number
}

export type QuestionOption = ChoiceOption | FillBlankOption | OrderingOption

/* -- 题目 ---------------------------------------------------- */
export interface Question {
  id: string
  quiz_id: string
  type: QuestionType
  content: string
  options: QuestionOption[]
  explanation: string | null
  points: number
  sort_order: number
}

/* -- 用户回答: JSONB 多态结构 -------------------------------- */
export type SingleChoiceResponse = { selected: string }
export type MultipleChoiceResponse = { selected: string[] }
export type TrueFalseResponse = { selected: 'true' | 'false' }
export type FillBlankResponse = { text: string }
export type OrderingResponse = { order: string[] }

export type QuestionResponse =
  | SingleChoiceResponse
  | MultipleChoiceResponse
  | TrueFalseResponse
  | FillBlankResponse
  | OrderingResponse

/* -- 答题记录 ------------------------------------------------ */
export type AttemptStatus = 'in_progress' | 'submitted'

export interface Attempt {
  id: string
  user_id: string
  quiz_id: string
  score: number | null
  total_points: number | null
  status: AttemptStatus
  started_at: string
  submitted_at: string | null
}

/* -- 答案 ---------------------------------------------------- */
export interface Answer {
  id: string
  attempt_id: string
  question_id: string
  response: QuestionResponse
  is_correct: boolean | null
  points_earned: number
}

/* -- 部门列表 ------------------------------------------------ */
export const DEPARTMENTS = [
  '产品部',
  '技术部',
  '销售部',
  '法务部',
  '财务部',
  '市场部',
  '运营部',
  '人力资源部',
  '其他',
] as const

export type Department = (typeof DEPARTMENTS)[number]
