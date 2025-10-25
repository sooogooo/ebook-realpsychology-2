# 医美消费心理学网站API参考文档

## 概述

本文档详细描述了医美消费心理学网站的JavaScript API接口，包括数据可视化、文化比较、决策树、情绪状态流等核心功能模块的使用方法。

## 基础配置

### 初始化系统

```javascript
// 数据可视化系统
const radarChart = new RadarChart('container-id', {
    width: 600,
    height: 400,
    responsive: true,
    margin: { top: 20, right: 20, bottom: 40, left: 40 }
});

// 多语言系统
const multiLanguage = new MultiLanguageSupport();

// 数据管理器
const dataManager = new DataManager();
```

## 数据可视化API

### RadarChart - 雷达图

#### 构造函数
```javascript
new RadarChart(containerId, options)
```

#### 参数
- `containerId` (string): 容器元素ID
- `options` (object): 配置选项
  - `width` (number): 图表宽度
  - `height` (number): 图表高度
  - `responsive` (boolean): 是否响应式
  - `margin` (object): 边距设置

#### 方法
```javascript
// 设置数据
radarChart.setData({
    categories: ['外貌焦虑', '风险感知', '自我认同', '社会压力', '期望管理', '满意度'],
    series: [
        { category: '全部人群', values: [75, 65, 80, 70, 60, 85] },
        { category: '年轻群体', values: [85, 55, 70, 75, 50, 80] }
    ]
});

// 更新特定系列
radarChart.updateSeries('年轻群体', [90, 60, 75, 80, 55, 85]);

// 导出图表
radarChart.export('png');

// 销毁图表
radarChart.destroy();
```

#### 事件
```javascript
// 数据变化事件
radarChart.on('dataChange', (event) => {
    console.log('Data changed:', event.detail);
});

// 系列点击事件
radarChart.on('seriesClick', (event) => {
    console.log('Series clicked:', event.detail.series);
});
```

### TimeSeriesChart - 时间序列图

#### 构造函数
```javascript
new TimeSeriesChart(containerId, options)
```

#### 方法
```javascript
// 设置时间序列数据
timeSeriesChart.setData([
    { date: '2024-01-01', value: 75 },
    { date: '2024-01-15', value: 80 },
    { date: '2024-02-01', value: 70 }
]);

// 添加数据点
timeSeriesChart.addDataPoint({ date: '2024-02-15', value: 65 });

// 设置时间范围
timeSeriesChart.setTimeRange('2024-01-01', '2024-12-31');

// 获取趋势分析
const trend = timeSeriesChart.getTrendAnalysis();
```

### HeatMapChart - 热力图

#### 构造函数
```javascript
new HeatMapChart(containerId, options)
```

#### 方法
```javascript
// 设置热力图数据
heatMapChart.setData([
    { category: '微整形', period: '术前1周', value: 3 },
    { category: '微整形', period: '术前1天', value: 5 },
    { category: '手术整形', period: '术前1周', value: 7 }
]);

// 设置颜色范围
heatMapChart.setColorRange(['#f7fbff', '#08519c']);

// 获取单元格数据
const cellData = heatMapChart.getCellData('微整形', '术前1天');
```

### NetworkChart - 网络图

#### 构造函数
```javascript
new NetworkChart(containerId, options)
```

#### 方法
```javascript
// 设置网络数据
networkChart.setData({
    nodes: [
        { id: 1, name: '消费者', size: 20, degree: 3 },
        { id: 2, name: '医生', size: 18, degree: 6 }
    ],
    links: [
        { source: 1, target: 2, value: 9 }
    ]
});

// 添加节点
networkChart.addNode({ id: 3, name: '销售人员', size: 12, degree: 3 });

// 添加连接
networkChart.addLink({ source: 1, target: 3, value: 6 });

// 计算网络指标
const metrics = networkChart.calculateNetworkMetrics();
```

## 文化比较API

### CulturalComparison - 文化比较工具

#### 构造函数
```javascript
new CulturalComparison(containerId, options)
```

