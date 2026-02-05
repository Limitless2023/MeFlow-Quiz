/* ============================================================
 * [INPUT]: 依赖 @/lib/mock-data, @/components/quiz/*, @/contexts/AuthContext
 * [OUTPUT]: 对外提供 QuizPage 答题页组件
 * [POS]: pages/ 的核心答题页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  mockGetQuizById, mockGetQuestions, mockCreateAttempt,
  mockSaveAnswer, mockSubmitAttempt, mockGetAttempt,
} from '@/lib/mock-data'
import type { QuestionResponse } from '@/types/quiz'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { QuestionNav } from '@/components/quiz/QuestionNav'
import { QuestionPalette } from '@/components/quiz/QuestionPalette'

export function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const quiz = useMemo(() => mockGetQuizById(id ?? ''), [id])
  const questions = useMemo(() => mockGetQuestions(id ?? ''), [id])

  /* -- 已提交则跳转结果页 -- */
  const existingAttempt = user ? mockGetAttempt(user.id, id ?? '') : null
  if (existingAttempt?.status === 'submitted') {
    navigate(`/quiz/${id}/result`, { replace: true })
    return null
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">未找到试卷或题目</p>
      </div>
    )
  }

  return <QuizEngine quizId={quiz.id} questions={questions} userId={user!.id} />
}

/* -- 答题引擎: 分离为子组件避免 hooks 条件调用 --------------- */
function QuizEngine({ quizId, questions, userId }: {
  quizId: string
  questions: ReturnType<typeof mockGetQuestions>
  userId: string
}) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, QuestionResponse>>(new Map())
  const [showConfirm, setShowConfirm] = useState(false)

  /* -- 确保 attempt 存在 -- */
  const attempt = useMemo(() => mockCreateAttempt(userId, quizId), [userId, quizId])

  const currentQ = questions[currentIndex]
  const answeredSet = useMemo(() => new Set(answers.keys()), [answers])

  const handleAnswer = useCallback((response: QuestionResponse) => {
    setAnswers(prev => {
      const next = new Map(prev)
      next.set(currentQ.id, response)
      return next
    })
    mockSaveAnswer(attempt.id, currentQ.id, response)
  }, [currentQ.id, attempt.id])

  const handleSubmit = useCallback(() => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }
    mockSubmitAttempt(attempt.id)
    navigate(`/quiz/${quizId}/result`, { replace: true })
  }, [showConfirm, attempt.id, quizId, navigate])

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
      {/* -- 顶部进度 -- */}
      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">MeFlow Agent 培训测验</h2>
        <ProgressBar value={answeredSet.size} max={questions.length} />
      </div>

      {/* -- 主体: 题目 + 答题卡 -- */}
      <div className="flex gap-6">
        {/* -- 左侧: 题目区 -- */}
        <div className="flex-1 min-w-0">
          <QuestionCard
            question={currentQ}
            index={currentIndex}
            total={questions.length}
            response={answers.get(currentQ.id) ?? null}
            onChange={handleAnswer}
          />
          <QuestionNav
            current={currentIndex}
            total={questions.length}
            answered={answeredSet.has(currentQ.id)}
            onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
            onNext={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
            onSubmit={handleSubmit}
          />

          {/* -- 提交确认 -- */}
          {showConfirm && (
            <div className="mt-4 p-4 bg-olive-bg rounded-xl border border-olive/20 animate-slide-up">
              <p className="text-sm text-gray-700 mb-3">
                已答 <strong>{answeredSet.size}</strong>/{questions.length} 题。
                {answeredSet.size < questions.length && (
                  <span className="text-error"> 还有 {questions.length - answeredSet.size} 题未作答！</span>
                )}
                <br />确认提交吗？提交后不可修改。
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  继续答题
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-sm font-medium text-olive hover:text-olive-dark cursor-pointer"
                >
                  确认提交
                </button>
              </div>
            </div>
          )}
        </div>

        {/* -- 右侧: 答题卡 (桌面端) -- */}
        <div className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24">
            <QuestionPalette
              total={questions.length}
              current={currentIndex}
              answeredSet={answeredSet}
              questionIds={questions.map(q => q.id)}
              onJump={setCurrentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
