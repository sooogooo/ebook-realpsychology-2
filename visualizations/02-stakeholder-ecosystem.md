# Stakeholder Relationship Maps & Ecosystem Diagrams

## 1. Multi-Party Ecosystem Framework

```mermaid
graph TD
    Consumer[消费者<br>Consumer] --> Doctor[医生<br>Doctor]
    Consumer --> Sales[销售人员<br>Sales Staff]
    Consumer --> Investor[投资者<br>Investor]

    Doctor --> Consumer
    Sales --> Consumer
    Investor --> Consumer

    Doctor -->|专业技术支持| Institution[医美机构<br>Institution]
    Sales -->|客户关系维护| Institution
    Investor -->|资金投入管理| Institution

    Institution -->|提供平台| Doctor
    Institution -->|雇佣关系| Sales
    Institution -->|投资回报| Investor

    Consumer -->|信息需求| InfoProvider[信息提供者<br>Information Providers]
    Doctor -->|专业知识| InfoProvider
    Sales -->|营销信息| InfoProvider

    InfoProvider -->|信息服务| Consumer
    InfoProvider -->|行业数据| Institution

    Consumer -->|社会影响| Social[社会环境<br>Social Environment]
    Doctor -->|专业规范| Social
    Sales -->|营销伦理| Social
    Investor -->|社会责任| Social
    Institution -->|行业声誉| Social

    Social -->|规范约束| Consumer
    Social -->|监管要求| Doctor
    Social -->|道德标准| Sales
    Social -->|投资伦理| Investor
    Social -->|行业规范| Institution

    classDef consumerStyle fill:#E3F2FD,stroke:#2196F3,stroke-width:2px,color:#1565C0
    classDef professionalStyle fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px,color:#6A1B9A
    classDef businessStyle fill:#E8F5E8,stroke:#4CAF50,stroke-width:2px,color:#2E7D32
    classDef environmentStyle fill:#FFF3E0,stroke:#FF9800,stroke-width:2px,color:#E65100

    class Consumer consumerStyle
    class Doctor,Sales professionalStyle
    class Investor,Institution businessStyle
    class InfoProvider,Social environmentStyle
```

## 2. Role Interaction Network

```mermaid
graph LR
    C[消费者] -->|需求表达| D[医生]
    D -->|专业建议| C
    C -->|咨询沟通| S[销售人员]
    S -->|服务方案| C

    C -->|体验反馈| I[投资者]
    I -->|服务标准| C
    D -->|技术要求| I
    I -->|资源配置| D
    S -->|市场信息| I
    I -->|战略指导| S

    D -->|医疗质量| S
    S -->|客户需求| D
    D -->|专业培训| S
    S -->|销售反馈| D

    C -->|支付费用| INST[医美机构]
    INST -->|提供服务| C
    D -->|技术服务| INST
    INST -->|工作平台| D
    S -->|客户开发| INST
    INST -->|薪酬激励| S
    I -->|资金支持| INST
    INST -->|投资回报| I

    subgraph "核心价值流"
        C -- "需求→服务→满意度" --> INST
        INST -- "资金→技术→平台" --> C
    end

    subgraph "专业服务流"
        D -- "专业能力" --> C
        S -- "客户关系" --> C
    end

    subgraph "投资回报流"
        I -- "战略指导" --> INST
        INST -- "财务回报" --> I
    end

    classDef consumerStyle fill:#E3F2FD,stroke:#2196F3,color:#1565C0
    classDef professionalStyle fill:#F3E5F5,stroke:#9C27B0,color:#6A1B9A
    classDef businessStyle fill:#E8F5E8,stroke:#4CAF50,color:#2E7D32
    classDef institutionStyle fill:#FFF8E1,stroke:#FFC107,color:#F57C00

    class C consumerStyle
    class D,S professionalStyle
    class I businessStyle
    class INST institutionStyle
```

## 3. Communication Flow Patterns

```mermaid
sequenceDiagram
    participant Consumer as 消费者
    participant Sales as 销售人员
    participant Doctor as 医生
    participant Institution as 医美机构
    participant Investor as 投资者

    Note over Consumer,Investor: 消费决策沟通流程

    Consumer->>Sales: 表达初步需求
    Sales->>Consumer: 需求分析与初步方案
    Sales->>Doctor: 转交客户信息
    Doctor->>Sales: 专业评估反馈
    Sales->>Consumer: 专业建议补充

    Consumer->>Doctor: 专业咨询预约
    Doctor->>Consumer: 面诊与专业评估
    Doctor->>Consumer: 技术方案与风险告知
    Consumer->>Doctor: 确认方案与期望调整

    Consumer->>Sales: 确认服务选择
    Sales->>Institution: 提交服务安排
    Institution->>Doctor: 确认技术与排期
    Institution->>Sales: 确认服务流程
    Sales->>Consumer: 确认最终安排

    Consumer->>Institution: 支付服务费用
    Institution->>Investor: 报告客户与收入
    Investor->>Institution: 资源配置指导
    Institution->>Doctor: 技术资源支持
    Institution->>Sales: 市场策略指导

    Note over Consumer,Investor: 术后跟踪与服务

    Doctor->>Consumer: 术后检查与指导
    Consumer->>Institution: 满意度反馈
    Institution->>Investor: 客户满意度报告
    Investor->>Institution: 服务改进要求

    Consumer->>Sales: 持续关系维护
    Sales->>Institution: 客户关系价值报告
    Institution->>Investor: 长期价值分析
```

## 4. Value Exchange Network

