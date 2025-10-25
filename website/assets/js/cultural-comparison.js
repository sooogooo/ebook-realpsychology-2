/**
 * 文化差异对比分析可视化组件
 * Cultural Differences Comparison Analysis Visualization Components
 */

class CulturalComparison {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            margin: options.margin || { top: 40, right: 40, bottom: 80, left: 80 },
            colors: options.colors || ['#98d8c8', '#b8a9c9', '#ff9a8b', '#f4a261', '#4ecdc4'],
            animationDuration: options.animationDuration || 1000,
            ...options
        };
        
        this.data = null;
        this.svg = null;
        this.scales = {};
        this.currentChartType = 'radar';
        this.selectedCultures = [];
        
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
            .attr('class', 'cultural-tooltip')
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
            .attr('class', 'cultural-controls')
            .style('margin-bottom', '20px');
            
        // 图表类型控制
        const chartControls = controlsContainer.append('div')
            .attr('class', 'chart-type-controls')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('justify-content', 'center')
            .style('margin-bottom', '15px');
            
        ['radar', 'bar', 'heatmap'].forEach(type => {
            const button = chartControls.append('button')
                .attr('class', 'chart-type-control')
                .attr('data-type', type)
                .style('padding', '8px 16px')
                .style('border', '1px solid #e9ecef')
                .style('background', type === 'radar' ? '#98d8c8' : 'white')
                .style('color', type === 'radar' ? 'white' : '#6c757d')
                .style('border-radius', '6px')
                .style('cursor', 'pointer')
                .style('transition', 'all 0.3s ease')
                .text(this.getChartTypeLabel(type));
                
            button.on('click', (event) => {
                this.setChartType(type);
            });
        });
    }
    
    bindEvents() {
        // 事件绑定将在具体方法中实现
    }
    
    getChartTypeLabel(type) {
        const labels = {
            'radar': '雷达图',
            'bar': '柱状图',
            'heatmap': '热力图'
        };
        return labels[type] || type;
    }
    
    setData(data) {
        this.data = data;
        this.selectedCultures = data.cultures;
        this.setupScales();
        this.render();
    }
    
    setupScales() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 颜色比例尺
        this.scales.colorScale = d3.scaleOrdinal()
            .domain(this.selectedCultures.map(c => c.name))
            .range(this.options.colors);
            
        // 数值比例尺
        this.scales.valueScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, height * 0.4]);
    }
    
    render() {
        this.mainGroup.html('');
        
        switch (this.currentChartType) {
            case 'radar':
                this.renderRadarChart();
                break;
            case 'bar':
                this.renderBarChart();
                break;
            case 'heatmap':
                this.renderHeatmap();
                break;
        }
    }
    
    renderRadarChart() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        const radius = Math.min(width, height) / 2 - 50;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const metrics = this.data.metrics;
        const angleStep = (2 * Math.PI) / metrics.length;
        
        // 绘制雷达图网格
        const gridLevels = 5;
        for (let level = 1; level <= gridLevels; level++) {
            const levelRadius = (radius / gridLevels) * level;
            const gridData = [];
            
            for (let i = 0; i <= metrics.length; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + levelRadius * Math.cos(angle);
                const y = centerY + levelRadius * Math.sin(angle);
                gridData.push([x, y]);
            }
            
            this.mainGroup.append('path')
                .datum(gridData)
                .attr('class', 'radar-grid')
                .attr('d', d3.line())
                .attr('fill', 'none')
                .attr('stroke', '#e9ecef')
                .attr('stroke-width', 1);
        }
        
        // 绘制轴线
        metrics.forEach((metric, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.mainGroup.append('line')
                .attr('class', 'radar-axis')
                .attr('x1', centerX)
                .attr('y1', centerY)
                .attr('x2', x)
                .attr('y2', y)
                .attr('stroke', '#e9ecef')
                .attr('stroke-width', 1);
                
            // 添加标签
            const labelX = centerX + (radius + 20) * Math.cos(angle);
            const labelY = centerY + (radius + 20) * Math.sin(angle);
            
            this.mainGroup.append('text')
                .attr('class', 'radar-label')
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-size', '12px')
                .style('fill', '#2c3e50')
                .text(metric);
        });
        
        // 绘制数据区域
        this.selectedCultures.forEach((culture, cultureIndex) => {
            const cultureData = this.getCultureData(culture);
            const radarData = [];
            
            metrics.forEach((metric, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const value = cultureData[metric] || 0;
                const distance = (value / 100) * radius;
                const x = centerX + distance * Math.cos(angle);
                const y = centerY + distance * Math.sin(angle);
                radarData.push([x, y]);
            });
            
            // 闭合路径
            radarData.push(radarData[0]);
            
            // 绘制区域
            this.mainGroup.append('path')
                .datum(radarData)
                .attr('class', 'radar-area')
                .attr('d', d3.line())
                .attr('fill', this.scales.colorScale(culture.name))
                .attr('fill-opacity', 0.3)
                .attr('stroke', this.scales.colorScale(culture.name))
                .attr('stroke-width', 2)
                .style('opacity', 0)
                .transition()
                .duration(this.options.animationDuration)
                .style('opacity', 1);
                
            // 绘制数据点
            radarData.slice(0, -1).forEach((point, i) => {
                this.mainGroup.append('circle')
                    .attr('class', 'radar-point')
                    .attr('cx', point[0])
                    .attr('cy', point[1])
                    .attr('r', 4)
                    .attr('fill', this.scales.colorScale(culture.name))
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2)
                    .style('opacity', 0)
                    .on('mouseover', (event) => {
                        this.showTooltip(event, this.getMetricTooltip(metrics[i], cultureData[metrics[i]], culture.name));
                    })
                    .on('mouseout', () => {
                        this.hideTooltip();
                    })
                    .transition()
                    .duration(this.options.animationDuration)
                    .style('opacity', 1);
            });
        });
        
        // 添加图例
        this.addLegend();
    }
    
    renderBarChart() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        const metrics = this.data.metrics;
        
        const barWidth = width / (metrics.length * this.selectedCultures.length + metrics.length);
        const groupWidth = barWidth * this.selectedCultures.length;
        const groupSpacing = barWidth;
        
        // X轴比例尺
        this.scales.xScale = d3.scaleBand()
            .domain(metrics)
            .range([0, width])
            .padding(0.1);
            
        // Y轴比例尺
        this.scales.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
            
        // 绘制Y轴
        const yAxis = d3.axisLeft(this.scales.yScale)
            .ticks(10)
            .tickFormat(d => d + '%');
            
        this.mainGroup.append('g')
            .attr('class', 'y-axis')
            .call(yAxis);
            
        // 绘制X轴
        const xAxis = d3.axisBottom(this.scales.xScale);
            
        this.mainGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);
            
        // 绘制柱状图
        metrics.forEach((metric, i) => {
            const groupX = this.scales.xScale(metric);
            
            this.selectedCultures.forEach((culture, j) => {
                const cultureData = this.getCultureData(culture);
                const value = cultureData[metric] || 0;
                const barX = groupX + j * barWidth;
                const barHeight = height - this.scales.yScale(value);
                const barY = height - barHeight;
                
                this.mainGroup.append('rect')
                    .attr('class', 'comparison-bar')
                    .attr('x', barX)
                    .attr('y', height)
                    .attr('width', barWidth * 0.8)
                    .attr('height', 0)
                    .attr('fill', this.scales.colorScale(culture.name))
                    .attr('opacity', 0.8)
                    .on('mouseover', (event) => {
                        this.showTooltip(event, this.getMetricTooltip(metric, value, culture.name));
                    })
                    .on('mouseout', () => {
                        this.hideTooltip();
                    })
                    .transition()
                    .duration(this.options.animationDuration)
                    .attr('y', barY)
                    .attr('height', barHeight);
            });
        });
        
        // 添加图例
        this.addLegend();
    }
    
    renderHeatmap() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        const metrics = this.data.metrics;
        
        const cellWidth = width / metrics.length;
        const cellHeight = height / this.selectedCultures.length;
        
        // X轴比例尺
        this.scales.xScale = d3.scaleBand()
            .domain(metrics)
            .range([0, width]);
            
        // Y轴比例尺
        this.scales.yScale = d3.scaleBand()
            .domain(this.selectedCultures.map(c => c.name))
            .range([0, height]);
            
        // 颜色比例尺
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, 100]);
            
        // 绘制热力图
        metrics.forEach((metric, i) => {
            this.selectedCultures.forEach((culture, j) => {
                const cultureData = this.getCultureData(culture);
                const value = cultureData[metric] || 0;
                const x = this.scales.xScale(metric);
                const y = this.scales.yScale(culture.name);
                
                this.mainGroup.append('rect')
                    .attr('class', 'heatmap-cell')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', cellWidth)
                    .attr('height', cellHeight)
                    .attr('fill', colorScale(value))
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1)
                    .style('opacity', 0)
                    .on('mouseover', (event) => {
                        this.showTooltip(event, this.getMetricTooltip(metric, value, culture.name));
                    })
                    .on('mouseout', () => {
                        this.hideTooltip();
                    })
                    .transition()
                    .duration(this.options.animationDuration)
                    .style('opacity', 1);
                    
                // 添加数值标签
                this.mainGroup.append('text')
                    .attr('x', x + cellWidth / 2)
                    .attr('y', y + cellHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .style('font-size', '12px')
                    .style('fill', value > 50 ? 'white' : 'black')
                    .style('opacity', 0)
                    .text(value)
                    .transition()
                    .duration(this.options.animationDuration)
                    .style('opacity', 1);
            });
        });
        
        // 绘制X轴标签
        this.mainGroup.selectAll('.x-label')
            .data(metrics)
            .enter()
            .append('text')
            .attr('class', 'x-label')
            .attr('x', d => this.scales.xScale(d) + cellWidth / 2)
            .attr('y', height + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2c3e50')
            .text(d => d);
            
        // 绘制Y轴标签
        this.mainGroup.selectAll('.y-label')
            .data(this.selectedCultures.map(c => c.name))
            .enter()
            .append('text')
            .attr('class', 'y-label')
            .attr('x', -10)
            .attr('y', d => this.scales.yScale(d) + cellHeight / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2c3e50')
            .text(d => d);
            
        // 添加颜色图例
        this.addColorLegend();
    }
    
    getCultureData(culture) {
        switch (this.data.dimension) {
            case 'beauty-standards':
                return culture.beautyStandards;
            case 'consumption-motivation':
                return culture.motivations;
            case 'risk-perception':
                return culture.riskPerception;
            case 'decision-making':
                return culture.behaviors;
            default:
                return {};
        }
    }
    
    getMetricTooltip(metric, value, culture) {
        return `
            <div style="font-weight: bold; margin-bottom: 5px;">${culture}</div>
            <div style="margin-bottom: 3px;">${metric}: ${value}%</div>
            <div style="font-size: 12px; opacity: 0.8;">点击查看详情</div>
        `;
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
    
    addLegend() {
        const legendContainer = this.mainGroup.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.options.width - this.options.margin.left - this.options.margin.right - 150}, 20)`);
            
        this.selectedCultures.forEach((culture, i) => {
            const legendItem = legendContainer.append('g')
                .attr('transform', `translate(0, ${i * 25})`);
                
            legendItem.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', this.scales.colorScale(culture.name))
                .attr('rx', 2);
                
            legendItem.append('text')
                .attr('x', 20)
                .attr('y', 12)
                .style('font-size', '12px')
                .style('fill', '#2c3e50')
                .text(culture.name);
        });
    }
    
    addColorLegend() {
        const legendContainer = this.mainGroup.append('g')
            .attr('class', 'color-legend')
            .attr('transform', `translate(${this.options.width - this.options.margin.left - this.options.margin.right - 100}, 20)`);
            
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, 100]);
            
        const gradient = legendContainer.append('defs')
            .append('linearGradient')
            .attr('id', 'color-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 100);
            
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', colorScale(0));
            
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', colorScale(100));
            
        legendContainer.append('rect')
            .attr('width', 20)
            .attr('height', 100)
            .attr('fill', 'url(#color-gradient)');
            
        // 添加刻度
        [0, 25, 50, 75, 100].forEach(value => {
            legendContainer.append('text')
                .attr('x', 25)
                .attr('y', 100 - value + 5)
                .style('font-size', '10px')
                .style('fill', '#6c757d')
                .text(value);
        });
    }
    
    setChartType(type) {
        this.currentChartType = type;
        
        // 更新控制按钮状态
        d3.selectAll('.chart-type-control')
            .style('background', 'white')
            .style('color', '#6c757d');
            
        d3.select(`[data-type="${type}"]`)
            .style('background', '#98d8c8')
            .style('color', 'white');
            
        // 重新渲染
        this.render();
    }
    
    exportChart() {
        const svgData = this.svg.node().outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cultural-comparison-${this.currentChartType}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 导出类
window.CulturalComparison = CulturalComparison;