#### 方法
```javascript
// 比较两个文化
culturalComparison.compareCultures('china', 'usa');

// 获取文化维度数据
const dimensions = culturalComparison.getCulturalDimensions('china');

// 计算文化距离
const distance = culturalComparison.calculateCulturalDistance('china', 'usa');

// 获取适应建议
const suggestions = culturalComparison.getAdaptationSuggestions('china', 'usa');

// 生成文化对比报告
const report = culturalComparison.generateComparisonReport('china', 'usa');
```

#### 事件
```javascript
// 文化选择变化事件
culturalComparison.on('cultureChange', (event) => {
    console.log('Culture changed:', event.detail);
});

// 对比完成事件
culturalComparison.on('comparisonComplete', (event) => {
    console.log('Comparison completed:', event.detail);
});
```

## 决策树API

### DecisionTree - 决策树系统

#### 构造函数
```javascript
new DecisionTree(containerId, options)
```

#### 方法
```javascript
// 加载决策树
decisionTree.loadTree('first_time');

// 导航到指定节点
decisionTree.navigateTo('motivation');

// 记录决策
decisionTree.recordDecision('motivation', '改善外貌');

// 获取当前节点
const currentNode = decisionTree.getCurrentNode();

// 获取决策路径
const path = decisionTree.getDecisionPath();

// 重置决策树
decisionTree.reset();

// 获取最终建议
const recommendation = decisionTree.getRecommendation();
```

#### 事件
```javascript
// 决策记录事件
decisionTree.on('decisionRecorded', (event) => {
    console.log('Decision recorded:', event.detail);
});

// 决策完成事件
decisionTree.on('decisionComplete', (event) => {
    console.log('Decision complete:', event.detail);
});

// 节点变化事件
decisionTree.on('nodeChange', (event) => {
    console.log('Node changed:', event.detail);
});
```

## 情绪状态流API

### EmotionalStateFlow - 情绪状态流

#### 构造函数
```javascript
new EmotionalStateFlow(containerId, options)
```

#### 方法
```javascript
// 设置情绪类型
emotionalFlow.setEmotionType('anxiety');

// 追踪情绪变化
emotionalFlow.trackEmotion('anxiety', 'pre_1week', 75);

// 生成情绪流图
emotionalFlow.generateFlowChart();

// 获取情绪分析
const analysis = emotionalFlow.getEmotionalAnalysis();

// 获取情绪洞察
const insights = emotionalFlow.getEmotionalInsights();

// 导出情绪报告
emotionalFlow.exportReport('pdf');

// 预测情绪趋势
const prediction = emotionalFlow.predictTrend();
```

#### 事件
```javascript
// 情绪变化事件
emotionalFlow.on('emotionChange', (event) => {
    console.log('Emotion changed:', event.detail);
});

// 时间点变化事件
emotionalFlow.on('timelineChange', (event) => {
    console.log('Timeline changed:', event.detail);
});
```

## 多语言支持API

### MultiLanguageSupport - 多语言系统

#### 构造函数
```javascript
new MultiLanguageSupport()
```

#### 方法
```javascript
// 切换语言
multiLanguage.switchLanguage('en');

// 获取翻译
const translation = multiLanguage.translate('nav.home');

// 获取当前语言
const currentLang = multiLanguage.getCurrentLanguage();

// 获取支持的语言
const supportedLangs = multiLanguage.getSupportedLanguages();

// 添加翻译
multiLanguage.addTranslation('zh', {
    'new.key': '新翻译'
});

// 添加新语言
multiLanguage.addLanguage('fr', {
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr'
}, translations);
```

#### 事件
```javascript
// 语言切换事件
document.addEventListener('languageChanged', (event) => {
    console.log('Language changed to:', event.detail.language);
});
```

## 数据管理API

### DataManager - 数据管理器

#### 构造函数
```javascript
new DataManager()
```

