# 医美消费心理学网站技术文档

## 系统架构

### 技术栈
- **前端**: HTML5, CSS3, JavaScript ES6+
- **可视化**: D3.js v7.x
- **图标**: Material Symbols Outlined
- **字体**: Inter, Google Fonts
- **多语言**: 自定义多语言系统
- **数据管理**: LocalStorage API

### 文件结构
```
website/
├── index.html                          # 主页
├── data-visualization.html             # 数据可视化页面
├── cultural-comparison.html           # 文化差异比较页面
├── decision-tree.html                 # 决策树工具页面
├── emotional-state-flow.html          # 情绪状态流页面
├── multi-language-test.html           # 多语言测试页面
├── assets/
│   ├── css/
│   │   ├── main.css                    # 主样式文件
│   │   ├── data-visualization.css      # 数据可视化样式
│   │   ├── cultural-comparison.css    # 文化比较样式
│   │   ├── decision-tree.css          # 决策树样式
│   │   ├── emotional-state-flow.css   # 情绪状态流样式
│   │   └── multi-language-support.css # 多语言支持样式
│   ├── js/
│   │   ├── data-visualization.js      # 数据可视化核心
│   │   ├── cultural-comparison.js    # 文化比较逻辑
│   │   ├── decision-tree.js          # 决策树系统
│   │   ├── emotional-state-flow.js   # 情绪状态流系统
│   │   ├── multi-language-support.js # 多语言支持系统
│   │   └── data-export-import.js      # 数据导入导出系统
│   └── svg/
│       └── illustrations/             # SVG插图目录
└── README.md                          # 项目说明
```

## 核心模块

### 1. 数据可视化系统 (data-visualization.js)

#### 图表类结构
```javascript
class BaseChart {
    constructor(containerId, options) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.data = null;
        this.svg = null;
        this.init();
    }
    
    init() {
        this.setupSVG();
        this.setupEventListeners();
    }
    
    setData(data) {
        this.data = data;
        this.render();
    }
    
    render() {
        // 子类实现具体渲染逻辑
    }
}
```

#### 支持的图表类型
- **RadarChart** - 雷达图实现
- **SankeyChart** - 桑基图实现
- **TimeSeriesChart** - 时间序列图实现
- **HeatMapChart** - 热力图实现
- **NetworkChart** - 网络图实现

#### 核心方法
- `setData(data)` - 设置图表数据
- `render()` - 渲染图表
- `update(data)` - 更新图表数据
- `export(format)` - 导出图表
- `destroy()` - 清理图表资源

### 2. 文化比较系统 (cultural-comparison.js)

#### 文化数据模型
```javascript
const culturalData = {
    dimensions: {
        power_distance: '权力距离',
        individualism: '个人主义',
        masculinity: '男性气质',
        uncertainty_avoidance: '不确定性规避',
        long_term_orientation: '长期导向',
        indulgence: '放纵程度'
    },
    cultures: {
        china: { name: '中国', scores: [80, 20, 66, 30, 87, 24] },
        usa: { name: '美国', scores: [40, 91, 62, 46, 26, 68] },
        japan: { name: '日本', scores: [54, 46, 95, 92, 88, 42] },
        korea: { name: '韩国', scores: [60, 18, 39, 85, 100, 29] }
    }
};
```

#### 核心功能
- `compareCultures(culture1, culture2)` - 文化对比
- `generateComparisonMatrix()` - 生成对比矩阵
- `calculateCulturalDistance()` - 计算文化距离
- `getAdaptationSuggestions()` - 获取适应建议

### 3. 决策树系统 (decision-tree.js)

#### 决策树数据结构
```javascript
const decisionTrees = {
    first_time: {
        id: 'first_time',
        name: '首次消费决策',
        description: '首次进行医美消费的决策流程',
        nodes: [
            {
                id: 'start',
                type: 'start',
                question: '这是您第一次进行医美消费吗？',
                options: [
                    { text: '是', next: 'motivation' },
                    { text: '否', next: 'experience' }
                ]
            }
        ]
    }
};
```

#### 核心功能
- `loadTree(treeId)` - 加载决策树
- `navigateTo(nodeId)` - 导航到指定节点
- `recordDecision(nodeId, option)` - 记录决策
- `generateDecisionPath()` - 生成决策路径
- `getRecommendation()` - 获取建议

### 4. 情绪状态流系统 (emotional-state-flow.js)

#### 情绪数据模型
```javascript
const emotionalData = {
    anxiety: {
        name: '焦虑指数',
        description: '消费者在不同阶段的焦虑水平',
        timeline: {
            'pre_1week': { baseline: 60, description: '术前1周' },
            'pre_1day': { baseline: 75, description: '术前1天' },
            'post_1day': { baseline: 85, description: '术后1天' },
            'post_1week': { baseline: 65, description: '术后1周' },
            'post_1month': { baseline: 45, description: '术后1月' },
            'post_3months': { baseline: 35, description: '术后3月' },
            'post_6months': { baseline: 25, description: '术后6月' },
            'post_1year': { baseline: 20, description: '术后1年' },
            'post_2years': { baseline: 15, description: '术后2年' }
        }
    }
};
```

#### 核心功能
- `trackEmotion(emotionType, timeline)` - 追踪情绪
- `generateEmotionalFlow()` - 生成情绪流
- `analyzeEmotionalPattern()` - 分析情绪模式
- `getEmotionalInsights()` - 获取情绪洞察

### 5. 多语言支持系统 (multi-language-support.js)

