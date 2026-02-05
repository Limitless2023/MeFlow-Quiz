/* ============================================================
 * [INPUT]: 依赖 @/lib/mock-data, @/components/ui/*, react-router-dom
 * [OUTPUT]: 对外提供 TrainingListPage 培训列表首页
 * [POS]: pages/ 的首页，展示所有可用培训
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import { useNavigate } from 'react-router-dom'
import { mockGetTrainings, mockGetQuiz, mockGetAttempt } from '@/lib/mock-data'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function TrainingListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const trainings = mockGetTrainings()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* -- 页头 -- */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-gray-800">
          培训<span className="italic text-olive">测验</span>
        </h1>
        <p className="text-gray-500 mt-2">
          选择一场培训，检验你的学习成果
        </p>
      </div>

      {/* -- 培训卡片网格 -- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map(t => {
          const quiz = mockGetQuiz(t.id)
          const attempt = user ? mockGetAttempt(user.id, quiz?.id ?? '') : null
          const submitted = attempt?.status === 'submitted'

          return (
            <Card key={t.id} hover padding="none">
              {/* -- 封面区 -- */}
              <div className="h-36 bg-gradient-to-br from-olive-bg to-olive-light rounded-t-xl flex items-center justify-center">
                <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5c6b50" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H19a1 1 0 011 1v18a1 1 0 01-1 1H6.5a1 1 0 010-5H20" />
                    <path d="M8 7h6M8 11h8" />
                  </svg>
                </div>
              </div>

              {/* -- 内容区 -- */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-base">{t.title}</h3>
                  {submitted ? (
                    <Badge variant="success">已完成</Badge>
                  ) : (
                    <Badge>进行中</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{t.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t.date}</span>
                  {submitted ? (
                    <Button
                      variant="outline"
                      className="text-xs !px-3 !py-1.5"
                      onClick={() => navigate(`/quiz/${quiz?.id}/result`)}
                    >
                      查看成绩
                    </Button>
                  ) : (
                    <Button
                      className="text-xs !px-3 !py-1.5"
                      onClick={() => navigate(`/quiz/${quiz?.id}`)}
                    >
                      开始答题
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