#### 方法
```javascript
// 设置当前数据
dataManager.setCurrentData({
    radarData: { /* 雷达图数据 */ },
    timeSeriesData: [ /* 时间序列数据 */ ]
});

// 导出数据
dataManager.exportData('json'); // 'json', 'csv', 'xlsx'

// 导入数据
dataManager.importData(file);

// 刷新数据
dataManager.refreshData();

// 获取数据状态
const status = dataManager.getDataStatus();

// 添加数据到历史
dataManager.addToHistory(data);

// 获取历史记录
const history = dataManager.getHistory();
```

#### 事件
```javascript
// 数据导入事件
document.addEventListener('dataImported', (event) => {
    console.log('Data imported:', event.detail.data);
});

// 数据导出事件
document.addEventListener('dataExported', (event) => {
    console.log('Data exported:', event.detail.format);
});
```

### NotificationSystem - 通知系统

#### 构造函数
```javascript
new NotificationSystem()
```

#### 方法
```javascript
// 显示通知
notification.show('操作成功', 'success'); // 'success', 'error', 'warning', 'info'

// 显示成功通知
notification.success('数据保存成功');

// 显示错误通知
notification.error('操作失败');

// 显示警告通知
notification.warning('请注意数据格式');

// 显示信息通知
notification.info('系统提示');

// 清除所有通知
notification.clear();
```

## 工具函数

### 数据验证
```javascript
// 验证雷达图数据
function validateRadarData(data) {
    return DataManager.validateRadarData(data);
}

// 验证时间序列数据
function validateTimeSeriesData(data) {
    return DataManager.validateTimeSeriesData(data);
}

// 验证网络图数据
function validateNetworkData(data) {
    return DataManager.validateNetworkData(data);
}
```

### 数据转换
```javascript
// 转换为CSV格式
function convertToCSV(data) {
    return DataManager.convertToCSV(data);
}

// 转换为Excel格式
function convertToExcel(data) {
    return DataManager.convertToExcel(data);
}

// 格式化日期
function formatDate(date) {
    return Utils.formatDate(date);
}

// 格式化数字
function formatNumber(number) {
    return Utils.formatNumber(number);
}
```

### 图表工具
```javascript
// 生成随机颜色
function generateColors(count) {
    return ChartUtils.generateColors(count);
}

// 计算图表尺寸
function calculateChartDimensions(container) {
    return ChartUtils.calculateDimensions(container);
}

// 创建响应式图表
function createResponsiveChart(chartClass, containerId, options) {
    return ChartUtils.createResponsive(chartClass, containerId, options);
}
```

## 配置选项

### 全局配置
```javascript
// 设置全局配置
const config = {
    api: {
        baseUrl: 'https://api.example.com',
        timeout: 5000
    },
    chart: {
        defaultWidth: 600,
        defaultHeight: 400,
        animationDuration: 300,
        colors: ['#98d8c8', '#b8a9c9', '#ff9a8b', '#f4a261', '#4ecdc4']
    },
    language: {
        default: 'zh',
        fallback: 'en'
    },
    data: {
        autoSave: true,
        maxHistory: 10
    }
};

// 应用配置
Utils.setConfig(config);
```

### 主题配置
```javascript
// 设置主题
const theme = {
    light: {
        primary: '#98d8c8',
        secondary: '#b8a9c9',
        background: '#ffffff',
        text: '#2c3e50'
    },
    dark: {
        primary: '#4ecdc4',
        secondary: '#a8a9c9',
        background: '#1a1a1a',
        text: '#ffffff'
    }
};

// 应用主题
Utils.setTheme('light');
```

## 错误处理

### 错误类型
```javascript
// 数据错误
class DataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DataError';
    }
}

// 图表错误
class ChartError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ChartError';
    }
}

// 网络错误
class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}
```

### 错误处理示例
```javascript
try {
    const chart = new RadarChart('container', options);
    chart.setData(data);
} catch (error) {
    if (error instanceof DataError) {
        console.error('Data error:', error.message);
        notification.error('数据格式错误');
    } else if (error instanceof ChartError) {
        console.error('Chart error:', error.message);
        notification.error('图表渲染失败');
    } else {
        console.error('Unexpected error:', error);
        notification.error('系统错误');
    }
}
```

