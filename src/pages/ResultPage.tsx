/* ============================================================
 * [INPUT]: 依赖 @/lib/mock-data, @/components/quiz/*, @/contexts/AuthContext
 * [OUTPUT]: 对外提供 ResultPage 成绩页组件
 * [POS]: pages/ 的成绩展示页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  mockGetQuizById, mockGetQuestions, mockGetAttempt, mockGetAnswers,
} from '@/lib/mock-data'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ScoreCard } from '@/components/quiz/ScoreCard'
import { ReviewItem } from '@/components/quiz/ReviewItem'

export function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const quiz = useMemo(() => mockGetQuizById(id ?? ''), [id])
  const questions = useMemo(() => mockGetQuestions(id ?? ''), [id])
  const attempt = user ? mockGetAttempt(user.id, id ?? '') : null
  const answers = attempt ? mockGetAnswers(attempt.id) : []

  if (!quiz || !attempt || attempt.status !== 'submitted') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">未找到答题记录</p>
        <Link to="/" className="text-olive text-sm mt-4 inline-block hover:underline">返回首页</Link>
      </div>
    )
  }

  const answerMap = new Map(answers.map(a => [a.question_id, a]))
  const correctCount = answers.filter(a => a.is_correct).length
  const wrongCount = answers.filter(a => a.is_correct === false).length
  const unanswered = questions.length - answers.length

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      {/* -- 得分卡片 -- */}
      <Card padding="lg" className="mb-8">
        <ScoreCard
          score={attempt.score ?? 0}
          total={quiz.total_points}
          passScore={quiz.pass_score}
          correctCount={correctCount}
          wrongCount={wrongCount}
          unanswered={unanswered}
        />
      </Card>

      {/* -- 逐题回顾 -- */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-gray-800">答题回顾</h2>
        <Link to="/">
          <Button variant="outline" className="text-xs !px-3 !py-1.5">返回首页</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => {
          const answer = answerMap.get(q.id)
          return (
            <ReviewItem
              key={q.id}
              question={q}
              index={i}
              response={answer?.response ?? null}
              isCorrect={answer?.is_correct ?? null}
            />
          )
        })}
      </div>
    </div>
  )
}
