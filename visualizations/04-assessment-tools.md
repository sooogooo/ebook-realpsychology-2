# Assessment Tools Process Diagrams & Tracking Charts

## 1. Medical Aesthetics Decision Assessment Process

```mermaid
graph TD
    Start[决策评估开始] --> BasicInfo[基本信息评估<br>Basic Information]

    BasicInfo --> Demographics[人口统计学信息<br>• 年龄<br>• 性别<br>• 职业<br>• 教育程度<br>• 收入水平]
    BasicInfo --> ProjectInfo[项目信息<br>• 考虑的项目类型<br>• 预期费用<br>• 计划时间<br>• 风险认知]

    Demographics --> Motivation[动机分析<br>Motivation Analysis]
    ProjectInfo --> Motivation

    Motivation --> InternalCheck[内在动机检查<br>• 为自己做决定<br>• 充分考虑风险<br>• 有经济能力<br>• 非一时冲动<br>• 尝试过非手术方法]

    InternalCheck --> ExternalCheck[外在动机检查<br>• 家庭支持<br>• 朋友影响<br>• 社会压力<br>• 职业需求<br>• 媒体影响]

    ExternalCheck --> RiskAssessment[风险评估<br>Risk Assessment]

    RiskAssessment --> PhysiologicalRisk[生理风险评估<br>1-5分<br>• 感染风险<br>• 疤痕风险<br>• 效果不佳风险]
    RiskAssessment --> PsychologicalRisk[心理风险评估<br>1-5分<br>• 后悔风险<br>• 焦虑风险<br>• 自我认同风险]
    RiskAssessment --> SocialRisk[社会风险评估<br>1-5分<br>• 他人评价<br>• 社会压力<br>• 关系变化]
    RiskAssessment --> FinancialRisk[财务风险评估<br>1-5分<br>• 超出预算<br>• 后续费用<br>• 机会成本]

    PhysiologicalRisk --> RiskScore[风险评分计算]
    PsychologicalRisk --> RiskScore
    SocialRisk --> RiskScore
    FinancialRisk --> RiskScore

    RiskScore --> ExpectationManagement[期望管理<br>Expectation Management]

    ExpectationManagement --> EffectExpectation[效果期望评估<br>• 期望描述<br>• 现实性判断<br>• 合理性评估]
    ExpectationManagement --> RecoveryExpectation[恢复期期望<br>• 时间预期<br>• 过程理解<br>• 准备程度]
    ExpectationManagement --> CostExpectation[费用期望<br>• 总费用预估<br>• 隐藏费用<br>• 价值认知]

    EffectExpectation --> DecisionPreparation[决策准备度评估]
    RecoveryExpectation --> DecisionPreparation
    CostExpectation --> DecisionPreparation

    DecisionPreparation --> InfoCollection[信息收集准备]
    DecisionPreparation --> InstitutionSelection[机构选择准备]
    DecisionPreparation --> DoctorCommunication[医生沟通准备]
    DecisionPreparation --> RiskUnderstanding[风险了解准备]
    DecisionPreparation --> PsychologicalPreparation[心理准备准备]

    InfoCollection --> SupportSystem[支持系统评估]
    InstitutionSelection --> SupportSystem
    DoctorCommunication --> SupportSystem
    RiskUnderstanding --> SupportSystem
    PsychologicalPreparation --> SupportSystem

    SupportSystem --> FamilySupport[家人支持评估<br>非常支持-强烈反对]
    SupportSystem --> FriendSupport[朋友支持评估<br>非常支持-强烈反对]
    SupportSystem --> ProfessionalSupport[专业支持评估<br>有专业顾问-无支持]

    FamilySupport --> FinalEvaluation[综合评估与建议]
    FriendSupport --> FinalEvaluation
    ProfessionalSupport --> FinalEvaluation

    FinalEvaluation --> Scoring[评分系统应用]
    Scoring --> MotivationScore[动机评分<br>20分以上为健康]
    Scoring --> RiskScoreLevel[风险评分<br>4分以上需重新考虑]
    Scoring --> ExpectationScore[期望评分<br>必须全部合理]
    Scoring --> PreparationScore[准备评分<br>4项以上完成]
    Scoring --> SupportScore[支持评分<br>至少一项支持]

    MotivationScore --> Recommendation[决策建议]
    RiskScoreLevel --> Recommendation
    ExpectationScore --> Recommendation
    PreparationScore --> Recommendation
    SupportScore --> Recommendation

    Recommendation --> GoDecision[可以进行决策]
    Recommendation --> DelayDecision[建议延迟决策]
    Recommendation --> SeekHelp[建议寻求专业帮助]

    classDef processStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef assessmentStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef riskStyle fill:#FFF3E0,stroke:#FF9800,color:#E65100
    classDef decisionStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A

    class Start,BasicInfo,Motivation,RiskAssessment,ExpectationManagement,DecisionPreparation,SupportSystem,FinalEvaluation,Recommendation processStyle
    class Demographics,ProjectInfo,InternalCheck,ExternalCheck,EffectExpectation,RecoveryExpectation,CostExpectation,InfoCollection,InstitutionSelection,DoctorCommunication,RiskUnderstanding,PsychologicalPreparation,FamilySupport,FriendSupport,ProfessionalSupport assessmentStyle
    class PhysiologicalRisk,PsychologicalRisk,SocialRisk,FinancialRisk,RiskScore riskStyle
    class GoDecision,DelayDecision,SeekHelp decisionStyle
```