## 最佳实践

### 性能优化
```javascript
// 使用防抖处理频繁操作
const debouncedUpdate = Utils.debounce((data) => {
    chart.update(data);
}, 300);

// 使用虚拟滚动处理大数据
const virtualChart = new VirtualScrollChart(container, {
    itemHeight: 40,
    bufferSize: 10
});

// 懒加载图表
const lazyChart = new LazyChart(container, {
    threshold: 0.1,
    rootMargin: '50px'
});
```

### 内存管理
```javascript
// 及时清理不需要的图表
function cleanupCharts() {
    charts.forEach(chart => chart.destroy());
    charts = [];
}

// 使用对象池管理图表实例
const chartPool = new ObjectPool({
    create: () => new RadarChart(),
    destroy: (chart) => chart.destroy(),
    reset: (chart) => chart.reset()
});
```

### 事件监听器管理
```javascript
// 使用事件委托
document.addEventListener('click', (event) => {
    if (event.target.matches('.chart-button')) {
        handleChartClick(event);
    }
});

// 及时移除事件监听器
function setupChart(chart) {
    const handler = (event) => {
        console.log('Chart event:', event);
    };
    
    chart.on('dataChange', handler);
    
    // 清理函数
    return () => {
        chart.off('dataChange', handler);
    };
}
```

## 示例代码

### 完整的数据可视化示例
```javascript
// 初始化图表
const chart = new RadarChart('radar-chart', {
    width: 600,
    height: 400,
    responsive: true
});

// 设置数据
const data = {
    categories: ['外貌焦虑', '风险感知', '自我认同', '社会压力', '期望管理', '满意度'],
    series: [
        { category: '全部人群', values: [75, 65, 80, 70, 60, 85] },
        { category: '年轻群体', values: [85, 55, 70, 75, 50, 80] }
    ]
};

chart.setData(data);

// 添加事件监听
chart.on('seriesClick', (event) => {
    const series = event.detail.series;
    console.log(`Clicked on series: ${series.category}`);
    
    // 更新其他图表
    updateOtherCharts(series);
});

// 导出功能
document.getElementById('export-btn').addEventListener('click', () => {
    chart.export('png');
});

// 响应式处理
window.addEventListener('resize', Utils.debounce(() => {
    chart.resize();
}, 250));
```

### 文化比较示例
```javascript
// 初始化文化比较工具
const comparison = new CulturalComparison('cultural-comparison', {
    width: 800,
    height: 600
});

// 设置文化选择
document.getElementById('culture1').addEventListener('change', (e) => {
    const culture1 = e.target.value;
    const culture2 = document.getElementById('culture2').value;
    
    comparison.compareCultures(culture1, culture2);
});

// 处理比较结果
comparison.on('comparisonComplete', (event) => {
    const result = event.detail;
    
    // 显示距离分数
    document.getElementById('distance-score').textContent = 
        `文化距离: ${result.distance.toFixed(2)}`;
    
    // 显示适应建议
    const suggestions = result.suggestions;
    displaySuggestions(suggestions);
});
```

### 决策树示例
```javascript
// 初始化决策树
const decisionTree = new DecisionTree('decision-tree', {
    width: 800,
    height: 600
});

// 加载决策树
decisionTree.loadTree('first_time');

// 处理决策选择
decisionTree.on('decisionRecorded', (event) => {
    const decision = event.detail;
    
    // 更新进度
    updateProgress(decision.path.length);
    
    // 记录到本地存储
    saveDecisionToHistory(decision);
});

// 处理决策完成
decisionTree.on('decisionComplete', (event) => {
    const result = event.detail;
    
    // 显示建议
    displayRecommendation(result.recommendation);
    
    // 生成报告
    generateDecisionReport(result);
});
```

---

*API参考文档最后更新: 2025-01-01*