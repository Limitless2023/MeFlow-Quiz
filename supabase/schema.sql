-- ============================================================
-- MeFlow Training Quiz Platform -- Database Schema
-- 运行此脚本创建所有表和索引
-- ============================================================

-- 用户表: 简单登录, 不用 Supabase Auth
CREATE TABLE IF NOT EXISTS users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, department)
);

-- 培训场次
CREATE TABLE IF NOT EXISTS trainings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  date        DATE,
  cover_image TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 试卷: 一个培训可以有多套试卷
CREATE TABLE IF NOT EXISTS quizzes (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id  UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  time_limit   INT,
  pass_score   INT DEFAULT 60,
  total_points INT DEFAULT 100,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 题目: 多态单表, JSONB 存选项
CREATE TABLE IF NOT EXISTS questions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id      UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN (
                 'single_choice', 'multiple_choice', 'true_false',
                 'fill_blank', 'ordering'
               )),
  content      TEXT NOT NULL,
  options      JSONB NOT NULL DEFAULT '[]',
  explanation  TEXT,
  points       INT DEFAULT 5,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 答题记录
CREATE TABLE IF NOT EXISTS attempts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id      UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score        INT,
  total_points INT,
  status       TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted')),
  started_at   TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  UNIQUE(user_id, quiz_id)
);

-- 答案
CREATE TABLE IF NOT EXISTS answers (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id   UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  response     JSONB NOT NULL DEFAULT '{}',
  is_correct   BOOLEAN,
  points_earned INT DEFAULT 0,
  UNIQUE(attempt_id, question_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz ON attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers(attempt_id);