## 2. Information Quality Assessment Framework

```mermaid
graph TB
    subgraph "信息质量评估模型"

        SourceQuality[来源质量评估<br>Source Quality Assessment<br><br>权威性 1-5分<br>利益冲突披露 1-5分<br>信息更新性 1-5分]

        ContentQuality[内容质量评估<br>Content Quality Assessment<br><br>完整性 1-5分<br>科学依据 1-5分<br>风险披露 1-5分]

        PresentationQuality[呈现质量评估<br>Presentation Quality Assessment<br><br>语言准确性 1-5分<br>客观性 1-5分<br>视觉真实性 1-5分]

    end

    subgraph "评估维度细化"

        AuthorityCheck[权威性检查<br><br>• 发布者专业资质<br>• 正规机构认证<br>• 专家背景验证<br>• 专业协会成员]

        ConflictCheck[利益冲突检查<br><br>• 商业利益披露<br>• 赞助关系透明<br>• 竞争关系说明<br>• 财务利益公开]

        UpdateCheck[更新性检查<br><br>• 发布时间<br>• 最新版本<br>• 技术发展跟进<br>• 信息时效性]

        CompletenessCheck[完整性检查<br><br>• 效果信息<br>• 风险信息<br>• 费用信息<br>• 全面性评估]

        ScientificCheck[科学性检查<br><br>• 研究支持<br>• 数据依据<br>• 事实观点区分<br>• 科学方法论]

        RiskDisclosureCheck[风险披露检查<br><br>• 潜在风险<br>• 并发症概率<br>• 后果严重性<br>• 风险客观性]

    end

    subgraph "警示信号"

        RedFlags[高风险警示信号<br><br>□ 信息来源不明<br>□ 商业推广明显<br>□ 效果过度宣传<br>□ 风险淡化处理<br>□ 绝对化表述<br>□ 缺乏科学依据<br>□ 图片过度修饰]

        YellowFlags[中等风险警示信号<br><br>□ 权威性不足<br>□ 更新不及时<br>□ 信息不完整<br>□ 科学性欠缺<br>□ 客观性不足<br>• 利益冲突未披露]

    end

    subgraph "质量等级"

        Excellent[优秀 36-45分<br>• 信息质量很高<br>• 可充分信任<br>• 安全可靠]

        Good[良好 27-35分<br>• 信息质量较好<br>• 可参考使用<br>• 相对可靠]

        Average[一般 18-26分<br>• 信息质量一般<br>• 需谨慎对待<br>• 需要验证]

        Poor[较差 9-17分<br>• 信息质量较差<br>• 不建议采用<br>• 存在风险]

    end

    SourceQuality --> AuthorityCheck
    SourceQuality --> ConflictCheck
    SourceQuality --> UpdateCheck

    ContentQuality --> CompletenessCheck
    ContentQuality --> ScientificCheck
    ContentQuality --> RiskDisclosureCheck

    AuthorityCheck --> RedFlags
    ConflictCheck --> RedFlags
    UpdateCheck --> YellowFlags
    CompletenessCheck --> YellowFlags
    ScientificCheck --> RedFlags

    RedFlags --> Poor
    YellowFlags --> Average

    SourceQuality --> Excellent
    ContentQuality --> Excellent
    PresentationQuality --> Good

    Excellent --> Recommendation[推荐使用]
    Good --> Recommendation_Cautious[谨慎使用]
    Average --> Recommendation_Verify[需要验证]
    Poor --> Recommendation_Avoid[避免使用]

    classDef qualityStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32,stroke-width:2px
    classDef checkStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef warningStyle fill:#FFF3E0,stroke:#FF9800,color:#E65100
    classDef gradeStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A

    class SourceQuality,ContentQuality,PresentationQuality qualityStyle
    class AuthorityCheck,ConflictCheck,UpdateCheck,CompletenessCheck,ScientificCheck,RiskDisclosureCheck checkStyle
    class RedFlags,YellowFlags warningStyle
    class Excellent,Good,Average,Poor gradeStyle
```

