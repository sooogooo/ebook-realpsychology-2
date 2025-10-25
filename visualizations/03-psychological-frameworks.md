# Psychological Theory Framework Visualizations

## 1. Motivation Type Classification Framework

```mermaid
graph TD
    subgraph "动机类型 (Motivation Types)"
        Internal[内在动机<br>Intrinsic Motivation]
        External[外在动机<br>Extrinsic Motivation]
    end

    subgraph "内在动机子分类"
        Self_Improvement[自我提升动机<br>• 提升形象和自信<br>• 实现理想自我<br>• 个人成长发展<br>• 自我表达展示]
        Health_Consideration[健康考虑动机<br>• 改善生理功能<br>• 修复先天缺陷<br>• 减轻身体不适<br>• 预防健康问题]
        Functional_Improvement[功能改善动机<br>• 改善日常功能<br>• 提高工作效率<br>• 增强运动能力<br>• 方便日常护理]
    end

    subgraph "外在动机子分类"
        Social_Pressure[社会压力动机<br>• 家庭成员期望<br>• 朋友同事影响<br>• 社会审美压力<br>• 担心他人评判]
        Career_Needs[职业需求动机<br>• 职业形象要求<br>• 提升职场竞争力<br>• 符合行业标准<br>• 增加职业机会]
        Media_Influence[媒体影响动机<br>• 社交媒体影响<br>• 明星网红影响<br>• 广告宣传影响<br>• 流行趋势影响]
    end

    subgraph "动机特征分析"
        Internal_Features[内在动机特征<br>• 满意度更高<br>• 后悔率更低<br>• 决策更理性<br>• 效果更持久]
        External_Features[外在动机特征<br>• 容易受影响<br>• 期望值较高<br>• 满意度波动<br>• 可能冲动决策]
    end

    subgraph "动态变化过程"
        Initial[初始动机]
        Evolution[动机演变]
        Integration[动机整合]
    end

    Internal --> Self_Improvement
    Internal --> Health_Consideration
    Internal --> Functional_Improvement

    External --> Social_Pressure
    External --> Career_Needs
    External --> Media_Influence

    Self_Improvement --> Internal_Features
    Health_Consideration --> Internal_Features
    Functional_Improvement --> Internal_Features

    Social_Pressure --> External_Features
    Career_Needs --> External_Features
    Media_Influence --> External_Features

    Initial --> Evolution
    External_Features --> Evolution
    Internal_Features --> Evolution
    Evolution --> Integration
    Integration --> Final[整合动机<br>Integrated Motivation]

    classDef internalStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef externalStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef featureStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A
    classDef processStyle fill:#FFF8E1,stroke:#FFC107,color:#F57C00

    class Internal,Self_Improvement,Health_Consideration,Functional_Improvement internalStyle
    class External,Social_Pressure,Career_Needs,Media_Influence externalStyle
    class Internal_Features,External_Features featureStyle
    class Initial,Evolution,Integration,Final processStyle
```

## 2. Body Image Disorder Framework

