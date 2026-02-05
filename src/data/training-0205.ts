/* ============================================================
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 trainingData -- 第一套培训的 20 道题目
 * [POS]: data/ 的种子数据，被 mock-data.ts 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================ */

import type { QuestionType, QuestionOption } from '@/types/quiz'

interface QuestionSeed {
  id: string
  type: QuestionType
  content: string
  options: QuestionOption[]
  explanation: string | null
  points: number
}

export const trainingData = {
  training: {
    title: 'MeFlow Agent 专题培训',
    date: '2026-02-05',
    description: '覆盖 Chat 合同联动、Skill 机制、SubAgent、主动型 Agent 等 15 个核心知识模块',
  },
  questions: [
    /* --------------------------------------------------------
     * Q1: 三层架构 -- 排序题
     * -------------------------------------------------------- */
    {
      id: 'q-1',
      type: 'ordering' as QuestionType,
      content: '请将 MeFlow 三层架构的组件与其比喻正确匹配，按"脑子→流程→手脚"的顺序排列：',
      options: [
        { id: 'skill', text: 'Skill（专业知识）', correct_order: 1 },
        { id: 'command', text: 'Command（工作流程）', correct_order: 2 },
        { id: 'tool', text: 'Tool（外部工具）', correct_order: 3 },
      ],
      explanation: 'Skill = 脑子（专业知识），Command = SOP（工作流程），Tool = 手脚（API/MCP 外部工具）。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q2: Chat 合同双向联动 -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-2',
      type: 'single_choice' as QuestionType,
      content: '在 MeFlow 中，用户选中合同文本后，Agent 可以执行以下哪个操作？',
      options: [
        { id: 'a', text: '直接修改选中的条款内容', is_correct: true },
        { id: 'b', text: '仅能对选中内容做解释', is_correct: false },
        { id: 'c', text: '只能跳转到对应的审查报告', is_correct: false },
        { id: 'd', text: '自动删除选中内容', is_correct: false },
      ],
      explanation: 'Chat with Contract 功能支持双向联动：用户选中文本后，Agent 可通过 replacetest 工具直接替换和修改选中的条款内容。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q3: Word 文档读取增强 -- 多选
     * -------------------------------------------------------- */
    {
      id: 'q-3',
      type: 'multiple_choice' as QuestionType,
      content: 'Agent 现在可以从 Word 文档中读取哪些内容？（多选）',
      options: [
        { id: 'a', text: '合同正文', is_correct: true },
        { id: 'b', text: '批注（Comments）', is_correct: true },
        { id: 'c', text: '修订记录（Track Changes）', is_correct: true },
        { id: 'd', text: '文档中的图片内容', is_correct: false },
      ],
      explanation: 'get_file_content 增强后可以提取合同正文、批注和修订记录三类数据，暂不支持图片内容识别。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q4: 文档直接下载 -- 判断
     * -------------------------------------------------------- */
    {
      id: 'q-4',
      type: 'true_false' as QuestionType,
      content: 'Agent 生成的合同文档现在可以直接下载，无需先创建系统任务。',
      options: [
        { id: 'true', text: '正确', is_correct: true },
        { id: 'false', text: '错误', is_correct: false },
      ],
      explanation: '这是新增功能：Agent 可以直接生成文档并提供下载按钮，不再需要通过"生成→创建系统任务→下载"的旧流程。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q5: 人工反馈机制 -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-5',
      type: 'single_choice' as QuestionType,
      content: 'MeFlow 中人工反馈（点赞/点踩）的数据主要用于什么目的？',
      options: [
        { id: 'a', text: '内部数据收集，用于优化和调整 Agent 表现', is_correct: true },
        { id: 'b', text: '直接修改 Agent 的回答内容', is_correct: false },
        { id: 'c', text: '自动向客户管理员发送报告', is_correct: false },
        { id: 'd', text: '控制 Agent 的模型切换', is_correct: false },
      ],
      explanation: '人工反馈数据记录在后台管理系统中，主要用于内部数据收集和系统优化，未来可能扩展到客户管理员可见。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q6: AI 追踪卡片优化 -- 多选
     * -------------------------------------------------------- */
    {
      id: 'q-6',
      type: 'multiple_choice' as QuestionType,
      content: '新版 AI 智能追踪卡片的头部新增了哪些操作按钮？（多选）',
      options: [
        { id: 'a', text: '缩小（最小化到右下角）', is_correct: true },
        { id: 'b', text: '放大（展开完整视图）', is_correct: true },
        { id: 'c', text: '关闭（隐藏卡片）', is_correct: true },
        { id: 'd', text: '分享（发送给同事）', is_correct: false },
      ],
      explanation: '新版追踪卡片有三个按钮：缩小（折叠到右下角）、放大（完整展开）、关闭（隐藏，刷新页面后重新出现）。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q7: Agent 行为可视化 -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-7',
      type: 'single_choice' as QuestionType,
      content: '当页面左侧出现蓝色蒙层时，代表什么？',
      options: [
        { id: 'a', text: 'Agent 正在与系统交互（读取数据或操作按钮）', is_correct: true },
        { id: 'b', text: '系统正在加载中', is_correct: false },
        { id: 'c', text: 'Agent 正在生成回复文本', is_correct: false },
        { id: 'd', text: '网络连接出现问题', is_correct: false },
      ],
      explanation: '蓝色蒙层是 Agent 行为可视化指示器，仅在 Agent 与系统交互（读取合同数据、操作按钮等）时出现，纯对话不会触发。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q8: 多模型支持 -- 多选
     * -------------------------------------------------------- */
    {
      id: 'q-8',
      type: 'multiple_choice' as QuestionType,
      content: 'MeFlow 目前支持以下哪些 AI 模型？（多选）',
      options: [
        { id: 'a', text: 'DeepSeek', is_correct: true },
        { id: 'b', text: 'Kimi', is_correct: true },
        { id: 'c', text: 'Claude', is_correct: true },
        { id: 'd', text: 'GPT-4', is_correct: false },
      ],
      explanation: 'MeFlow 支持 DeepSeek、Kimi、Claude、MiniMax 等多个模型，暂不支持 GPT-4。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q9: 模型切换注意事项 -- 判断
     * -------------------------------------------------------- */
    {
      id: 'q-9',
      type: 'true_false' as QuestionType,
      content: '在同一个对话中可以随意切换不同的 AI 模型而不影响效果。',
      options: [
        { id: 'true', text: '正确', is_correct: false },
        { id: 'false', text: '错误', is_correct: true },
      ],
      explanation: '在同一对话中切换模型可能导致问题。最佳实践是一个对话使用一个模型，需要换模型时开启新对话。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q10: 履约计划智能生成 -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-10',
      type: 'single_choice' as QuestionType,
      content: '当合同中写"累计支付至6万"，Agent 如何理解这个金额？',
      options: [
        { id: 'a', text: '理解为累计金额，自动计算本期实际支付额', is_correct: true },
        { id: 'b', text: '直接将6万作为本期应付金额', is_correct: false },
        { id: 'c', text: '忽略此条款，跳过处理', is_correct: false },
        { id: 'd', text: '弹窗让用户手动输入金额', is_correct: false },
      ],
      explanation: 'Agent 能智能识别"累计支付至X万"的语义，理解为累计金额而非本期金额，自动用累计额减去前期已付额得出本期应付。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q11: 飞书集成 -- 填空
     * -------------------------------------------------------- */
    {
      id: 'q-11',
      type: 'fill_blank' as QuestionType,
      content: 'Agent 通过____将消息发送到飞书，实现任务分发。',
      options: [
        { id: 'answer', text: '集成平台', alternatives: ['集成平台', '应用集成平台', '集成'] },
      ],
      explanation: 'Agent 通过集成平台（Integration Platform）连接飞书等外部应用，实现消息发送和任务分发。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q12: Skill 机制本质 -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-12',
      type: 'single_choice' as QuestionType,
      content: 'Skill 机制的本质是什么？',
      options: [
        { id: 'a', text: '向 Agent 注入领域专业知识的机制', is_correct: true },
        { id: 'b', text: '升级版的思维链（COT）提示', is_correct: false },
        { id: 'c', text: '一种新的编程语言', is_correct: false },
        { id: 'd', text: '替代人工审查的自动化脚本', is_correct: false },
      ],
      explanation: 'Skill 不是简单的 COT 升级，而是一种更优雅的知识注入机制，将领域专业知识（SKILL.md + references）打包给 Agent。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q13: Skill 制作流程 -- 排序
     * -------------------------------------------------------- */
    {
      id: 'q-13',
      type: 'ordering' as QuestionType,
      content: '请按正确顺序排列 Skill 的制作步骤：',
      options: [
        { id: 'collect', text: '收集领域专家的专业知识和规则', correct_order: 1 },
        { id: 'write', text: '编写 SKILL.md（元数据+工作流）', correct_order: 2 },
        { id: 'ref', text: '整理 references 参考资料（规则库等）', correct_order: 3 },
        { id: 'test', text: '测试并迭代优化效果', correct_order: 4 },
        { id: 'deploy', text: '打包部署到系统中', correct_order: 5 },
      ],
      explanation: 'Skill 制作流程：先收集专家知识 → 编写 SKILL.md 定义 → 整理 references → 测试迭代 → 打包部署。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q14: SubAgent 机制 -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-14',
      type: 'single_choice' as QuestionType,
      content: 'SubAgent（子 Agent）的核心作用是什么？',
      options: [
        { id: 'a', text: '将复杂任务分解为并行子任务，各自独立上下文执行', is_correct: true },
        { id: 'b', text: '替代主 Agent 执行所有任务', is_correct: false },
        { id: 'c', text: '仅用于处理文档翻译任务', is_correct: false },
        { id: 'd', text: '用于备份主 Agent 的对话记录', is_correct: false },
      ],
      explanation: 'SubAgent 的核心价值是任务分解和并行执行：将复杂任务拆分为多个子任务，每个子 Agent 拥有独立上下文，聚焦处理，最后汇总结果。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q15: SubAgent 适用场景 -- 多选
     * -------------------------------------------------------- */
    {
      id: 'q-15',
      type: 'multiple_choice' as QuestionType,
      content: '以下哪些场景适合使用 SubAgent 机制？（多选）',
      options: [
        { id: 'a', text: '从法律、财务、商务多维度审查同一份合同', is_correct: true },
        { id: 'b', text: '修改合同中的一个错别字', is_correct: false },
        { id: 'c', text: '同时生成中英文两个版本的合同', is_correct: true },
        { id: 'd', text: '跨多份合同检查条款一致性', is_correct: true },
      ],
      explanation: '多维度审查、多语言版本生成、跨文件一致性检查都是典型的可并行分解场景，适合 SubAgent。修改错别字太简单，不需要分解。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q16: 主动型 Agent -- 单选
     * -------------------------------------------------------- */
    {
      id: 'q-16',
      type: 'single_choice' as QuestionType,
      content: '主动型 Agent 与普通对话型 Agent 的核心区别是什么？',
      options: [
        { id: 'a', text: '主动型 Agent 由预设条件自动触发，无需人工输入指令', is_correct: true },
        { id: 'b', text: '主动型 Agent 使用更高级的 AI 模型', is_correct: false },
        { id: 'c', text: '主动型 Agent 只能在后台运行', is_correct: false },
        { id: 'd', text: '主动型 Agent 不需要 Skill 支持', is_correct: false },
      ],
      explanation: '主动型 Agent 的核心区别是触发方式：由系统事件（合同创建、进入审批等预设条件）自动触发执行，而非等待用户手动输入指令。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q17: 六要素需求框架 -- 填空
     * -------------------------------------------------------- */
    {
      id: 'q-17',
      type: 'fill_blank' as QuestionType,
      content: '需求判断六要素包括：谁、什么时候、对什么、做什么、按什么标准、____',
      options: [
        { id: 'answer', text: '给谁', alternatives: ['给谁', '结果给谁', '输出给谁'] },
      ],
      explanation: '六要素需求框架：Who（谁）、When（什么时候）、To What（对什么）、Do What（做什么）、According to What（按什么标准）、To Whom（给谁）。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q18: 售前演示禁区 -- 多选
     * -------------------------------------------------------- */
    {
      id: 'q-18',
      type: 'multiple_choice' as QuestionType,
      content: '以下哪些说法在售前演示中应该避免？（多选）',
      options: [
        { id: 'a', text: '"Agent 可以做 MeFlow 里所有的事情"', is_correct: true },
        { id: 'b', text: '"记忆功能现在就可以用了"', is_correct: true },
        { id: 'c', text: '"让我们一起看看 Agent 在您的业务场景中能帮到什么"', is_correct: false },
        { id: 'd', text: '"Agent 的价值就是帮你点按钮"', is_correct: true },
      ],
      explanation: '不能过度承诺（"什么都能做"）、不能承诺未上线功能（记忆功能）、不能低估 Agent 价值（"只是点按钮"）。选项 C 是正确的演示表达。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q19: 闭环检验句式 -- 排序
     * -------------------------------------------------------- */
    {
      id: 'q-19',
      type: 'ordering' as QuestionType,
      content: '当接到客户需求时，请按正确顺序排列需求闭环检验的步骤：',
      options: [
        { id: 'who', text: '明确是谁提出的需求', correct_order: 1 },
        { id: 'when', text: '确认在什么阶段/时机触发', correct_order: 2 },
        { id: 'what', text: '确定对什么对象执行操作', correct_order: 3 },
        { id: 'how', text: '明确按什么标准/规则执行', correct_order: 4 },
        { id: 'whom', text: '确认结果输出给谁', correct_order: 5 },
      ],
      explanation: '需求闭环检验遵循六要素框架的顺序：Who → When → To What → Do What (+ According to What) → To Whom，确保每个环节都不遗漏。',
      points: 5,
    },

    /* --------------------------------------------------------
     * Q20: Skill vs 知识库 -- 判断
     * -------------------------------------------------------- */
    {
      id: 'q-20',
      type: 'true_false' as QuestionType,
      content: 'Skill 和传统知识库中的 Word 文档本质上是相同的，都是给 Agent 提供参考信息。',
      options: [
        { id: 'true', text: '正确', is_correct: false },
        { id: 'false', text: '错误', is_correct: true },
      ],
      explanation: 'Skill 不仅包含参考信息，还包含元数据（触发条件）、工作流程（执行步骤）和规则优先级等结构化知识，是比单纯文档更优雅的知识注入机制。',
      points: 5,
    },
  ] satisfies QuestionSeed[],
}
