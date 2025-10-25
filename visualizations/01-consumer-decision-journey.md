# Consumer Decision Journey Flowcharts

## 1. Complete Consumer Decision Process

```mermaid
flowchart TD
    A[需求识别阶段] --> B[初步搜索阶段]
    B --> C[深入评估阶段]
    C --> D[决策确认阶段]
    D --> E[术后适应阶段]

    A --> A1[触发事件<br>• 社交媒体影响<br>• 朋友推荐<br>• 负面评价<br>• 年龄焦虑]
    A1 --> A2[需求意识<br>• 外貌不满<br>• 竞争压力<br>• 社会期望]
    A2 --> A3[动机形成<br>• 内在动机<br>• 外在动机<br>• 混合动机]

    B --> B1[信息渠道选择<br>• 互联网搜索<br>• 社交媒体<br>• 朋友咨询<br>• 专业咨询]
    B1 --> B2[初步筛选<br>• 机构资质<br>• 价格比较<br>• 效果案例<br>• 风险认知]
    B2 --> B3[信息过载<br>• 困惑焦虑<br>• 质量识别困难<br>• 偏见形成]

    C --> C1[专业咨询<br>• 医生面诊<br>• 方案设计<br>• 风险评估<br>• 期望管理]
    C1 --> C2[深度分析<br>• 成本效益<br>• 风险承受<br>• 动机确认<br>• 支持系统]
    C2 --> C3[决策准备<br>• 心理准备<br>• 经济准备<br>• 时间安排<br>• 家人支持]

    D --> D1[最终确认<br>• 方案确定<br>• 机构选择<br>• 医生选择<br>• 时间确定]
    D1 --> D2[合同签署<br>• 知情同意<br>• 费用支付<br>• 风险确认]
    D2 --> D3[术前准备<br>• 身体检查<br>• 心理调适<br>• 生活安排<br>• 期望调整]

    E --> E1[恢复过程<br>• 生理恢复<br>• 心理适应<br>• 效果评估<br>• 问题处理]
    E1 --> E2[满意度形成<br>• 技术效果<br>• 服务体验<br>• 心理感受<br>• 社会认同]
    E2 --> E3[长期跟踪<br>• 效果持久性<br>• 心理健康<br>• 后续决策<br>• 经验分享]
```

## 2. Information Search Behavior Patterns

```mermaid
flowchart LR
    Start[信息搜索开始] --> Channel{选择信息渠道}

    Channel --> Internet[互联网渠道<br>90%消费者使用]
    Channel --> Social[人际渠道<br>70%消费者使用]
    Channel --> Professional[专业渠道<br>40%消费者使用]
    Channel --> Media[媒体渠道<br>30%消费者使用]

    Internet --> I_Quality[质量评估<br>• 权威性检查<br>• 利益冲突披露<br>• 更新性验证<br>• 科学依据评估]
    I_Quality --> I_Challenge[挑战<br>• 信息过载<br>• 确认偏见<br>• 质量识别困难]

    Social --> S_Quality[质量评估<br>• 可信度高<br>• 个性化强<br>• 情感支持<br>• 经验分享]
    S_Quality --> S_Challenge[挑战<br>• 样本偏差<br>• 个体差异<br>• 情感影响]

    Professional --> P_Quality[质量评估<br>• 专业权威<br>• 个性化建议<br>• 风险评估<br>• 期望管理]
    P_Quality --> P_Challenge[挑战<br>• 成本较高<br>• 时间成本<br>• 可及性差]

    Media --> M_Quality[质量评估<br>• 规范性强<br>• 覆盖面广<br>• 中立性好<br>• 深度报道]
    M_Quality --> M_Challenge[挑战<br>• 更新缓慢<br>• 互动性差<br>• 针对性弱]

    I_Challenge --> Integration[信息整合与评估]
    S_Challenge --> Integration
    P_Challenge --> Integration
    M_Challenge --> Integration

    Integration --> Decision{决策状态}
    Decision -->|"信息充分<br>信心充足"| Confirm[决策确认]
    Decision -->|"信息不足<br>信心不够"| Continue[继续搜索]
    Continue --> Channel
```