```mermaid
graph LR
    subgraph "身体意象问题类型"
        Perceptual[感知扭曲型<br>Perceptual Distortion]
        Cognitive[认知扭曲型<br>Cognitive Distortion]
        Emotional[情感困扰型<br>Emotional Disturbance]
        Behavioral[行为失调型<br>Behavioral Dysfunction]
    end

    subgraph "表现特征"
        Perceptual_Symptoms[感知扭曲症状<br>• 对外貌过度关注<br>• 夸大感知缺陷<br>• 镜子强迫检查<br>• 与现实不符]
        Cognitive_Symptoms[认知扭曲症状<br>• 非黑即白思维<br>• 过度概括化<br>• 灾难化思维<br>• 选择性注意]
        Emotional_Symptoms[情感困扰症状<br>• 强烈焦虑情绪<br>• 抑郁情绪<br>• 自尊心低落<br>• 羞耻感强烈]
        Behavioral_Symptoms[行为失调症状<br>• 回避社交活动<br>• 过度修饰行为<br>• 反复寻求确认<br>• 强迫性比较]
    end

    subgraph "形成机制"
        Biological[生物因素<br>• 遗传倾向<br>• 神经化学<br>• 激素水平]
        Psychological[心理因素<br>• 早期经历<br>• 人格特质<br>• 认知模式<br>• 情感调节]
        Social[社会因素<br>• 文化标准<br>• 媒体影响<br>• 社会比较<br>• 家庭环境]
    end

    subgraph "干预策略"
        Psychotherapy[心理治疗<br>• 认知行为治疗<br>• 身体意象治疗<br>• 接纳承诺治疗<br>• 心理动力学治疗]
        Education[教育干预<br>• 媒体素养教育<br>• 身体积极教育<br>• 批判性思维<br>• 多元美学观]
        Social_Support[社会支持<br>• 家庭支持<br>• 同伴支持<br>• 专业支持<br>• 社区支持]
    end

    Perceptual --> Perceptual_Symptoms
    Cognitive --> Cognitive_Symptoms
    Emotional --> Emotional_Symptoms
    Behavioral --> Behavioral_Symptoms

    Biological --> Perceptual
    Psychological --> Cognitive
    Psychological --> Emotional
    Social --> Behavioral

    Perceptual_Symptoms --> Psychotherapy
    Cognitive_Symptoms --> Psychotherapy
    Emotional_Symptoms --> Education
    Behavioral_Symptoms --> Social_Support

    classDef disorderStyle fill:#FFEBEE,stroke:#F44336,color:#C62828
    classDef symptomStyle fill:#FFF3E0,stroke:#FF9800,color:#E65100
    classDef causeStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef interventionStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0

    class Perceptual,Cognitive,Emotional,Behavioral disorderStyle
    class Perceptual_Symptoms,Cognitive_Symptoms,Emotional_Symptoms,Behavioral_Symptoms symptomStyle
    class Biological,Psychological,Social causeStyle
    class Psychotherapy,Education,Social_Support interventionStyle
```

## 3. Maslow's Hierarchy Applied to Medical Aesthetics

```mermaid
graph TD
    subgraph "马斯洛需求层次在医美中的应用"

        Level1[生理需求<br>Physiological Needs<br><br>• 修复先天缺陷<br>• 改善呼吸功能<br>• 消除身体疼痛<br>• 恢复正常功能]

        Level2[安全需求<br>Safety Needs<br><br>• 预防健康风险<br>• 增强身体安全感<br>• 减少医疗风险<br>• 保障长期健康]

        Level3[社交需求<br>Social Needs<br><br>• 获得群体接纳<br>• 改善人际关系<br>• 增强社交自信<br>• 融入社会环境]

        Level4[尊重需求<br>Esteem Needs<br><br>• 提升自我价值感<br>• 获得他人尊重<br>• 增强职业形象<br>• 建立社会地位]

        Level5[自我实现需求<br>Self-Actualization<br><br>• 实现理想形象<br>• 表达个性特征<br>• 追求完美境界<br>• 达成人生目标]

    end

    subgraph "不同收入群体的需求重点"

        Low_Income[低收入群体<br><br>• 主要关注基础需求<br>• 功能修复优先<br>• 健康安全考虑<br>• 性价比导向]

        Middle_Income[中等收入群体<br><br>• 平衡多层次需求<br>• 社交与尊重并重<br>• 职业发展考虑<br>• 生活品质提升]

        High_Income[高收入群体<br><br>• 重视高层次需求<br>• 自我实现导向<br>• 个性表达重视<br>• 完美追求强烈]

    end

    subgraph "年龄群体需求差异"

        Young_Group[年轻群体(20-30岁)<br><br>• 社交需求强烈<br>• 时尚追求<br>• 个性表达<br>• 社会认同]

        Middle_Group[中年群体(30-45岁)<br><br>• 尊重需求突出<br>• 职业竞争力<br>• 年龄焦虑应对<br>• 社会地位维护]

        Senior_Group[年长群体(45岁以上)<br><br>• 安全需求增加<br>• 健康功能优先<br>• 生活质量提升<br>• 自然老化接受]

    end

    Level1 --> Level2
    Level2 --> Level3
    Level3 --> Level4
    Level4 --> Level5

    Level1 --> Low_Income
    Level3 --> Middle_Income
    Level5 --> High_Income

    Level3 --> Young_Group
    Level4 --> Middle_Group
    Level2 --> Senior_Group

    classDef hierarchyStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0,stroke-width:3px
    classDef incomeStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A
    classDef ageStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32

    class Level1,Level2,Level3,Level4,Level5 hierarchyStyle
    class Low_Income,Middle_Income,High_Income incomeStyle
    class Young_Group,Middle_Group,Senior_Group ageStyle
```

