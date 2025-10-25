# 医美消费心理学可视化规范

## 📋 视觉规范总览

### 1. **色彩系统 (Color System)**

#### 主色调
```css
/* 品牌主色 */
--primary-color: #3498db;    /* 蓝色 - 专业、信任 */
--secondary-color: #2c3e50;  /* 深蓝 - 稳重、权威 */
--accent-color: #9b59b6;     /* 紫色 - 创新、高端 */

/* 功能色彩 */
--success-color: #27ae60;    /* 绿色 - 成功、积极 */
--warning-color: #f39c12;    /* 橙色 - 警示、注意 */
--danger-color: #e74c3c;     /* 红色 - 风险、重要 */
--info-color: #3498db;       /* 蓝色 - 信息、中性 */

/* 中性色彩 */
--text-primary: #2c3e50;     /* 主要文本 */
--text-secondary: #7f8c8d;   /* 次要文本 */
--text-muted: #95a5a6;       /* 辅助文本 */
--border-color: #ecf0f1;     /* 边框颜色 */
--background-color: #f8f9fa; /* 背景颜色 */
```

#### 色彩使用规范
- **主色调**: 用于标题、重要按钮、核心图表
- **功能色彩**: 用于不同类型的数据和状态标识
- **中性色彩**: 用于背景、边框、辅助文本

### 2. **字体系统 (Typography System)**

#### 字体层级
```css
/* 标题字体 */
.h1 { font-size: 32px; font-weight: 700; line-height: 1.2; }
.h2 { font-size: 24px; font-weight: 600; line-height: 1.3; }
.h3 { font-size: 20px; font-weight: 600; line-height: 1.4; }
.h4 { font-size: 16px; font-weight: 500; line-height: 1.5; }

/* 正文字体 */
.body-large { font-size: 18px; line-height: 1.6; }
.body-medium { font-size: 16px; line-height: 1.6; }
.body-small { font-size: 14px; line-height: 1.5; }
.body-xsmall { font-size: 12px; line-height: 1.4; }
```

#### 字体使用规范
- **中文字体**: "PingFang SC", "Microsoft YaHei", "微软雅黑"
- **英文字体**: "Helvetica Neue", Arial, sans-serif
- **代码字体**: "Monaco", "Menlo", monospace

### 3. **图标系统 (Icon System)**

#### Webfont图标尺寸
```css
/* 标准尺寸 */
.ma-icon-sm { width: 16px; height: 16px; font-size: 16px; }
.ma-icon-md { width: 20px; height: 20px; font-size: 20px; }
.ma-icon-lg { width: 24px; height: 24px; font-size: 24px; }
.ma-icon-xl { width: 32px; height: 32px; font-size: 32px; }
.ma-icon-xxl { width: 48px; height: 48px; font-size: 48px; }
```

#### 图标使用规范
- **导航图标**: 20px × 20px
- **按钮图标**: 16px × 16px
- **标题图标**: 24px × 24px
- **数据图表**: 32px × 32px
- **装饰图标**: 48px × 48px

### 4. **图表系统 (Chart System)**

#### 图表配色
```css
/* 图表主色调 */
.chart-primary-1: #3498db;
.chart-primary-2: #2ecc71;
.chart-primary-3: #f39c12;
.chart-primary-4: #e74c3c;
.chart-primary-5: #9b59b6;
.chart-primary-6: #1abc9c;

/* 渐变色 */
.chart-gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
.chart-gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
.chart-gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

#### 图表尺寸规范
- **大型图表**: 800px × 600px (详情页)
- **中型图表**: 600px × 400px (章节内)
- **小型图表**: 400px × 300px (侧边栏)
- **微型图表**: 200px × 150px (卡片内)

### 5. **SVG插图规范 (SVG Illustration Guidelines)**

#### 文件命名规范
```
格式: 章节编号-内容描述-功能.svg
示例: 
- chapter-01-preface-introduction-cover.svg
- chapter-02-multidimensional-framework.svg
- chapter-03-motivation-model.svg
```

#### SVG技术规范
```xml
<!-- 标准SVG模板 -->
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 渐变定义 -->
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2c3e50;stop-opacity:1" />
    </linearGradient>
    
    <!-- 阴影滤镜 -->
    <filter id="shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- 内容区域 -->
