/**
 * 技术发展时间线可视化组件
 * Technology Development Timeline Visualization Components
 */

class TechnologyTimeline {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 1200,
            height: options.height || 600,
            margin: options.margin || { top: 40, right: 40, bottom: 80, left: 80 },
            colors: options.colors || ['#98d8c8', '#b8a9c9', '#ff9a8b', '#f4a261', '#4ecdc4'],
            animationDuration: options.animationDuration || 1000,
            ...options
        };
        
        this.data = null;
        this.svg = null;
        this.scales = {};
        this.currentEra = 'all';
        this.technologies = [];
        this.selectedTechnology = null;
        
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
            .attr('class', 'timeline-tooltip')
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
            .attr('class', 'timeline-controls')
            .style('margin-bottom', '20px');
            
        // 时代筛选器
        const eraFilter = controlsContainer.append('div')
            .attr('class', 'era-filter')
            .style('margin-bottom', '15px');
            
        eraFilter.append('label')
            .style('margin-right', '10px')
            .style('font-weight', '500')
            .style('color', '#2c3e50')
            .text('时代筛选:');
            
        const eraButtons = eraFilter.append('div')
            .attr('class', 'era-buttons')
            .style('display', 'flex')
            .style('gap', '10px');
            
        ['all', 'early', 'middle', 'modern', 'future'].forEach(era => {
            const button = eraButtons.append('button')
                .attr('class', 'era-button')
                .attr('data-era', era)
                .style('padding', '6px 12px')
                .style('border', '1px solid #e9ecef')
                .style('background', 'white')
                .style('color', '#6c757d')
                .style('border-radius', '4px')
                .style('cursor', 'pointer')
                .style('transition', 'all 0.3s ease')
                .text(this.getEraLabel(era));
                
            if (era === 'all') {
                button.style('background', '#98d8c8')
                    .style('color', 'white')
                    .style('border-color', '#98d8c8');
            }
        });
        
        // 技术类型筛选器
        const typeFilter = controlsContainer.append('div')
            .attr('class', 'type-filter')
            .style('margin-bottom', '15px');
            
        typeFilter.append('label')
            .style('margin-right', '10px')
            .style('font-weight', '500')
            .style('color', '#2c3e50')
            .text('技术类型:');
            
        const typeButtons = typeFilter.append('div')
            .attr('class', 'type-buttons')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('flex-wrap', 'wrap');
            
        // 视图控制
        const viewControls = controlsContainer.append('div')
            .attr('class', 'view-controls')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('justify-content', 'center');
            
        viewControls.append('button')
            .attr('class', 'view-button')
            .attr('data-view', 'timeline')
            .style('padding', '8px 16px')
            .style('background', '#98d8c8')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .text('时间线视图');
            
        viewControls.append('button')
            .attr('class', 'view-button')
            .attr('data-view', 'network')
            .style('padding', '8px 16px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .text('网络视图');
            
        viewControls.append('button')
            .attr('class', 'view-button')
            .attr('data-view', 'comparison')
            .style('padding', '8px 16px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .text('对比视图');
    }
    
    bindEvents() {
        // 时代筛选
        d3.selectAll('.era-button').on('click', (event) => {
            const era = event.target.dataset.era;
            this.currentEra = era;
            
            d3.selectAll('.era-button')
                .style('background', 'white')
                .style('color', '#6c757d')
                .style('border-color', '#e9ecef');
                
            d3.select(event.target)
                .style('background', '#98d8c8')
                .style('color', 'white')
                .style('border-color', '#98d8c8');
                
            this.filterData();
        });
        
        // 视图切换
        d3.selectAll('.view-button').on('click', (event) => {
            const view = event.target.dataset.view;
            
            d3.selectAll('.view-button')
                .style('background', '#6c757d')
                .style('color', 'white');
                
            d3.select(event.target)
                .style('background', '#98d8c8')
                .style('color', 'white');
                
            this.switchView(view);
        });
    }
    
    getEraLabel(era) {
        const labels = {
            'all': '全部时代',
            'early': '早期发展',
            'middle': '中期发展',
            'modern': '现代技术',
            'future': '未来趋势'
        };
        return labels[era] || era;
    }
    
    setData(data) {
        this.data = data;
        this.technologies = data.technologies || [];
        this.setupScales();
        this.render();
        this.createTypeFilters();
    }
    
    setupScales() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 时间轴比例尺
        const years = this.technologies.map(t => new Date(t.year));
        this.scales.timeScale = d3.scaleTime()
            .domain(d3.extent(years))
            .range([0, width]);
            
        // Y轴比例尺（按技术类型）
        const types = [...new Set(this.technologies.map(t => t.type))];
        this.scales.typeScale = d3.scaleBand()
            .domain(types)
            .range([0, height])
            .padding(0.2);
            
        // 颜色比例尺
        this.scales.colorScale = d3.scaleOrdinal()
            .domain(types)
            .range(this.options.colors);
            
        // 大小比例尺（按影响程度）
        this.scales.sizeScale = d3.scaleLinear()
            .domain([0, 100])
            .range([4, 20]);
    }
    
    render() {
        this.mainGroup.html('');
        this.renderTimeline();
    }
    
    renderTimeline() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 绘制时间轴
        const timeAxis = d3.axisBottom(this.scales.timeScale)
            .tickFormat(d3.timeFormat('%Y'));
            
        this.mainGroup.append('g')
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(timeAxis);
            
        // 绘制技术节点
        const nodes = this.mainGroup.selectAll('.tech-node')
            .data(this.technologies)
            .enter()
            .append('g')
            .attr('class', 'tech-node')
            .attr('transform', d => {
                const x = this.scales.timeScale(new Date(d.year));
                const y = this.scales.typeScale(d.type) + this.scales.typeScale.bandwidth() / 2;
                return `translate(${x}, ${y})`;
            });
            
        // 技术节点圆圈
        nodes.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.scales.colorScale(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, this.getTechnologyTooltip(d));
                this.highlightConnections(d);
            })
            .on('mouseout', () => {
                this.hideTooltip();
                this.clearHighlights();
            })
            .on('click', (event, d) => {
                this.selectTechnology(d);
            })
            .transition()
            .duration(this.options.animationDuration)
            .attr('r', d => this.scales.sizeScale(d.impact));
            
        // 技术标签
        nodes.append('text')
            .attr('x', 0)
            .attr('y', d => this.scales.sizeScale(d.impact) + 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2c3e50')
            .style('opacity', 0)
            .text(d => d.name)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        // 绘制连接线
        this.renderConnections();
        
        // 绘制时代背景
        this.renderEraBackground();
    }
    
    renderConnections() {
        const connections = [];
        this.technologies.forEach((tech, i) => {
            if (tech.influencedBy) {
                tech.influencedBy.forEach(influenceId => {
                    const sourceTech = this.technologies.find(t => t.id === influenceId);
                    if (sourceTech) {
                        connections.push({
                            source: sourceTech,
                            target: tech
                        });
                    }
                });
            }
        });
        
        const links = this.mainGroup.selectAll('.tech-link')
            .data(connections)
            .enter()
            .insert('line', '.tech-node')
            .attr('class', 'tech-link')
            .attr('x1', d => this.scales.timeScale(new Date(d.source.year)))
            .attr('y1', d => this.scales.typeScale(d.source.type) + this.scales.typeScale.bandwidth() / 2)
            .attr('x2', d => this.scales.timeScale(new Date(d.target.year)))
            .attr('y2', d => this.scales.typeScale(d.target.type) + this.scales.typeScale.bandwidth() / 2)
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', 1)
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 0.6);
    }
    
    renderEraBackground() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        const eras = [
            { name: '早期发展', start: 1970, end: 1990, color: 'rgba(152, 216, 200, 0.1)' },
            { name: '中期发展', start: 1990, end: 2010, color: 'rgba(184, 169, 201, 0.1)' },
            { name: '现代技术', start: 2010, end: 2020, color: 'rgba(255, 154, 139, 0.1)' },
            { name: '未来趋势', start: 2020, end: 2030, color: 'rgba(244, 162, 97, 0.1)' }
        ];
        
        eras.forEach(era => {
            const x1 = this.scales.timeScale(new Date(era.start, 0, 1));
            const x2 = this.scales.timeScale(new Date(era.end, 0, 1));
            
            this.mainGroup.insert('rect', '.tech-link')
                .attr('class', 'era-background')
                .attr('x', x1)
                .attr('y', 0)
                .attr('width', x2 - x1)
                .attr('height', height)
                .attr('fill', era.color)
                .style('opacity', 0)
                .transition()
                .duration(this.options.animationDuration)
                .style('opacity', 1);
                
            // 时代标签
            this.mainGroup.append('text')
                .attr('x', (x1 + x2) / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('fill', '#6c757d')
                .style('font-weight', '500')
                .text(era.name);
        });
    }
    
    createTypeFilters() {
        const types = [...new Set(this.technologies.map(t => t.type))];
        const typeButtons = d3.select('.type-buttons');
        
        typeButtons.html('');
        
        types.forEach(type => {
            const button = typeButtons.append('button')
                .attr('class', 'type-button')
                .attr('data-type', type)
                .style('padding', '4px 8px')
                .style('border', '1px solid #e9ecef')
                .style('background', 'white')
                .style('color', '#6c757d')
                .style('border-radius', '4px')
                .style('cursor', 'pointer')
                .style('font-size', '12px')
                .text(type);
                
            button.on('click', (event) => {
                this.toggleTypeFilter(type, event.target);
            });
        });
    }
    
    toggleTypeFilter(type, button) {
        const isActive = button.style('background') === 'rgb(152, 216, 200)';
        
        if (isActive) {
            button.style('background', 'white')
                .style('color', '#6c757d')
                .style('border-color', '#e9ecef');
        } else {
            button.style('background', '#98d8c8')
                .style('color', 'white')
                .style('border-color', '#98d8c8');
        }
        
        this.filterData();
    }
    
    filterData() {
        const activeTypes = [];
        d3.selectAll('.type-button').each(function() {
            if (this.style.background === 'rgb(152, 216, 200)') {
                activeTypes.push(this.dataset.type);
            }
        });
        
        let filteredData = this.technologies;
        
        // 按时代筛选
        if (this.currentEra !== 'all') {
            filteredData = filteredData.filter(tech => {
                const year = new Date(tech.year).getFullYear();
                switch (this.currentEra) {
                    case 'early': return year >= 1970 && year < 1990;
                    case 'middle': return year >= 1990 && year < 2010;
                    case 'modern': return year >= 2010 && year < 2020;
                    case 'future': return year >= 2020;
                    default: return true;
                }
            });
        }
        
        // 按类型筛选
        if (activeTypes.length > 0) {
            filteredData = filteredData.filter(tech => activeTypes.includes(tech.type));
        }
        
        this.updateVisualization(filteredData);
    }
    
    updateVisualization(filteredData) {
        // 更新节点透明度
        d3.selectAll('.tech-node')
            .style('opacity', d => filteredData.includes(d) ? 1 : 0.2);
            
        // 更新连接线透明度
        d3.selectAll('.tech-link')
            .style('opacity', d => 
                filteredData.includes(d.source) && filteredData.includes(d.target) ? 0.6 : 0.1
            );
    }
    
    switchView(view) {
        this.mainGroup.html('');
        
        switch (view) {
            case 'timeline':
                this.renderTimeline();
                break;
            case 'network':
                this.renderNetwork();
                break;
            case 'comparison':
                this.renderComparison();
                break;
        }
    }
    
    renderNetwork() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建力导向图
        const simulation = d3.forceSimulation(this.technologies)
            .force('link', d3.forceLink().id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));
            
        // 绘制连接线
        const links = [];
        this.technologies.forEach((tech, i) => {
            if (tech.influencedBy) {
                tech.influencedBy.forEach(influenceId => {
                    const sourceTech = this.technologies.find(t => t.id === influenceId);
                    if (sourceTech) {
                        links.push({
                            source: sourceTech,
                            target: tech
                        });
                    }
                });
            }
        });
        
        const link = this.mainGroup.selectAll('.network-link')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', 1);
            
        // 绘制节点
        const node = this.mainGroup.selectAll('.network-node')
            .data(this.technologies)
            .enter()
            .append('g')
            .attr('class', 'network-node')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));
                
        node.append('circle')
            .attr('r', d => this.scales.sizeScale(d.impact))
            .attr('fill', d => this.scales.colorScale(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
            
        node.append('text')
            .attr('x', 0)
            .attr('y', d => this.scales.sizeScale(d.impact) + 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('fill', '#2c3e50')
            .text(d => d.name);
            
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
                
            node
                .attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
    }
    
    renderComparison() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建对比图表
        const types = [...new Set(this.technologies.map(t => t.type))];
        const barWidth = width / types.length * 0.8;
        const barSpacing = width / types.length;
        
        types.forEach((type, i) => {
            const typeTechs = this.technologies.filter(t => t.type === type);
            const avgImpact = d3.mean(typeTechs, t => t.impact);
            const avgYear = d3.mean(typeTechs, t => new Date(t.year).getFullYear());
            
            const x = i * barSpacing + barSpacing / 2;
            const y = height - (avgImpact / 100) * height * 0.8;
            
            // 绘制柱状图
            this.mainGroup.append('rect')
                .attr('x', x - barWidth / 2)
                .attr('y', y)
                .attr('width', barWidth)
                .attr('height', height - y)
                .attr('fill', this.scales.colorScale(type))
                .attr('opacity', 0.8);
                
            // 添加标签
            this.mainGroup.append('text')
                .attr('x', x)
                .attr('y', height + 20)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('fill', '#2c3e50')
                .text(type);
                
            // 添加数值
            this.mainGroup.append('text')
                .attr('x', x)
                .attr('y', y - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('fill', '#6c757d')
                .text(`${Math.round(avgImpact)}`);
        });
    }
    
    getTechnologyTooltip(tech) {
        return `
            <div style="font-weight: bold; margin-bottom: 5px;">${tech.name}</div>
            <div style="margin-bottom: 3px;">类型: ${tech.type}</div>
            <div style="margin-bottom: 3px;">年份: ${tech.year}</div>
            <div style="margin-bottom: 3px;">影响程度: ${tech.impact}%</div>
            <div style="margin-bottom: 3px;">描述: ${tech.description}</div>
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
    
    highlightConnections(tech) {
        d3.selectAll('.tech-link')
            .style('stroke', d => 
                (d.source === tech || d.target === tech) ? '#98d8c8' : '#e9ecef'
            )
            .style('stroke-width', d => 
                (d.source === tech || d.target === tech) ? 3 : 1
            );
            
        d3.selectAll('.tech-node')
            .style('opacity', d => {
                if (d === tech) return 1;
                return this.hasConnection(d, tech) ? 1 : 0.3;
            });
    }
    
    clearHighlights() {
        d3.selectAll('.tech-link')
            .style('stroke', '#e9ecef')
            .style('stroke-width', 1);
            
        d3.selectAll('.tech-node')
            .style('opacity', 1);
    }
    
    hasConnection(tech1, tech2) {
        return tech1.influencedBy && tech1.influencedBy.includes(tech2.id) ||
               tech2.influencedBy && tech2.influencedBy.includes(tech1.id);
    }
    
    selectTechnology(tech) {
        this.selectedTechnology = tech;
        this.showTechnologyDetails(tech);
    }
    
    showTechnologyDetails(tech) {
        const detailsHTML = `
            <div class="technology-details">
                <h3>${tech.name}</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>类型:</strong> ${tech.type}
                    </div>
                    <div class="detail-item">
                        <strong>年份:</strong> ${tech.year}
                    </div>
                    <div class="detail-item">
                        <strong>影响程度:</strong> ${tech.impact}%
                    </div>
                    <div class="detail-item">
                        <strong>描述:</strong> ${tech.description}
                    </div>
                </div>
            </div>
        `;
        
        // 在时间线旁边显示详细信息
        this.mainGroup.append('foreignObject')
            .attr('class', 'tech-details-panel')
            .attr('x', this.options.width - this.options.margin.left - this.options.margin.right - 300)
            .attr('y', 0)
            .attr('width', 300)
            .attr('height', 400)
            .html(detailsHTML);
    }
    
    // 力导向图拖拽函数
    dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    exportTimeline() {
        const svgData = this.svg.node().outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'technology-timeline.svg';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 导出类
window.TechnologyTimeline = TechnologyTimeline;