## 3. Post-Operation Satisfaction Tracking Timeline

```mermaid
gantt
    title 术后满意度追踪时间线
    dateFormat  YYYY-MM-DD
    axisFormat  %m月%d日

    section 技术效果满意度
    整体改善效果      :active, tech1, 2024-01-01, 180d
    期望匹配度        :active, tech2, 2024-01-01, 180d
    效果自然度        :active, tech3, 2024-01-15, 165d
    效果持久性        :active, tech4, 2024-03-01, 120d

    section 服务体验满意度
    术前咨询服务      :crit, service1, 2023-12-15, 15d
    医生专业水平      :crit, service2, 2024-01-01, 30d
    护理服务质量      :active, service3, 2024-01-01, 60d
    术后跟踪服务      :active, service4, 2024-01-01, 180d

    section 心理感受满意度
    自信心提升程度     :active, psych1, 2024-01-01, 180d
    焦虑减轻程度       :active, psych2, 2024-01-01, 90d
    自我认同改善       :active, psych3, 2024-01-15, 165d
    整体幸福感         :active, psych4, 2024-01-01, 180d

    section 社会认同满意度
    他人积极评价       :active, social1, 2024-01-01, 180d
    社交活动改善       :active, social2, 2024-01-01, 180d
    职业形象提升       :active, social3, 2024-01-01, 180d
    整体社会适应       :active, social4, 2024-01-01, 180d

    section 评估时间点
    术后即时评估(1-7天)  :milestone, m1, 2024-01-07, 0d
    术后短期评估(2-4周) :milestone, m2, 2024-01-28, 0d
    术后中期评估(2-3月):milestone, m3, 2024-03-28, 0d
    术后长期评估(6月+) :milestone, m4, 2024-06-28, 0d
```

## 4. Multi-Dimensional Assessment Radar System

```mermaid
graph TB
    subgraph "多维度评估雷达系统"

        Center[评估中心]

        Dimensions["六个评估维度"]
    end

    subgraph "技术效果维度"
        TechOverall[整体改善效果<br>1-5分]
        TechMatch[与期望匹配度<br>1-5分]
        TechNatural[效果自然度<br>1-5分]
        TechDurable[效果持久性<br>1-5分]
    end

    subgraph "服务体验维度"
        ServiceConsult[术前咨询服务<br>1-5分]
        ServiceDoctor[医生专业水平<br>1-5分]
        ServiceNurse[护理服务质量<br>1-5分]
        ServiceFollow[术后跟踪服务<br>1-5分]
    end

    subgraph "心理感受维度"
        PsychConfidence[自信心提升<br>1-5分]
        PsychAnxiety[焦虑减轻程度<br>1-5分]
        PsychIdentity[自我认同改善<br>1-5分]
        PsychHappiness[整体幸福感<br>1-5分]
    end

    subgraph "社会认同维度"
        SocialPraise[他人积极评价<br>1-5分]
        SocialActivity[社交活动改善<br>1-5分]
        SocialCareer[职业形象提升<br>1-5分]
        SocialAdapt[整体社会适应<br>1-5分]
    end

    subgraph "问题记录维度"
        PhysProblem[生理问题记录]
        PsychProblem[心理问题记录]
        SocialProblem[社会问题记录]
        ProblemSolve[问题解决情况]
    end

    subgraph "经验总结维度"
        ConsumerAdvice[对未来消费者建议]
        ProviderAdvice[对服务提供者建议]
        DecisionReflection[个人决策反思]
        ExperienceSummary[经验教训总结]
    end

    Center --> TechOverall
    Center --> ServiceConsult
    Center --> PsychConfidence
    Center --> SocialPraise
    Center --> PhysProblem
    Center --> ConsumerAdvice

    TechOverall --> TechMatch
    TechMatch --> TechNatural
    TechNatural --> TechDurable

    ServiceConsult --> ServiceDoctor
    ServiceDoctor --> ServiceNurse
    ServiceNurse --> ServiceFollow

    PsychConfidence --> PsychAnxiety
    PsychAnxiety --> PsychIdentity
    PsychIdentity --> PsychHappiness

    SocialPraise --> SocialActivity
    SocialActivity --> SocialCareer
    SocialCareer --> SocialAdapt

    PhysProblem --> PsychProblem
    PsychProblem --> SocialProblem
    SocialProblem --> ProblemSolve

    ConsumerAdvice --> ProviderAdvice
    ProviderAdvice --> DecisionReflection
    DecisionReflection --> ExperienceSummary

    TechDurable --> Scoring[综合评分系统]
    ServiceFollow --> Scoring
    PsychHappiness --> Scoring
    SocialAdapt --> Scoring
    ProblemSolve --> Scoring
    ExperienceSummary --> Scoring

    Scoring --> RadarChart["雷达图可视化"]
    Scoring --> TrendAnalysis["趋势分析"]
    Scoring --> Comparison["对比分析"]

    RadarChart --> VisualReport[视觉化报告]
    TrendAnalysis --> VisualReport
    Comparison --> VisualReport

    classDef dimensionStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef subDimensionStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef analysisStyle fill:#FFF8E1,stroke:#FFC107,color:#F57C00
    classDef reportStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A

    class Center,Dimensions dimensionStyle
    class TechOverall,TechMatch,TechNatural,TechDurable,ServiceConsult,ServiceDoctor,ServiceNurse,ServiceFollow,PsychConfidence,PsychAnxiety,PsychIdentity,PsychHappiness,SocialPraise,SocialActivity,SocialCareer,SocialAdapt,PhysProblem,PsychProblem,SocialProblem,ProblemSolve,ConsumerAdvice,ProviderAdvice,DecisionReflection,ExperienceSummary subDimensionStyle
    class Scoring,RadarChart,TrendAnalysis,Comparison analysisStyle
    class VisualReport reportStyle
```