## 4. Anxiety Assessment Model

```mermaid
graph TB
    subgraph "焦虑类型评估"

        Appearance_Anxiety[外貌焦虑<br>Appearance Anxiety<br><br>• 对外貌过度担忧<br>• 频繁照镜检查<br>• 花费过多时间精力<br>• 影响日常生活]

        Age_Anxiety[年龄焦虑<br>Age Anxiety<br><br>• 担心衰老迹象<br>• 与他人年龄比较<br>• 职业年龄歧视担忧<br>• 时间流逝恐惧]

        Social_Anxiety[社交焦虑<br>Social Anxiety<br><br>• 害怕他人评价<br>• 回避社交场合<br>• 过度关注他人看法<br>• 社交表现担忧]

        Performance_Anxiety[表现焦虑<br>Performance Anxiety<br><br>• 担心不够完美<br>• 结果过度关注<br>• 失败恐惧<br>• 他人期望压力]

    end

    subgraph "评估维度"

        Cognitive[认知维度<br><br>• 消极自动思维<br>• 灾难化预期<br>• 选择性注意<br>• 认知扭曲]

        Emotional[情感维度<br><br>• 焦虑情绪强度<br>• 恐惧程度<br>• 抑郁状态<br>• 情绪调节能力]

        Behavioral[行为维度<br><br>• 回避行为<br>• 检查行为<br>• 寻求确认<br>• 功能损害]

        Physiological[生理维度<br><br>• 身体紧张<br>• 睡眠问题<br>• 食欲变化<br>• 身体症状]

    end

    subgraph "评估工具"

        Self_Assessment[自我评估量表<br>• 外貌焦虑量表<br>• 年龄焦虑量表<br>• 社交焦虑量表<br>• 整体焦虑量表]

        Professional_Assessment[专业评估<br>• 临床访谈<br>• 行为观察<br>• 心理测量<br>• 生理指标]

        Behavioral_Monitoring[行为监测<br>• 日常行为记录<br>• 社交活动统计<br>• 焦虑触发因素<br>• 应对方式分析]

    end

    subgraph "干预策略"

        Cognitive_Intervention[认知干预<br>• 认知重构<br>• 思维停止技术<br>• 积极自我对话<br>• 现实检验]

        Emotional_Intervention[情感干预<br>• 放松训练<br>• 情绪调节<br>• 压力管理<br>• 正念冥想]

        Behavioral_Intervention[行为干预<br>• 暴露疗法<br>• 行为激活<br>• 社交技能训练<br>• 问题解决训练]

    end

    Appearance_Anxiety --> Cognitive
    Age_Anxiety --> Emotional
    Social_Anxiety --> Behavioral
    Performance_Anxiety --> Physiological

    Cognitive --> Self_Assessment
    Emotional --> Professional_Assessment
    Behavioral --> Behavioral_Monitoring
    Physiological --> Professional_Assessment

    Self_Assessment --> Cognitive_Intervention
    Professional_Assessment --> Emotional_Intervention
    Behavioral_Monitoring --> Behavioral_Intervention

    classDef anxietyStyle fill:#FFF3E0,stroke:#FF9800,color:#E65100
    classDef dimensionStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef toolStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef interventionStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A

    class Appearance_Anxiety,Age_Anxiety,Social_Anxiety,Performance_Anxiety anxietyStyle
    class Cognitive,Emotional,Behavioral,Physiological dimensionStyle
    class Self_Assessment,Professional_Assessment,Behavioral_Monitoring toolStyle
    class Cognitive_Intervention,Emotional_Intervention,Behavioral_Intervention interventionStyle
```

