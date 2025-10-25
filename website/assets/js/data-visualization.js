/**
 * 医美消费心理学数据可视化组件
 * Interactive Data Visualization Components for Medical Aesthetics Consumer Psychology
 */

class PsychologyDataVisualization {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.options = {
            width: options.width || this.container.offsetWidth,
            height: options.height || 400,
            margin: options.margin || { top: 40, right: 40, bottom: 60, left: 60 },
            colors: options.colors || this.getDefaultColors(),
            animationDuration: options.animationDuration || 800,
            responsive: options.responsive !== false,
            ...options
        };
        
        this.data = null;
        this.svg = null;
        this.tooltip = null;
        this.currentScale = 1;
        this.currentTransform = { x: 0, y: 0 };
        
        this.init();
    }
    
    getDefaultColors() {
        return [
            '#98d8c8', '#b8a9c9', '#ff9a8b', '#f4a261', 
            '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'
        ];
    }
    
    init() {
        this.createSVG();
        this.createTooltip();
        this.setupEventListeners();
        
        if (this.options.responsive) {
            this.setupResponsive();
        }
    }
    
    createSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .attr('class', 'psychology-chart')
            .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');
        
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.options.margin.left}, ${this.options.margin.top})`);
        
        this.chartWidth = this.options.width - this.options.margin.left - this.options.margin.right;
        this.chartHeight = this.options.height - this.options.margin.top - this.options.margin.bottom;
    }
    
    createTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0);
    }
    
    setupEventListeners() {
        if (this.options.zoomable) {
            this.setupZoom();
        }
    }
    
    setupResponsive() {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                this.updateDimensions(width);
            }
        });
        
        resizeObserver.observe(this.container);
    }
    
    updateDimensions(width) {
        this.options.width = width;
        this.svg.attr('width', width);
        this.chartWidth = width - this.options.margin.left - this.options.margin.right;
        
        if (this.data) {
            this.render();
        }
    }
    
    setupZoom() {
        const zoom = d3.zoom()
            .scaleExtent([0.5, 4])
            .on('zoom', (event) => {
                this.currentScale = event.transform.k;
                this.currentTransform = { x: event.transform.x, y: event.transform.y };
                this.mainGroup.attr('transform', event.transform);
            });
        
        this.svg.call(zoom);
    }
    
    setData(data) {
        this.data = this.processData(data);
        this.render();
    }
    
    processData(data) {
        // 数据预处理，可根据具体需求重写
        return data;
    }
    
    render() {
        // 基础渲染方法，子类需要重写
        this.clear();
        if (!this.data) return;
        
        this.renderChart();
        this.renderAxes();
        this.renderLegend();
        this.addInteractions();
    }
    
    clear() {
        this.mainGroup.selectAll('*').remove();
    }
    
    renderChart() {
        // 子类实现具体的图表渲染
        console.warn('renderChart() method should be implemented by subclass');
    }
    
    renderAxes() {
        // 子类实现坐标轴渲染
    }
    
    renderLegend() {
        // 子类实现图例渲染
    }
    
    addInteractions() {
        // 子类实现交互功能
    }
    
    showTooltip(event, content) {
        this.tooltip
            .html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    hideTooltip() {
        this.tooltip
            .transition()
            .duration(200)
            .style('opacity', 0);
    }
    
    export(format = 'png') {
        const svgElement = this.svg.node();
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            
            if (format === 'png') {
                const link = document.createElement('a');
                link.download = 'chart.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    }
}

// 雷达图类
class RadarChart extends PsychologyDataVisualization {
    renderChart() {
        const angleScale = d3.scaleLinear()
            .domain([0, this.data.length])
            .range([0, 2 * Math.PI]);
        
        const radiusScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d3.max(d.values))])
            .range([0, Math.min(this.chartWidth, this.chartHeight) / 2]);
        
        const line = d3.lineRadial()
            .angle((d, i) => angleScale(i))
            .radius(d => radiusScale(d))
            .curve(d3.curveLinearClosed);
        
        // 绘制网格
        const levels = 5;
        for (let i = 0; i <= levels; i++) {
            const radius = (radiusScale.range()[1] / levels) * i;
            this.mainGroup.append('circle')
                .attr('r', radius)
                .attr('class', 'radar-grid')
                .style('fill', 'none')
                .style('stroke', '#e0e0e0')
                .style('stroke-width', 1);
        }
        
        // 绘制轴线
        this.data.forEach((d, i) => {
            const angle = angleScale(i);
            const x = Math.cos(angle - Math.PI / 2) * radiusScale.range()[1];
            const y = Math.sin(angle - Math.PI / 2) * radiusScale.range()[1];
            
            this.mainGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', y)
                .attr('class', 'radar-axis')
                .style('stroke', '#e0e0e0')
                .style('stroke-width', 1);
            
            // 添加标签
            this.mainGroup.append('text')
                .attr('x', x * 1.1)
                .attr('y', y * 1.1)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('class', 'radar-label')
                .style('font-size', '12px')
                .style('fill', '#666')
                .text(d.category);
        });
        
        // 绘制数据区域
        this.data.forEach((series, seriesIndex) => {
            const color = this.options.colors[seriesIndex % this.options.colors.length];
            
            this.mainGroup.append('path')
                .datum(series.values)
                .attr('d', line)
                .attr('class', 'radar-area')
                .style('fill', color)
                .style('fill-opacity', 0.3)
                .style('stroke', color)
                .style('stroke-width', 2)
                .style('transition', 'all 0.3s ease');
            
            // 添加数据点
            series.values.forEach((value, i) => {
                const angle = angleScale(i);
                const radius = radiusScale(value);
                const x = Math.cos(angle - Math.PI / 2) * radius;
                const y = Math.sin(angle - Math.PI / 2) * radius;
                
                this.mainGroup.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 4)
                    .style('fill', color)
                    .style('stroke', 'white')
                    .style('stroke-width', 2)
                    .style('cursor', 'pointer')
                    .on('mouseover', (event) => {
                        this.showTooltip(event, `
                            <div class="tooltip-title">${series.category}</div>
                            <div class="tooltip-value">${this.data[i].category}: ${value}</div>
                        `);
                        d3.select(event.target).attr('r', 6);
                    })
                    .on('mouseout', (event) => {
                        this.hideTooltip();
                        d3.select(event.target).attr('r', 4);
                    });
            });
        });
    }
}

// 时间序列图类
class TimeSeriesChart extends PsychologyDataVisualization {
    renderChart() {
        const parseDate = d3.timeParse('%Y-%m-%d');
        
        this.data.forEach(d => {
            d.date = parseDate(d.date);
        });
        
        const xScale = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([0, this.chartWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value)])
            .range([this.chartHeight, 0]);
        
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // 绘制线条
        this.mainGroup.append('path')
            .datum(this.data)
            .attr('d', line)
            .attr('class', 'time-series-line')
            .style('fill', 'none')
            .style('stroke', this.options.colors[0])
            .style('stroke-width', 2);
        
        // 添加数据点
        this.mainGroup.selectAll('.time-series-point')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('class', 'time-series-point')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .style('fill', this.options.colors[0])
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, `
                    <div class="tooltip-title">${d.date.toLocaleDateString()}</div>
                    <div class="tooltip-value">数值: ${d.value}</div>
                `);
                d3.select(event.target).attr('r', 6);
            })
            .on('mouseout', (event) => {
                this.hideTooltip();
                d3.select(event.target).attr('r', 4);
            });
        
        // 保存比例尺供坐标轴使用
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    renderAxes() {
        if (!this.xScale || !this.yScale) return;
        
        // X轴
        this.mainGroup.append('g')
            .attr('transform', `translate(0, ${this.chartHeight})`)
            .call(d3.axisBottom(this.xScale)
                .ticks(6)
                .tickFormat(d3.timeFormat('%Y-%m')))
            .selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#666');
        
        // Y轴
        this.mainGroup.append('g')
            .call(d3.axisLeft(this.yScale))
            .selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#666');
    }
}

// 热力图类
class HeatMapChart extends PsychologyDataVisualization {
    renderChart() {
        const categories = [...new Set(this.data.map(d => d.category))];
        const periods = [...new Set(this.data.map(d => d.period))];
        
        const xScale = d3.scaleBand()
            .domain(periods)
            .range([0, this.chartWidth])
            .padding(0.1);
        
        const yScale = d3.scaleBand()
            .domain(categories)
            .range([0, this.chartHeight])
            .padding(0.1);
        
        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(this.data, d => d.value)])
            .interpolator(d3.interpolateBlues);
        
        // 绘制热力图单元格
        this.mainGroup.selectAll('.heatmap-cell')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'heatmap-cell')
            .attr('x', d => xScale(d.period))
            .attr('y', d => yScale(d.category))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', d => colorScale(d.value))
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, `
                    <div class="tooltip-title">${d.category} - ${d.period}</div>
                    <div class="tooltip-value">数值: ${d.value}</div>
                `);
                d3.select(event.target).style('stroke-width', 3);
            })
            .on('mouseout', (event) => {
                this.hideTooltip();
                d3.select(event.target).style('stroke-width', 2);
            });
        
        // 添加X轴标签
        this.mainGroup.selectAll('.x-label')
            .data(periods)
            .enter()
            .append('text')
            .attr('class', 'x-label heatmap-label')
            .attr('x', d => xScale(d) + xScale.bandwidth() / 2)
            .attr('y', this.chartHeight + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(d => d);
        
        // 添加Y轴标签
        this.mainGroup.selectAll('.y-label')
            .data(categories)
            .enter()
            .append('text')
            .attr('class', 'y-label heatmap-label')
            .attr('x', -10)
            .attr('y', d => yScale(d) + yScale.bandwidth() / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(d => d);
    }
}

// 网络图类
class NetworkChart extends PsychologyDataVisualization {
    renderChart() {
        const simulation = d3.forceSimulation(this.data.nodes)
            .force('link', d3.forceLink(this.data.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.chartWidth / 2, this.chartHeight / 2));
        
        // 绘制连接线
        const link = this.mainGroup.selectAll('.network-link')
            .data(this.data.links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .style('stroke', '#ccc')
            .style('stroke-width', d => Math.sqrt(d.value) * 2)
            .style('stroke-opacity', 0.6);
        
        // 绘制节点
        const node = this.mainGroup.selectAll('.network-node')
            .data(this.data.nodes)
            .enter()
            .append('circle')
            .attr('class', 'network-node')
            .attr('r', d => d.size || 10)
            .style('fill', (d, i) => this.options.colors[i % this.options.colors.length])
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));
        
        // 添加标签
        const label = this.mainGroup.selectAll('.network-label')
            .data(this.data.nodes)
            .enter()
            .append('text')
            .attr('class', 'network-label')
            .style('font-size', '12px')
            .style('fill', '#333')
            .style('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .text(d => d.name);
        
        // 添加交互
        node.on('mouseover', (event, d) => {
            this.showTooltip(event, `
                <div class="tooltip-title">${d.name}</div>
                <div class="tooltip-value">连接数: ${d.degree || 0}</div>
            `);
            d3.select(event.target).attr('r', (d.size || 10) * 1.2);
        })
        .on('mouseout', (event, d) => {
            this.hideTooltip();
            d3.select(event.target).attr('r', d.size || 10);
        });
        
        // 更新位置
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            label
                .attr('x', d => d.x)
                .attr('y', d => d.y + 5);
        });
    }
    
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// 工厂函数
function createChart(type, containerId, data, options) {
    switch (type) {
        case 'radar':
            return new RadarChart(containerId, options).setData(data);
        case 'timeSeries':
            return new TimeSeriesChart(containerId, options).setData(data);
        case 'heatmap':
            return new HeatMapChart(containerId, options).setData(data);
        case 'network':
            return new NetworkChart(containerId, options).setData(data);
        default:
            throw new Error(`Unsupported chart type: ${type}`);
    }
}

// 导出类和函数
window.PsychologyDataVisualization = PsychologyDataVisualization;
window.RadarChart = RadarChart;
window.TimeSeriesChart = TimeSeriesChart;
window.HeatMapChart = HeatMapChart;
window.NetworkChart = NetworkChart;
window.createChart = createChart;