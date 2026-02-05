/* ============================================================
 * [INPUT]: 依赖 @/types/quiz
 * [OUTPUT]: 对外提供 mock 数据和操作函数 (无 Supabase 时的回退)
 * [POS]: lib/ 的本地数据层，使项目无需 Supabase 即可运行
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type {
  User, Training, Quiz, Question, Attempt, Answer,
  QuestionResponse,
} from '@/types/quiz'
import { gradeQuestion } from '@/lib/grading'
import { trainingData } from '@/data/training-0205'

/* -- ID 生成器 ----------------------------------------------- */
const uid = () => crypto.randomUUID()

/* -- 存储键 -------------------------------------------------- */
const KEYS = {
  users: 'mq_users',
  attempts: 'mq_attempts',
  answers: 'mq_answers',
} as const

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }
  catch { return [] }
}
function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

/* -- 培训数据 (硬编码，来自 seed) ----------------------------- */
const TRAINING: Training = {
  id: 'training-0205',
  title: 'MeFlow Agent 专题培训',
  description: '覆盖 Chat 合同联动、Skill 机制、SubAgent、主动型 Agent 等 15 个核心知识模块',
  date: '2026-02-05',
  cover_image: null,
  is_active: true,
  created_at: '2026-02-05T10:00:00Z',
}

const QUIZ: Quiz = {
  id: 'quiz-0205',
  training_id: 'training-0205',
  title: 'MeFlow Agent 培训测验',
  description: '共 20 题，满分 100 分，60 分及格',
  time_limit: null,
  pass_score: 60,
  total_points: 100,
  is_active: true,
}

const QUESTIONS: Question[] = trainingData.questions.map((q, i) => ({
  ...q,
  id: q.id || `q-${i + 1}`,
  quiz_id: 'quiz-0205',
  sort_order: i,
}))

/* -- 公开 API ------------------------------------------------ */

export function mockLogin(name: string, department: string): User {
  const users = load<User>(KEYS.users)
  const existing = users.find(u => u.name === name && u.department === department)
  if (existing) return existing

  const user: User = {
    id: uid(),
    name,
    department,
    role: name === 'admin' ? 'admin' : 'user',
    created_at: new Date().toISOString(),
  }
  users.push(user)
  save(KEYS.users, users)
  return user
}

export function mockGetTrainings(): Training[] {
  return [TRAINING]
}

export function mockGetTraining(id: string): Training | null {
  return id === TRAINING.id ? TRAINING : null
}

export function mockGetQuiz(trainingId: string): Quiz | null {
  return trainingId === TRAINING.id ? QUIZ : null
}

export function mockGetQuizById(quizId: string): Quiz | null {
  return quizId === QUIZ.id ? QUIZ : null
}

export function mockGetQuestions(quizId: string): Question[] {
  return quizId === QUIZ.id ? QUESTIONS : []
}

export function mockGetAttempt(userId: string, quizId: string): Attempt | null {
  const attempts = load<Attempt>(KEYS.attempts)
  return attempts.find(a => a.user_id === userId && a.quiz_id === quizId) ?? null
}

export function mockCreateAttempt(userId: string, quizId: string): Attempt {
  const attempts = load<Attempt>(KEYS.attempts)
  const existing = attempts.find(a => a.user_id === userId && a.quiz_id === quizId)
  if (existing) return existing

  const attempt: Attempt = {
    id: uid(),
    user_id: userId,
    quiz_id: quizId,
    score: null,
    total_points: QUIZ.total_points,
    status: 'in_progress',
    started_at: new Date().toISOString(),
    submitted_at: null,
  }
  attempts.push(attempt)
  save(KEYS.attempts, attempts)
  return attempt
}

export function mockSaveAnswer(
  attemptId: string,
  questionId: string,
  response: QuestionResponse,
): Answer {
  const answers = load<Answer>(KEYS.answers)
  const idx = answers.findIndex(a => a.attempt_id === attemptId && a.question_id === questionId)

  const question = QUESTIONS.find(q => q.id === questionId)
  const isCorrect = question ? gradeQuestion(question, response) : false

  const answer: Answer = {
    id: idx >= 0 ? answers[idx].id : uid(),
    attempt_id: attemptId,
    question_id: questionId,
    response,
    is_correct: isCorrect,
    points_earned: isCorrect && question ? question.points : 0,
  }

  if (idx >= 0) answers[idx] = answer
  else answers.push(answer)
  save(KEYS.answers, answers)
  return answer
}

export function mockSubmitAttempt(attemptId: string): Attempt {
  const attempts = load<Attempt>(KEYS.attempts)
  const answers = load<Answer>(KEYS.answers)
  const attempt = attempts.find(a => a.id === attemptId)
  if (!attempt) throw new Error('Attempt not found')

  const attemptAnswers = answers.filter(a => a.attempt_id === attemptId)
  const score = attemptAnswers.reduce((sum, a) => sum + a.points_earned, 0)

  attempt.score = score
  attempt.status = 'submitted'
  attempt.submitted_at = new Date().toISOString()
  save(KEYS.attempts, attempts)
  return attempt
}

export function mockGetAnswers(attemptId: string): Answer[] {
  return load<Answer>(KEYS.answers).filter(a => a.attempt_id === attemptId)
}

/* -- Admin API ----------------------------------------------- */

export function mockGetAllAttempts(): (Attempt & { user_name: string; user_department: string; quiz_title: string })[] {
  const attempts = load<Attempt>(KEYS.attempts)
  const users = load<User>(KEYS.users)
  return attempts
    .filter(a => a.status === 'submitted')
    .map(a => {
      const user = users.find(u => u.id === a.user_id)
      return {
        ...a,
        user_name: user?.name ?? '未知',
        user_department: user?.department ?? '未知',
        quiz_title: QUIZ.title,
      }
    })
}

export function mockGetStats() {
  const attempts = load<Attempt>(KEYS.attempts).filter(a => a.status === 'submitted')
  const users = load<User>(KEYS.users)
  const totalParticipants = attempts.length
  const avgScore = totalParticipants > 0
    ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / totalParticipants)
    : 0
  const passCount = attempts.filter(a => (a.score ?? 0) >= QUIZ.pass_score).length
  const passRate = totalParticipants > 0
    ? Math.round((passCount / totalParticipants) * 100)
    : 0

  /* -- 按部门统计 -- */
  const deptMap = new Map<string, { total: number; sum: number }>()
  for (const attempt of attempts) {
    const user = users.find(u => u.id === attempt.user_id)
    const dept = user?.department ?? '未知'
    const entry = deptMap.get(dept) ?? { total: 0, sum: 0 }
    entry.total++
    entry.sum += attempt.score ?? 0
    deptMap.set(dept, entry)
  }
  const byDepartment = Array.from(deptMap.entries()).map(([dept, { total, sum }]) => ({
    department: dept,
    count: total,
    avgScore: Math.round(sum / total),
  }))

  return { totalParticipants, avgScore, passRate, totalPoints: QUIZ.total_points, byDepartment }
}