## 5. Satisfaction Determination Factors

```mermaid
graph TD
    subgraph "满意度决定因素模型"

        Technical[技术效果满意度<br>Technical Effect Satisfaction<br><br>• 客观改善程度<br>• 期望匹配度<br>• 效果自然度<br>• 效果持久性]

        Service[服务体验满意度<br>Service Experience Satisfaction<br><br>• 术前咨询服务<br>• 医生专业水平<br>• 护理服务质量<br>• 术后跟踪服务]

        Psychological[心理感受满意度<br>Psychological Satisfaction<br><br>• 自信心提升<br>• 焦虑减轻程度<br>• 自我认同改善<br>• 整体幸福感]

        Social[社会认同满意度<br>Social Recognition Satisfaction<br><br>• 他人积极评价<br>• 社交活动改善<br>• 职业形象提升<br>• 整体社会适应]

    end

    subgraph "影响因素"

        Personal_Factors[个人因素<br><br>• 人格特质<br>• 动机类型<br>• 期望水平<br>• 风险承受<br>• 自我监控]

        Expectation_Management[期望管理<br><br>• 信息准确性<br>• 沟通质量<br>• 专业指导<br>• 风险告知<br>• 现实期望]

        Service_Quality[服务质量<br><br>• 技术专业性<br>• 服务态度<br>• 环境舒适度<br>• 流程便捷性<br>• 响应及时性]

        Social_Support[社会支持<br><br>• 家人支持<br>• 朋友支持<br>• 专业支持<br>• 同伴群体<br>• 社区环境]

    end

    subgraph "动态变化"

        Immediate_Satisfaction[即时满意度<br>术后1-7天<br><br>• 短期效果感受<br>• 服务体验<br>• 情绪反应<br>• 初步评价]

        Short_Term_Satisfaction[短期满意度<br>术后2-4周<br><br>• 恢复过程体验<br>• 效果显现<br>• 适应过程<br>• 问题处理]

        Medium_Term_Satisfaction[中期满意度<br>术后2-3个月<br><br>• 效果稳定<br>• 心理适应<br>• 社会反馈<br>• 整体评价]

        Long_Term_Satisfaction[长期满意度<br>术后6个月以上<br><br>• 持久效果<br>• 心理整合<br>• 生活改善<br>• 价值认同]

    end

    Technical --> Personal_Factors
    Service --> Service_Quality
    Psychological --> Expectation_Management
    Social --> Social_Support

    Personal_Factors --> Medium_Term_Satisfaction
    Service_Quality --> Immediate_Satisfaction
    Expectation_Management --> Long_Term_Satisfaction
    Social_Support --> Short_Term_Satisfaction

    Technical --> Long_Term_Satisfaction
    Service --> Immediate_Satisfaction
    Psychological --> Medium_Term_Satisfaction
    Social --> Short_Term_Satisfaction

    classDef satisfactionStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32,stroke-width:2px
    classDef factorStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef dynamicStyle fill:#FFF8E1,stroke:#FFC107,color:#F57C00

    class Technical,Service,Psychological,Social satisfactionStyle
    class Personal_Factors,Expectation_Management,Service_Quality,Social_Support factorStyle
    class Immediate_Satisfaction,Short_Term_Satisfaction,Medium_Term_Satisfaction,Long_Term_Satisfaction dynamicStyle
```