</svg>
```

#### 插图尺寸标准
- **章节封面**: 800px × 600px
- **概念图示**: 600px × 400px
- **流程图表**: 800px × 600px
- **数据图表**: 600px × 400px
- **装饰图标**: 200px × 200px

### 6. **响应式设计规范 (Responsive Design Guidelines)**

#### 断点设置
```css
/* 移动设备 */
@media (max-width: 768px) {
  .container { max-width: 100%; padding: 0 16px; }
  .h1 { font-size: 24px; }
  .h2 { font-size: 20px; }
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  .container { max-width: 768px; padding: 0 24px; }
}

/* 桌面设备 */
@media (min-width: 1025px) {
  .container { max-width: 1200px; padding: 0 32px; }
}
```

### 7. **数据可视化规范 (Data Visualization Standards)**

#### 数据配色原则
- **正面数据**: 使用绿色系 (#27ae60)
- **负面数据**: 使用红色系 (#e74c3c)
- **中性数据**: 使用蓝色系 (#3498db)
- **警示数据**: 使用橙色系 (#f39c12)

#### 图表类型选择
- **趋势分析**: 折线图、面积图
- **对比分析**: 柱状图、条形图
- **占比分析**: 饼图、环形图
- **关系分析**: 散点图、热力图
- **流程分析**: 流程图、思维导图

### 8. **交互效果规范 (Interaction Guidelines)**

#### 动画时长
- **快速反馈**: 0.1s - 0.3s
- **页面过渡**: 0.3s - 0.5s
- **复杂动画**: 0.5s - 1.0s

#### 交互状态
```css
/* 悬停状态 */
:hover { transform: translateY(-2px); transition: all 0.3s ease; }

/* 点击状态 */
:active { transform: scale(0.98); transition: all 0.1s ease; }

/* 聚焦状态 */
:focus { outline: 2px solid #3498db; outline-offset: 2px; }
```

### 9. **文件组织规范 (File Organization)**

#### 目录结构
```
assets/
├── svg/
│   ├── chapter-00-preface/        # 序言插图
│   ├── chapter-01-multidimensional/ # 第1章插图
│   ├── chapter-02-research/       # 第2章插图
│   ├── chapter-03-consumption/   # 第3章插图
│   ├── chapter-04-information/   # 第4章插图
│   ├── chapter-07-ethical/       # 第7章插图
│   ├── chapter-08-technology/    # 第8章插图
│   ├── chapter-09-cultural/      # 第9章插图
│   ├── chapter-10-future/        # 第10章插图
│   ├── webfont-icons/            # Webfont图标
│   └── interactive/             # 交互式图表
├── fonts/                        # 字体文件
├── css/
│   ├── webfont-icons.css         # 图标样式
│   └── visualization.css         # 可视化样式
└── js/
    └── visualization.js          # 可视化脚本
```

### 10. **质量控制标准 (Quality Control)**

#### 插图质量要求
- **每章最少**: 7张专业插图
- **图片格式**: SVG矢量图为主，PNG为辅
- **文件大小**: SVG文件不超过200KB
- **分辨率**: 矢量图无限缩放，位图至少300dpi
- **色彩模式**: RGB用于屏幕，CMYK用于印刷

#### 兼容性要求
- **浏览器支持**: Chrome, Firefox, Safari, Edge
- **移动设备**: iOS, Android主流设备
- **屏幕分辨率**: 适配视网膜屏幕
- **辅助功能**: 支持屏幕阅读器

---

**文档版本**: v1.0  
**更新日期**: 2025年8月4日  
**维护人员**: 医美消费心理学项目组