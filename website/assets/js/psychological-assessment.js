/**
 * 心理评估工具可视化组件
 * Psychological Assessment Tool Visualization Components
 */

class PsychologicalAssessment {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            margin: options.margin || { top: 40, right: 40, bottom: 60, left: 60 },
            colors: options.colors || ['#98d8c8', '#b8a9c9', '#ff9a8b', '#f4a261', '#4ecdc4'],
            animationDuration: options.animationDuration || 1000,
            ...options
        };
        
        this.data = null;
        this.svg = null;
        this.scales = {};
        this.assessments = [];
        this.currentAssessment = 0;
        
        this.init();
    }
    
    init() {
        this.createSVG();
        this.createControls();
        this.bindEvents();
    }
    
    createSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
            .style('width', '100%')
            .style('height', 'auto');
            
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.options.margin.left}, ${this.options.margin.top})`);
            
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'assessment-tooltip')
            .style('position', 'absolute')
            .style('padding', '12px')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('border-radius', '8px')
            .style('font-size', '14px')
            .style('pointer-events', 'none')
            .style('opacity', 0);
    }
    
    createControls() {
        const controlsContainer = d3.select(this.container)
            .insert('div', ':first-child')
            .attr('class', 'assessment-controls')
            .style('margin-bottom', '20px');
            
        controlsContainer.append('div')
            .attr('class', 'assessment-progress')
            .style('margin-bottom', '15px');
            
        controlsContainer.append('div')
            .attr('class', 'assessment-buttons')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('justify-content', 'center');
    }
    
    bindEvents() {
        // 事件绑定将在子类中实现
    }
    
    setData(data) {
        this.data = data;
        this.assessments = data.assessments || [];
        this.updateProgress();
        this.render();
    }
    
    updateProgress() {
        const progressContainer = d3.select(this.container)
            .select('.assessment-progress');
            
        progressContainer.html('');
        
        const progressBar = progressContainer.append('div')
            .style('width', '100%')
            .style('height', '8px')
            .style('background', '#e9ecef')
            .style('border-radius', '4px')
            .style('overflow', 'hidden');
            
        progressBar.append('div')
            .style('width', `${((this.currentAssessment + 1) / this.assessments.length) * 100}%`)
            .style('height', '100%')
            .style('background', '#98d8c8')
            .style('transition', 'width 0.3s ease');
            
        progressContainer.append('div')
            .style('text-align', 'center')
            .style('margin-top', '10px')
            .style('font-size', '14px')
            .style('color', '#6c757d')
            .text(`评估进度: ${this.currentAssessment + 1} / ${this.assessments.length}`);
    }
    
    render() {
        this.mainGroup.html('');
        this.renderAssessment();
    }
    
    renderAssessment() {
        // 基础渲染方法，将在子类中实现
    }
    
    nextAssessment() {
        if (this.currentAssessment < this.assessments.length - 1) {
            this.currentAssessment++;
            this.updateProgress();
            this.render();
        }
    }
    
    previousAssessment() {
        if (this.currentAssessment > 0) {
            this.currentAssessment--;
            this.updateProgress();
            this.render();
        }
    }
    
    showTooltip(event, content) {
        this.tooltip
            .html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .style('opacity', 1);
    }
    
    hideTooltip() {
        this.tooltip.style('opacity', 0);
    }
    
    exportResults() {
        const results = {
            assessments: this.assessments,
            currentAssessment: this.currentAssessment,
            timestamp: new Date().toISOString(),
            scores: this.calculateScores()
        };
        
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'psychological-assessment-results.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    calculateScores() {
        // 计算评估分数，将在子类中实现
        return {};
    }
}

// 人格特质评估可视化
class PersonalityAssessment extends PsychologicalAssessment {
    constructor(containerId, options = {}) {
        super(containerId, options);
        this.traits = ['开放性', '尽责性', '外向性', '宜人性', '神经质'];
        this.traitColors = {
            '开放性': '#98d8c8',
            '尽责性': '#b8a9c9',
            '外向性': '#ff9a8b',
            '宜人性': '#f4a261',
            '神经质': '#4ecdc4'
        };
    }
    
    renderAssessment() {
        const assessment = this.assessments[this.currentAssessment];
        if (!assessment) return;
        
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建雷达图
        this.renderRadarChart(assessment, width, height);
        
        // 创建详细分数表
        this.renderScoreTable(assessment);
        
        // 创建导航按钮
        this.renderNavigationButtons();
    }
    
    renderRadarChart(assessment, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        const angleScale = d3.scaleLinear()
            .domain([0, this.traits.length])
            .range([0, 2 * Math.PI]);
            
        const radiusScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, radius]);
        
        // 绘制网格
        const gridGroup = this.mainGroup.append('g')
            .attr('class', 'radar-grid');
            
        for (let i = 1; i <= 5; i++) {
            const r = radius * (i / 5);
            gridGroup.append('circle')
                .attr('cx', centerX)
                .attr('cy', centerY)
                .attr('r', r)
                .attr('fill', 'none')
                .attr('stroke', '#e9ecef')
                .attr('stroke-width', 1);
        }
        
        // 绘制轴线
        this.traits.forEach((trait, i) => {
            const angle = angleScale(i) - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.mainGroup.append('line')
                .attr('x1', centerX)
                .attr('y1', centerY)
                .attr('x2', x)
                .attr('y2', y)
                .attr('stroke', '#e9ecef')
                .attr('stroke-width', 1);
                
            // 标签
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            
            this.mainGroup.append('text')
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-size', '14px')
                .style('fill', '#2c3e50')
                .text(trait);
        });
        
        // 绘制数据
        const dataPoints = assessment.traits || {};
        const lineGenerator = d3.line()
            .x((d, i) => centerX + Math.cos(angleScale(i) - Math.PI / 2) * radiusScale(d.value))
            .y((d, i) => centerY + Math.sin(angleScale(i) - Math.PI / 2) * radiusScale(d.value))
            .curve(d3.curveLinearClosed);
            
        const lineData = this.traits.map(trait => ({
            trait,
            value: dataPoints[trait] || 0
        }));
        
        // 绘制填充区域
        this.mainGroup.append('path')
            .datum(lineData)
            .attr('d', lineGenerator)
            .attr('fill', 'rgba(152, 216, 200, 0.3)')
            .attr('stroke', '#98d8c8')
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        // 绘制数据点
        this.mainGroup.selectAll('.data-point')
            .data(lineData)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', (d, i) => centerX + Math.cos(angleScale(i) - Math.PI / 2) * radiusScale(d.value))
            .attr('cy', (d, i) => centerY + Math.sin(angleScale(i) - Math.PI / 2) * radiusScale(d.value))
            .attr('r', 0)
            .attr('fill', (d, i) => this.traitColors[d.trait])
            .on('mouseover', (event, d) => {
                this.showTooltip(event, `${d.trait}: ${d.value}分`);
            })
            .on('mouseout', () => {
                this.hideTooltip();
            })
            .transition()
            .duration(this.options.animationDuration)
            .attr('r', 6);
    }
    
    renderScoreTable(assessment) {
        const tableData = this.traits.map(trait => ({
            trait,
            score: assessment.traits[trait] || 0,
            level: this.getScoreLevel(assessment.traits[trait] || 0)
        }));
        
        const table = this.mainGroup.append('g')
            .attr('transform', `translate(${this.options.width - this.options.margin.left - this.options.margin.right - 200}, 20)`);
            
        table.append('text')
            .attr('x', 100)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('fill', '#2c3e50')
            .text('详细分数');
            
        const rows = table.selectAll('.score-row')
            .data(tableData)
            .enter()
            .append('g')
            .attr('class', 'score-row')
            .attr('transform', (d, i) => `translate(0, ${30 + i * 25})`);
            
        rows.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', '14px')
            .style('fill', '#2c3e50')
            .text(d => d.trait);
            
        rows.append('rect')
            .attr('x', 80)
            .attr('y', -10)
            .attr('width', 100)
            .attr('height', 20)
            .attr('fill', '#e9ecef')
            .attr('rx', 10);
            
        rows.append('rect')
            .attr('x', 80)
            .attr('y', -10)
            .attr('width', d => (d.score / 100) * 100)
            .attr('height', 20)
            .attr('fill', d => this.traitColors[d.trait])
            .attr('rx', 10);
            
        rows.append('text')
            .attr('x', 130)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .text(d => d.score);
    }
    
    renderNavigationButtons() {
        const buttonsContainer = d3.select(this.container)
            .select('.assessment-buttons');
            
        buttonsContainer.html('');
        
        // 上一题按钮
        const prevButton = buttonsContainer.append('button')
            .attr('class', 'nav-button prev')
            .style('padding', '8px 16px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .style('opacity', this.currentAssessment === 0 ? 0.5 : 1)
            .text('上一题');
            
        if (this.currentAssessment > 0) {
            prevButton.on('click', () => this.previousAssessment());
        }
        
        // 下一题按钮
        const nextButton = buttonsContainer.append('button')
            .attr('class', 'nav-button next')
            .style('padding', '8px 16px')
            .style('background', '#98d8c8')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .style('opacity', this.currentAssessment === this.assessments.length - 1 ? 0.5 : 1)
            .text('下一题');
            
        if (this.currentAssessment < this.assessments.length - 1) {
            nextButton.on('click', () => this.nextAssessment());
        }
        
        // 完成按钮
        if (this.currentAssessment === this.assessments.length - 1) {
            const completeButton = buttonsContainer.append('button')
                .attr('class', 'complete-button')
                .style('padding', '8px 16px')
                .style('background', '#28a745')
                .style('color', 'white')
                .style('border', 'none')
                .style('border-radius', '6px')
                .style('cursor', 'pointer')
                .text('完成评估');
                
            completeButton.on('click', () => {
                this.exportResults();
                this.showResults();
            });
        }
    }
    
    getScoreLevel(score) {
        if (score >= 80) return '很高';
        if (score >= 60) return '较高';
        if (score >= 40) return '中等';
        if (score >= 20) return '较低';
        return '很低';
    }
    
    calculateScores() {
        const scores = {};
        this.assessments.forEach(assessment => {
            Object.keys(assessment.traits).forEach(trait => {
                scores[trait] = (scores[trait] || 0) + assessment.traits[trait];
            });
        });
        
        Object.keys(scores).forEach(trait => {
            scores[trait] = Math.round(scores[trait] / this.assessments.length);
        });
        
        return scores;
    }
    
    showResults() {
        const scores = this.calculateScores();
        const resultsHTML = `
            <div class="assessment-results">
                <h3>评估结果</h3>
                <div class="result-summary">
                    ${Object.entries(scores).map(([trait, score]) => `
                        <div class="result-item">
                            <span class="trait-name">${trait}</span>
                            <span class="trait-score">${score}分</span>
                            <span class="trait-level">${this.getScoreLevel(score)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.mainGroup.append('foreignObject')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.options.width - this.options.margin.left - this.options.margin.right)
            .attr('height', this.options.height - this.options.margin.top - this.options.margin.bottom)
            .html(resultsHTML);
    }
}

// 风险评估可视化
class RiskAssessment extends PsychologicalAssessment {
    constructor(containerId, options = {}) {
        super(containerId, options);
        this.riskFactors = ['生理风险', '心理风险', '社会风险', '经济风险', '时间风险'];
        this.riskLevels = ['低', '中', '高'];
    }
    
    renderAssessment() {
        const assessment = this.assessments[this.currentAssessment];
        if (!assessment) return;
        
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建风险矩阵
        this.renderRiskMatrix(assessment, width, height);
        
        // 创建风险等级分布
        this.renderRiskDistribution(assessment);
        
        // 创建导航按钮
        this.renderNavigationButtons();
    }
    
    renderRiskMatrix(assessment, width, height) {
        const matrixWidth = width * 0.6;
        const matrixHeight = height * 0.6;
        const cellWidth = matrixWidth / this.riskFactors.length;
        const cellHeight = matrixHeight / this.riskLevels.length;
        
        const matrixGroup = this.mainGroup.append('g')
            .attr('transform', `translate(${width * 0.2}, ${height * 0.1})`);
            
        // 绘制矩阵背景
        this.riskLevels.forEach((level, levelIndex) => {
            this.riskFactors.forEach((factor, factorIndex) => {
                const x = factorIndex * cellWidth;
                const y = levelIndex * cellHeight;
                
                const riskData = assessment.risks[`${factor}-${level}`] || 0;
                const intensity = riskData / 100;
                
                matrixGroup.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', cellWidth - 2)
                    .attr('height', cellHeight - 2)
                    .attr('fill', this.getRiskColor(intensity))
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1)
                    .on('mouseover', (event) => {
                        this.showTooltip(event, `${factor} - ${level}风险: ${riskData}%`);
                    })
                    .on('mouseout', () => {
                        this.hideTooltip();
                    });
            });
        });
        
        // 添加标签
        this.riskFactors.forEach((factor, index) => {
            matrixGroup.append('text')
                .attr('x', index * cellWidth + cellWidth / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('fill', '#2c3e50')
                .text(factor);
        });
        
        this.riskLevels.forEach((level, index) => {
            matrixGroup.append('text')
                .attr('x', -10)
                .attr('y', index * cellHeight + cellHeight / 2)
                .attr('text-anchor', 'end')
                .attr('dominant-baseline', 'middle')
                .style('font-size', '12px')
                .style('fill', '#2c3e50')
                .text(level);
        });
    }
    
    renderRiskDistribution(assessment) {
        const pieWidth = width * 0.25;
        const pieHeight = height * 0.25;
        const radius = Math.min(pieWidth, pieHeight) / 2;
        
        const pieGroup = this.mainGroup.append('g')
            .attr('transform', `translate(${width * 0.75}, ${height * 0.35})`);
            
        const riskCounts = {};
        Object.keys(assessment.risks).forEach(key => {
            const value = assessment.risks[key];
            const level = key.split('-')[1];
            riskCounts[level] = (riskCounts[level] || 0) + value;
        });
        
        const pieData = Object.entries(riskCounts).map(([level, value]) => ({
            level,
            value,
            percentage: (value / Object.values(riskCounts).reduce((a, b) => a + b, 0)) * 100
        }));
        
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);
            
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
            
        const arcs = pieGroup.selectAll('.arc')
            .data(pie(pieData))
            .enter()
            .append('g')
            .attr('class', 'arc');
            
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => this.getRiskColorByLevel(d.data.level))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '12px')
            .style('fill', '#fff')
            .style('font-weight', 'bold')
            .text(d => `${d.data.level} ${Math.round(d.data.percentage)}%`);
    }
    
    getRiskColor(intensity) {
        if (intensity >= 0.8) return '#dc3545';
        if (intensity >= 0.6) return '#fd7e14';
        if (intensity >= 0.4) return '#ffc107';
        if (intensity >= 0.2) return '#28a745';
        return '#17a2b8';
    }
    
    getRiskColorByLevel(level) {
        switch (level) {
            case '高': return '#dc3545';
            case '中': return '#ffc107';
            case '低': return '#28a745';
            default: return '#6c757d';
        }
    }
    
    calculateScores() {
        const scores = {};
        this.assessments.forEach(assessment => {
            Object.keys(assessment.risks).forEach(riskKey => {
                scores[riskKey] = (scores[riskKey] || 0) + assessment.risks[riskKey];
            });
        });
        
        Object.keys(scores).forEach(riskKey => {
            scores[riskKey] = Math.round(scores[riskKey] / this.assessments.length);
        });
        
        return scores;
    }
}

// 情绪状态评估可视化
class EmotionalStateAssessment extends PsychologicalAssessment {
    constructor(containerId, options = {}) {
        super(containerId, options);
        this.emotions = ['喜悦', '悲伤', '愤怒', '恐惧', '惊讶', '厌恶'];
        this.emotionColors = {
            '喜悦': '#ffd700',
            '悲伤': '#4169e1',
            '愤怒': '#dc143c',
            '恐惧': '#800080',
            '惊讶': '#ff4500',
            '厌恶': '#228b22'
        };
    }
    
    renderAssessment() {
        const assessment = this.assessments[this.currentAssessment];
        if (!assessment) return;
        
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建情绪轮盘
        this.renderEmotionWheel(assessment, width, height);
        
        // 创建情绪时间线
        this.renderEmotionTimeline(assessment);
        
        // 创建导航按钮
        this.renderNavigationButtons();
    }
    
    renderEmotionWheel(assessment, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        const wheelGroup = this.mainGroup.append('g')
            .attr('transform', `translate(${centerX}, ${centerY})`);
            
        const angleScale = d3.scaleLinear()
            .domain([0, this.emotions.length])
            .range([0, 2 * Math.PI]);
            
        const radiusScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, radius]);
            
        // 绘制情绪扇形
        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
            .startAngle(d => angleScale(d.index))
            .endAngle(d => angleScale(d.index + 1));
            
        const emotionData = this.emotions.map((emotion, index) => ({
            emotion,
            index,
            value: assessment.emotions[emotion] || 0
        }));
        
        const arcs = wheelGroup.selectAll('.emotion-arc')
            .data(emotionData)
            .enter()
            .append('g')
            .attr('class', 'emotion-arc');
            
        arcs.append('path')
            .attr('d', arcGenerator)
            .attr('fill', d => this.emotionColors[d.emotion])
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('opacity', 0.7)
            .on('mouseover', (event, d) => {
                this.showTooltip(event, `${d.emotion}: ${d.value}%`);
            })
            .on('mouseout', () => {
                this.hideTooltip();
            });
            
        // 添加标签
        arcs.append('text')
            .attr('transform', d => {
                const angle = angleScale(d.index + 0.5);
                const x = Math.cos(angle) * (radius * 0.7);
                const y = Math.sin(angle) * (radius * 0.7);
                return `translate(${x}, ${y})`;
            })
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '12px')
            .style('fill', '#fff')
            .style('font-weight', 'bold')
            .text(d => d.emotion);
    }
    
    renderEmotionTimeline(assessment) {
        const timelineWidth = this.options.width - this.options.margin.left - this.options.margin.right;
        const timelineHeight = 100;
        const timelineY = this.options.height - this.options.margin.top - this.options.margin.bottom - timelineHeight - 20;
        
        const timelineGroup = this.mainGroup.append('g')
            .attr('transform', `translate(0, ${timelineY})`);
            
        // 时间线背景
        timelineGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', timelineWidth)
            .attr('height', timelineHeight)
            .attr('fill', '#f8f9fa')
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', 1)
            .attr('rx', 5);
            
        // 情绪状态标记
        const emotionStates = assessment.timeline || [];
        const xScale = d3.scaleLinear()
            .domain([0, emotionStates.length - 1])
            .range([20, timelineWidth - 20]);
            
        emotionStates.forEach((state, index) => {
            const x = xScale(index);
            const y = timelineHeight / 2;
            
            timelineGroup.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 8)
                .attr('fill', this.emotionColors[state.emotion] || '#6c757d')
                .attr('stroke', '#fff')
                .attr('stroke-width', 2)
                .on('mouseover', (event) => {
                    this.showTooltip(event, `${state.time}: ${state.emotion} (强度: ${state.intensity})`);
                })
                .on('mouseout', () => {
                    this.hideTooltip();
                });
        });
    }
    
    calculateScores() {
        const scores = {};
        this.assessments.forEach(assessment => {
            Object.keys(assessment.emotions).forEach(emotion => {
                scores[emotion] = (scores[emotion] || 0) + assessment.emotions[emotion];
            });
        });
        
        Object.keys(scores).forEach(emotion => {
            scores[emotion] = Math.round(scores[emotion] / this.assessments.length);
        });
        
        return scores;
    }
}

// 导出类
window.PsychologicalAssessment = PsychologicalAssessment;
window.PersonalityAssessment = PersonalityAssessment;
window.RiskAssessment = RiskAssessment;
window.EmotionalStateAssessment = EmotionalStateAssessment;