## 5. Assessment Tool Integration Workflow

```mermaid
graph LR
    subgraph "评估工具集成流程"

        Entry[评估入口] --> ToolSelection[工具选择]

    end

    subgraph "评估工具库"

        Tool1[工具1: 决策评估表<br>• 动机分析<br>• 风险评估<br>• 期望管理<br>• 决策准备]
        Tool2[工具2: 机构评估表<br>• 资质评估<br>• 环境评估<br>• 服务评估<br>• 价格评估]
        Tool3[工具3: 信息质量表<br>• 来源质量<br>• 内容质量<br>• 呈现质量<br>• 警示信号]
        Tool4[工具4: 偏差检查表<br>• 确认偏见<br>• 锚定效应<br>• 从众心理<br>• 乐观偏见]
        Tool5[工具5: 满意度追踪<br>• 技术效果<br>• 服务体验<br>• 心理感受<br>• 社会认同]

    end

    subgraph "评估阶段"

        PreDecision[术前评估阶段]
        DecisionMaking[决策阶段]
        PostOperation[术后追踪阶段]

    end

    subgraph "数据处理"

        DataCollection[数据收集]
        DataAnalysis[数据分析]
        ReportGeneration[报告生成]
        DecisionSupport[决策支持]

    end

    subgraph "输出结果"

        PersonalReport[个人评估报告]
        Recommendation[决策建议]
        TrackingDashboard[追踪仪表板]
        TrendReport[趋势报告]

    end

    ToolSelection --> Tool1
    ToolSelection --> Tool2
    ToolSelection --> Tool3
    ToolSelection --> Tool4
    ToolSelection --> Tool5

    Tool1 --> PreDecision
    Tool2 --> PreDecision
    Tool3 --> PreDecision
    Tool4 --> DecisionMaking
    Tool5 --> PostOperation

    PreDecision --> DataCollection
    DecisionMaking --> DataCollection
    PostOperation --> DataCollection

    DataCollection --> DataAnalysis
    DataAnalysis --> ReportGeneration
    ReportGeneration --> DecisionSupport

    DecisionSupport --> PersonalReport
    DecisionSupport --> Recommendation
    DecisionSupport --> TrackingDashboard
    DecisionSupport --> TrendReport

    classDef toolStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef stageStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef dataStyle fill:#FFF8E1,stroke:#FFC107,color:#F57C00
    classDef outputStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A

    class Entry,ToolSelection toolStyle
    class Tool1,Tool2,Tool3,Tool4,Tool5 toolStyle
    class PreDecision,DecisionMaking,PostOperation stageStyle
    class DataCollection,DataAnalysis,ReportGeneration,DecisionSupport dataStyle
    class PersonalReport,Recommendation,TrackingDashboard,TrendReport outputStyle
```