```mermaid
graph TB
    subgraph "价值输入 (Value Inputs)"
        Consumer_Value[消费者价值<br>• 资金投入<br>• 信任建立<br>• 需求表达<br>• 体验反馈]
        Doctor_Value[医生价值<br>• 专业技能<br>• 时间投入<br>• 风险承担<br>• 创新贡献]
        Sales_Value[销售价值<br>• 客户开发<br>• 关系维护<br>• 市场洞察<br>• 品牌传播]
        Investor_Value[投资者价值<br>• 资本投入<br>• 战略指导<br>• 风险承担<br>• 资源整合]
    end

    subgraph "价值创造 (Value Creation)"
        Institution[医美机构<br>价值整合中心]
        Institution -->|整合资源| Service[专业医疗服务]
        Institution -->|优化流程| Experience[优质客户体验]
        Institution -->|建立品牌| Reputation[行业声誉]
    end

    subgraph "价值输出 (Value Outputs)"
        Consumer_Output[消费者收益<br>• 外貌改善<br>• 自信提升<br>• 心理满足<br>• 社会认可]
        Doctor_Output[医生收益<br>• 职业收入<br>• 专业成长<br>• 学术声誉<br>• 价值实现]
        Sales_Output[销售收益<br>• 销售提成<br>• 客户资源<br>• 经验积累<br>• 职业发展]
        Investor_Output[投资者收益<br>• 财务回报<br>• 市场份额<br>• 品牌价值<br>• 行业影响力]
    end

    Consumer_Value --> Institution
    Doctor_Value --> Institution
    Sales_Value --> Institution
    Investor_Value --> Institution

    Service --> Consumer_Output
    Service --> Doctor_Output
    Service --> Investor_Output

    Experience --> Consumer_Output
    Experience --> Sales_Output
    Experience --> Investor_Output

    Reputation --> Doctor_Output
    Reputation --> Sales_Output
    Reputation --> Investor_Output

    classDef inputStyle fill:#E8F5E8,stroke:#4CAF50,stroke-width:2px
    classDef processStyle fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    classDef outputStyle fill:#FFF8E1,stroke:#FFC107,stroke-width:2px

    class Consumer_Value,Doctor_Value,Sales_Value,Investor_Value inputStyle
    class Institution,Service,Experience,Reputation processStyle
    class Consumer_Output,Doctor_Output,Sales_Output,Investor_Output outputStyle
```

## 5. Decision-Making Influence Network

```mermaid
graph TD
    subgraph "个人影响因素 (Personal Factors)"
        Age[年龄因素]
        Gender[性别差异]
        Income[收入水平]
        Education[教育背景]
        Personality[人格特质]
        Experience[过往经验]
    end

    subgraph "社会影响因素 (Social Factors)"
        Family[家庭影响]
        Friends[朋友意见]
        Colleagues[同事观点]
        Social_Media[社交媒体]
        Culture[文化背景]
        Trends[流行趋势]
    end

    subgraph "专业影响因素 (Professional Factors)"
        Doctor_Quality[医生专业度]
        Institution_Reputation[机构声誉]
        Technology_Level[技术水平]
        Price[价格因素]
        Service_Quality[服务质量]
        Risk_Communication[风险沟通]
    end

    subgraph "心理影响因素 (Psychological Factors)"
        Anxiety[外貌焦虑]
        Motivation[动机类型]
        Risk_Perception[风险感知]
        Self_Concept[自我概念]
        Body_Image[身体意象]
        Decision_Style[决策风格]
    end

    subgraph "决策结果 (Decision Outcomes)"
        Decision_Quality[决策质量]
        Satisfaction[满意度]
        Regret[后悔程度]
        Future_Intention[未来意向]
        Word_of_Mouth[口碑传播]
    end

    Age --> Decision_Quality
    Gender --> Decision_Quality
    Income --> Decision_Quality
    Education --> Decision_Quality
    Personality --> Decision_Quality
    Experience --> Decision_Quality

    Family --> Motivation
    Friends --> Motivation
    Colleagues --> Motivation
    Social_Media --> Anxiety
    Culture --> Body_Image
    Trends --> Motivation

    Doctor_Quality --> Risk_Perception
    Institution_Reputation --> Decision_Quality
    Technology_Level --> Risk_Perception
    Price --> Decision_Quality
    Service_Quality --> Satisfaction
    Risk_Communication --> Regret

    Anxiety --> Decision_Style
    Motivation --> Decision_Quality
    Risk_Perception --> Decision_Quality
    Self_Concept --> Motivation
    Body_Image --> Motivation
    Decision_Style --> Decision_Quality

    Decision_Quality --> Satisfaction
    Satisfaction --> Future_Intention
    Satisfaction --> Word_of_Mouth
    Regret --> Future_Intention

    classDef personalStyle fill:#E3F2FD,stroke:#2196F3
    classDef socialStyle fill:#F3E5F5,stroke:#9C27B0
    classDef professionalStyle fill:#E8F5E8,stroke:#4CAF50
    classDef psychologicalStyle fill:#FFF3E0,stroke:#FF9800
    classDef outcomeStyle fill:#FFEBEE,stroke:#F44336

    class Age,Gender,Income,Education,Personality,Experience personalStyle
    class Family,Friends,Colleagues,Social_Media,Culture,Trends socialStyle
    class Doctor_Quality,Institution_Reputation,Technology_Level,Price,Service_Quality,Risk_Communication professionalStyle
    class Anxiety,Motivation,Risk_Perception,Self_Concept,Body_Image,Decision_Style psychologicalStyle
    class Decision_Quality,Satisfaction,Regret,Future_Intention,Word_of_Mouth outcomeStyle
```