## 3. Risk Assessment Workflow

```mermaid
flowchart TD
    Start[风险评估开始] --> Identify{风险识别}

    Identify --> Physical[生理风险<br>• 手术并发症<br>• 感染风险<br>• 疤痕形成<br>• 效果不佳]
    Identify --> Psychological[心理风险<br>• 术后后悔<br>• 焦虑抑郁<br>• 自我认同问题<br>• 期望落差]
    Identify --> Financial[财务风险<br>• 超出预算<br>• 后续费用<br>• 修复成本<br>• 机会成本]
    Identify --> Social[社会风险<br>• 他人评价<br>• 社会认同<br>• 关系变化<br>• 职业影响]

    Physical --> P_Assess[风险评估矩阵]
    Psychological --> Psy_Assess[风险评估矩阵]
    Financial --> F_Assess[风险评估矩阵]
    Social --> S_Assess[风险评估矩阵]

    P_Assess --> Matrix[综合风险矩阵]
    Psy_Assess --> Matrix
    F_Assess --> Matrix
    S_Assess --> Matrix

    Matrix --> Evaluate{风险承受能力评估}

    Evaluate --> Low[低风险承受<br>• 保守策略<br>• 延迟决策<br>• 寻求支持]
    Evaluate --> Medium[中等风险承受<br>• 平衡策略<br>• 准备工作<br>• 应急预案]
    Evaluate --> High[高风险承受<br>• 积极策略<br>• 快速决策<br>• 风险接受]

    Low --> Manage[风险管理策略]
    Medium --> Manage
    High --> Manage

    Manage --> Monitor[风险监控与调整]
    Monitor --> Decision[最终决策]
```

## 4. Decision Bias Correction Process

```mermaid
flowchart TD
    Start[决策开始] --> BiasCheck{偏差检查}

    BiasCheck --> Confirmation[确认偏见检查<br>• 只关注支持信息<br>• 忽视反对意见<br>• 选择性记忆]
    BiasCheck --> Anchoring[锚定效应检查<br>• 过度依赖初印象<br>• 调整不充分<br>• 参考点单一]
    BiasCheck --> Herding[从众心理检查<br>• 受他人影响<br>• 社会压力<br>• 趋同决策]
    BiasCheck --> SunkCost[沉没成本检查<br>• 已投入影响<br>• 难以放弃<br>• 机会成本忽视]
    BiasCheck --> Optimism[乐观偏见检查<br>• 低估风险<br>• 高估收益<br>• 特殊性错觉]

    Confirmation --> ConfirmCorrect[纠正策略<br>• 多角度信息<br>• 批判性思维<br>• 开放心态]
    Anchoring --> AnchorCorrect[纠正策略<br>• 多参考点<br>• 延迟判断<br>• 系统评估]
    Herding --> HerdCorrect[纠正策略<br>• 独立思考<br>• 价值澄清<br>• 内在动机]
    SunkCost --> SunkCorrect[纠正策略<br>• 前瞻思维<br>• 机会成本<br>• 止损设定]
    Optimism --> OptCorrect[纠正策略<br>• 统计数据<br>• 最坏预案<br>• 专业评估]

    ConfirmCorrect --> Reassess[重新评估]
    AnchorCorrect --> Reassess
    HerdCorrect --> Reassess
    SunkCorrect --> Reassess
    OptCorrect --> Reassess

    Reassess --> QualityCheck{决策质量评估}
    QualityCheck -->|"质量高"| FinalDecision[最终决策]
    QualityCheck -->|"质量中等"| Refine[优化决策]
    QualityCheck -->|"质量低"| Delay[延迟决策]

    Refine --> Tools[使用决策工具<br>• 决策清单<br>• 决策矩阵<br>• 权衡分析]
    Delay --> Support[寻求支持<br>• 专业咨询<br>• 家人意见<br>• 冷静期]

    Tools --> FinalDecision
    Support --> FinalDecision
```