#### 多语言数据结构
```javascript
class MultiLanguageSupport {
    constructor() {
        this.currentLanguage = 'zh';
        this.supportedLanguages = {
            'zh': { name: '中文', flag: '🇨🇳', direction: 'ltr' },
            'en': { name: 'English', flag: '🇺🇸', direction: 'ltr' },
            'ja': { name: '日本語', flag: '🇯🇵', direction: 'ltr' },
            'ko': { name: '한국어', flag: '🇰🇷', direction: 'ltr' }
        };
        this.translations = {
            'zh': { /* 中文翻译 */ },
            'en': { /* 英文翻译 */ },
            'ja': { /* 日文翻译 */ },
            'ko': { /* 韩文翻译 */ }
        };
    }
}
```

#### 核心功能
- `switchLanguage(lang)` - 切换语言
- `translate(key)` - 翻译文本
- `updateUI()` - 更新界面文本
- `updateSVGText()` - 更新SVG文本
- `addTranslation(lang, translations)` - 添加翻译

### 6. 数据导入导出系统 (data-export-import.js)

#### 数据管理器
```javascript
class DataManager {
    constructor() {
        this.currentData = {};
        this.dataHistory = [];
        this.notificationSystem = new NotificationSystem();
    }
    
    exportData(format) {
        // 导出为指定格式
    }
    
    importData(file) {
        // 导入数据文件
    }
    
    validateAndSetData(data) {
        // 验证并设置数据
    }
}
```

#### 支持的格式
- **JSON**: 完整数据结构导出
- **CSV**: 表格格式导出
- **Excel**: 多工作簿导出（需要SheetJS）

## SVG插图系统

### 插图分类
- **Chapter 1**: 多维视角 (9+ 插图)
- **Chapter 2**: 研究方法 (9+ 插图)
- **Chapter 3**: 心理需求 (10 插图)
- **Chapter 4**: 信息处理 (9 插图)
- **Chapter 7**: 伦理边界 (9 插图)
- **Chapter 8**: 技术发展 (12 插图)
- **Chapter 9**: 文化差异 (11 插图)
- **Chapter 10**: 未来展望 (10 插图)

### 插图特点
- 矢量格式，无损缩放
- 交互式元素支持
- 多语言文本集成
- 响应式设计适配
- 主题色彩一致性

## 样式系统

### CSS架构
```css
/* 基础样式 */
:root {
    --primary-color: #98d8c8;
    --secondary-color: #b8a9c9;
    --accent-color: #ff9a8b;
    --text-primary: #2c3e50;
    --text-secondary: #7f8c8d;
    --background: #ffffff;
    --border-light: #ecf0f1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
    :root {
        --background: #1a1a1a;
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
    }
}
```

### 动画效果
```css
/* 平滑过渡 */
.transition {
    transition: all 0.3s ease;
}

/* 加载动画 */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 渐入效果 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## 事件系统

### 自定义事件
```javascript
// 语言切换事件
document.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
});

// 数据导入事件
document.addEventListener('dataImported', (e) => {
    console.log('Data imported:', e.detail.data);
});

// 决策完成事件
document.addEventListener('decisionCompleted', (e) => {
    console.log('Decision completed:', e.detail.path);
});
```

## 数据存储

### LocalStorage使用
```javascript
// 用户偏好设置
localStorage.setItem('preferredLanguage', 'zh');
localStorage.setItem('theme', 'light');

// 数据缓存
localStorage.setItem('medicalAestheticsData', JSON.stringify(data));

// 历史记录
localStorage.setItem('decisionHistory', JSON.stringify(history));
```

### 数据验证
```javascript
function validateData(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
    }
    
    // 验证必需字段
    const requiredFields = ['radarData', 'timeSeriesData'];
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    return true;
}
```

## 性能优化

### 图表优化
- 使用虚拟DOM减少重绘
- 实现数据分页加载
- 优化动画性能
- 内存管理

### 图片优化
- SVG矢量图压缩
- 懒加载机制
- 缓存策略
- 响应式图片

### 代码优化
- 模块化设计
- 代码分割
- 按需加载
- 性能监控

## 测试策略

### 单元测试
```javascript
// 测试图表渲染
function testChartRendering() {
    const chart = new RadarChart('test-container', { width: 400, height: 300 });
    chart.setData(testData);
    assert(chart.svg !== null, 'Chart should be rendered');
}

// 测试数据导入导出
function testDataExportImport() {
    const dataManager = new DataManager();
    dataManager.setData(testData);
    const exported = dataManager.exportData('json');
    assert(exported !== null, 'Data should be exported');
}
```

### 集成测试
- 页面间导航测试
- 数据流测试
- 多语言切换测试
- 响应式设计测试

### 用户测试
- 可用性测试
- 性能测试
- 兼容性测试
- 可访问性测试

## 部署指南

### 构建过程
1. 代码压缩和优化
2. 资源文件合并
3. 缓存策略配置
4. CDN部署

### 环境配置
```javascript
// 开发环境
const config = {
    development: {
        apiUrl: 'http://localhost:3000',
        debug: true
    },
    production: {
        apiUrl: 'https://api.example.com',
        debug: false
    }
};
```

### 监控和分析
- 页面访问统计
- 用户行为分析
- 性能监控
- 错误追踪

## 扩展性设计

### 插件系统
```javascript
class PluginManager {
    constructor() {
        this.plugins = [];
    }
    
    register(plugin) {
        this.plugins.push(plugin);
        plugin.init();
    }
    
    loadPlugin(name) {
        // 动态加载插件
    }
}
```

### 主题系统
- 预设主题配置
- 自定义主题支持
- 动态主题切换
- 主题导出导入

### API扩展
- 数据API接口
- 第三方集成
- 插件开发SDK
- 开发者文档

---

*技术文档最后更新: 2025-01-01*