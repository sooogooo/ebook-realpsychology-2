/**
 * 情绪状态流程图可视化组件
 * Emotional State Flow Visualization Components
 */

class EmotionalFlow {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 1200,
            height: options.height || 600,
            margin: options.margin || { top: 40, right: 40, bottom: 40, left: 40 },
            colors: options.colors || {
                positive: '#98d8c8',
                neutral: '#b8a9c9',
                negative: '#ff9a8b',
                anxiety: '#f4a261',
                excitement: '#4ecdc4',
                satisfaction: '#a8dadc',
                fear: '#e76f51',
                confidence: '#457b9d'
            },
            animationDuration: options.animationDuration || 1000,
            nodeSize: options.nodeSize || 25,
            ...options
        };
        
        this.data = null;
        this.svg = null;
        this.scales = {};
        this.currentFlow = 'consultation';
        this.currentView = 'flow';
        this.selectedState = null;
        this.animationStep = 0;
        this.isPlaying = false;
        this.flowData = {};
        
        this.init();
    }
    
    init() {
        this.createSVG();
        this.createControls();
        this.bindEvents();
        this.loadFlowData();
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
            .attr('class', 'flow-group')
            .attr('transform', `translate(${this.options.margin.left}, ${this.options.margin.top})`);
            
        this.linksGroup = this.mainGroup.append('g')
            .attr('class', 'links-group');
            
        this.nodesGroup = this.mainGroup.append('g')
            .attr('class', 'nodes-group');
            
        this.labelsGroup = this.mainGroup.append('g')
            .attr('class', 'labels-group');
            
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'flow-tooltip')
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
            .attr('class', 'flow-controls')
            .style('margin-bottom', '20px');
            
        // 播放控制
        const playControls = controlsContainer.append('div')
            .attr('class', 'play-controls')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('gap', '10px')
            .style('margin-bottom', '15px');
            
        this.playButton = playControls.append('button')
            .attr('class', 'play-button')
            .attr('data-action', 'play')
            .style('padding', '8px 16px')
            .style('background', '#98d8c8')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .html('<span class="material-symbols-outlined">play_arrow</span> 播放动画');
            
        // 进度条
        this.progressBar = playControls.append('div')
            .attr('class', 'progress-bar')
            .style('flex', '1')
            .style('height', '6px')
            .style('background', '#e9ecef')
            .style('border-radius', '3px')
            .style('position', 'relative');
            
        this.progressFill = this.progressBar.append('div')
            .attr('class', 'progress-fill')
            .style('height', '100%')
            .style('background', '#98d8c8')
            .style('border-radius', '3px')
            .style('width', '0%');
            
        // 速度控制
        const speedControl = playControls.append('div')
            .attr('class', 'speed-control')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('gap', '5px');
            
        speedControl.append('label')
            .style('font-size', '12px')
            .style('color', '#6c757d')
            .text('速度:');
            
        this.speedSlider = speedControl.append('input')
            .attr('type', 'range')
            .attr('min', '0.5')
            .attr('max', '3')
            .attr('step', '0.5')
            .attr('value', '1')
            .style('width', '80px');
            
        // 视图控制
        const viewControls = controlsContainer.append('div')
            .attr('class', 'view-controls')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('justify-content', 'center');
            
        ['flow', 'network', 'timeline'].forEach(view => {
            const button = viewControls.append('button')
                .attr('class', 'view-button')
                .attr('data-view', view)
                .style('padding', '8px 16px')
                .style('border', '1px solid #e9ecef')
                .style('background', view === 'flow' ? '#98d8c8' : 'white')
                .style('color', view === 'flow' ? 'white' : '#6c757d')
                .style('border-radius', '6px')
                .style('cursor', 'pointer')
                .style('transition', 'all 0.3s ease')
                .text(this.getViewLabel(view));
        });
    }
    
    bindEvents() {
        // 播放控制
        this.playButton.on('click', () => {
            this.togglePlay();
        });
        
        // 速度控制
        this.speedSlider.on('input', (event) => {
            this.animationSpeed = parseFloat(event.target.value);
        });
        
        // 视图切换
        d3.selectAll('.view-button').on('click', (event) => {
            const view = event.target.dataset.view;
            this.switchView(view);
        });
        
        // 流程类型切换
        d3.selectAll('.flow-card').on('click', (event) => {
            const flowType = event.currentTarget.dataset.flow;
            this.switchFlow(flowType);
        });
    }
    
    getViewLabel(view) {
        const labels = {
            'flow': '流程图',
            'network': '网络图',
            'timeline': '时间线'
        };
        return labels[view] || view;
    }
    
    loadFlowData() {
        // 定义不同流程的情绪状态数据
        this.flowData = {
            consultation: {
                title: '咨询流程情绪状态图',
                description: '展示消费者在咨询过程中的情绪变化和心理状态',
                nodes: [
                    { id: 'initial', label: '初始好奇', type: 'neutral', intensity: 0.3, description: '对医美产生初步兴趣和好奇心' },
                    { id: 'research', label: '信息收集', type: 'neutral', intensity: 0.4, description: '主动收集医美相关信息和资料' },
                    { id: 'excitement', label: '期待兴奋', type: 'excitement', intensity: 0.7, description: '对可能的改变感到兴奋和期待' },
                    { id: 'anxiety', label: '焦虑担忧', type: 'anxiety', intensity: 0.6, description: '对风险和结果产生焦虑和担忧' },
                    { id: 'consultation', label: '专业咨询', type: 'neutral', intensity: 0.5, description: '与医生进行专业咨询和沟通' },
                    { id: 'realistic', label: '现实认知', type: 'neutral', intensity: 0.6, description: '建立对医美的现实认知和期望' },
                    { id: 'decision', label: '决策确认', type: 'confidence', intensity: 0.7, description: '做出明智的决策并确认治疗计划' }
                ],
                links: [
                    { source: 'initial', target: 'research', weight: 0.8 },
                    { source: 'research', target: 'excitement', weight: 0.7 },
                    { source: 'excitement', target: 'anxiety', weight: 0.6 },
                    { source: 'anxiety', target: 'consultation', weight: 0.9 },
                    { source: 'consultation', target: 'realistic', weight: 0.8 },
                    { source: 'realistic', target: 'decision', weight: 0.9 }
                ]
            },
            treatment: {
                title: '治疗流程情绪状态图',
                description: '展示治疗过程中的情绪状态和心理适应过程',
                nodes: [
                    { id: 'preparation', label: '术前准备', type: 'anxiety', intensity: 0.5, description: '术前心理准备和状态调整' },
                    { id: 'nervous', label: '紧张不安', type: 'fear', intensity: 0.7, description: '治疗前的紧张和不安情绪' },
                    { id: 'procedure', label: '治疗过程', type: 'neutral', intensity: 0.4, description: '接受治疗时的心理状态' },
                    { id: 'immediate', label: '即时反应', type: 'neutral', intensity: 0.3, description: '治疗完成后的即时心理反应' },
                    { id: 'discomfort', label: '不适感', type: 'negative', intensity: 0.6, description: '术后不适和恢复期情绪' },
                    { id: 'adjustment', label: '心理调适', type: 'neutral', intensity: 0.5, description: '对外貌改变的心理调适过程' },
                    { id: 'acceptance', label: '接受认同', type: 'positive', intensity: 0.8, description: '逐渐接受并认同新的外貌' }
                ],
                links: [
                    { source: 'preparation', target: 'nervous', weight: 0.8 },
                    { source: 'nervous', target: 'procedure', weight: 0.9 },
                    { source: 'procedure', target: 'immediate', weight: 0.7 },
                    { source: 'immediate', target: 'discomfort', weight: 0.6 },
                    { source: 'discomfort', target: 'adjustment', weight: 0.8 },
                    { source: 'adjustment', target: 'acceptance', weight: 0.9 }
                ]
            },
            recovery: {
                title: '恢复流程情绪状态图',
                description: '展示恢复期的情绪波动和心理调整过程',
                nodes: [
                    { id: 'recovery_start', label: '恢复初期', type: 'negative', intensity: 0.6, description: '恢复初期的情绪低落和不适' },
                    { id: 'impatience', label: '不耐烦', type: 'anxiety', intensity: 0.5, description: '对恢复过程的不耐烦和焦虑' },
                    { id: 'doubt', label: '怀疑犹豫', type: 'negative', intensity: 0.4, description: '对治疗效果的怀疑和犹豫' },
                    { id: 'improvement', label: '改善迹象', type: 'positive', intensity: 0.6, description: '看到改善迹象时的积极情绪' },
                    { id: 'hope', label: '希望期待', type: 'excitement', intensity: 0.7, description: '对未来效果的希望和期待' },
                    { id: 'patience', label: '耐心等待', type: 'neutral', intensity: 0.5, description: '学会耐心等待最终效果' },
                    { id: 'satisfaction', label: '满足感', type: 'satisfaction', intensity: 0.9, description: '对最终效果的满足和欣喜' }
                ],
                links: [
                    { source: 'recovery_start', target: 'impatience', weight: 0.7 },
                    { source: 'impatience', target: 'doubt', weight: 0.6 },
                    { source: 'doubt', target: 'improvement', weight: 0.5 },
                    { source: 'improvement', target: 'hope', weight: 0.8 },
                    { source: 'hope', target: 'patience', weight: 0.7 },
                    { source: 'patience', target: 'satisfaction', weight: 0.9 }
                ]
            },
            'long-term': {
                title: '长期影响情绪状态图',
                description: '展示医美对心理状态的长期影响和情绪稳定过程',
                nodes: [
                    { id: 'integration', label: '心理整合', type: 'neutral', intensity: 0.6, description: '将外貌改变整合到自我认知中' },
                    { id: 'confidence', label: '自信心提升', type: 'positive', intensity: 0.8, description: '自信心和自我形象的显著提升' },
                    { id: 'social', label: '社交改善', type: 'positive', intensity: 0.7, description: '社交活动的积极改善' },
                    { id: 'maintenance', label: '维护意识', type: 'neutral', intensity: 0.5, description: '对效果维护的长期意识' },
                    { id: 'stability', label: '情绪稳定', type: 'satisfaction', intensity: 0.9, description: '情绪状态的长期稳定' },
                    { id: 'wisdom', label: '经验智慧', type: 'confidence', intensity: 0.8, description: '从经历中获得的经验和智慧' },
                    { id: 'empowerment', label: '赋能成长', type: 'positive', intensity: 0.9, description: '个人成长和赋能的长期效果' }
                ],
                links: [
                    { source: 'integration', target: 'confidence', weight: 0.8 },
                    { source: 'confidence', target: 'social', weight: 0.7 },
                    { source: 'social', target: 'maintenance', weight: 0.6 },
                    { source: 'maintenance', target: 'stability', weight: 0.8 },
                    { source: 'stability', target: 'wisdom', weight: 0.7 },
                    { source: 'wisdom', target: 'empowerment', weight: 0.9 }
                ]
            }
        };
        
        this.setData(this.flowData[this.currentFlow]);
    }
    
    setData(data) {
        this.data = data;
        this.setupScales();
        this.render();
        this.updateHeader();
    }
    
    setupScales() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 颜色比例尺
        const emotionTypes = [...new Set(this.data.nodes.map(n => n.type))];
        this.scales.colorScale = d3.scaleOrdinal()
            .domain(emotionTypes)
            .domain(['positive', 'neutral', 'negative', 'anxiety', 'excitement', 'satisfaction', 'fear', 'confidence'])
            .range([
                this.options.colors.positive,
                this.options.colors.neutral,
                this.options.colors.negative,
                this.options.colors.anxiety,
                this.options.colors.excitement,
                this.options.colors.satisfaction,
                this.options.colors.fear,
                this.options.colors.confidence
            ]);
            
        // 大小比例尺（按情绪强度）
        this.scales.sizeScale = d3.scaleLinear()
            .domain([0, 1])
            .range([15, 35]);
            
        // 透明度比例尺
        this.scales.opacityScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0.3, 1]);
    }
    
    render() {
        this.mainGroup.html('');
        
        switch (this.currentView) {
            case 'flow':
                this.renderFlowChart();
                break;
            case 'network':
                this.renderNetworkChart();
                break;
            case 'timeline':
                this.renderTimelineChart();
                break;
        }
    }
    
    renderFlowChart() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建流程布局
        const nodeCount = this.data.nodes.length;
        const cols = Math.ceil(Math.sqrt(nodeCount));
        const rows = Math.ceil(nodeCount / cols);
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        
        // 计算节点位置
        const nodePositions = this.data.nodes.map((node, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            return {
                ...node,
                x: col * cellWidth + cellWidth / 2,
                y: row * cellHeight + cellHeight / 2
            };
        });
        
        // 绘制连接线
        const links = this.linksGroup.selectAll('.flow-link')
            .data(this.data.links)
            .enter()
            .append('path')
            .attr('class', 'flow-link')
            .attr('d', d => {
                const source = nodePositions.find(n => n.id === d.source);
                const target = nodePositions.find(n => n.id === d.target);
                if (!source || !target) return '';
                
                // 创建曲线连接
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;
                const offset = 30;
                
                return `M ${source.x} ${source.y} Q ${midX} ${midY - offset} ${target.x} ${target.y}`;
            })
            .attr('fill', 'none')
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', d => Math.max(1, d.weight * 4))
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 0.6);
            
        // 绘制节点
        const nodes = this.nodesGroup.selectAll('.flow-node')
            .data(nodePositions)
            .enter()
            .append('g')
            .attr('class', 'flow-node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('opacity', 0);
            
        // 节点圆圈
        nodes.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.scales.colorScale(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('cursor', 'pointer')
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, this.getNodeTooltip(d));
                this.highlightConnections(d);
            })
            .on('mouseout', () => {
                this.hideTooltip();
                this.clearHighlights();
            })
            .on('click', (event, d) => {
                this.selectState(d);
            })
            .transition()
            .duration(this.options.animationDuration)
            .attr('r', d => this.scales.sizeScale(d.intensity))
            .transition()
            .duration(200)
            .style('opacity', 1);
            
        // 节点标签
        nodes.append('text')
            .attr('x', 0)
            .attr('y', d => this.scales.sizeScale(d.intensity) + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', '500')
            .style('fill', '#2c3e50')
            .style('opacity', 0)
            .text(d => d.label)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        // 添加动画序列
        this.setupAnimation(nodes, links);
    }
    
    renderNetworkChart() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建力导向图
        const simulation = d3.forceSimulation(this.data.nodes)
            .force('link', d3.forceLink(this.data.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));
            
        // 绘制连接线
        const link = this.linksGroup.selectAll('.network-link')
            .data(this.data.links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', d => Math.max(1, d.weight * 3))
            .style('opacity', 0.6);
            
        // 绘制节点
        const node = this.nodesGroup.selectAll('.network-node')
            .data(this.data.nodes)
            .enter()
            .append('g')
            .attr('class', 'network-node')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));
                
        node.append('circle')
            .attr('r', d => this.scales.sizeScale(d.intensity))
            .attr('fill', d => this.scales.colorScale(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('cursor', 'pointer')
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, this.getNodeTooltip(d));
            })
            .on('mouseout', () => {
                this.hideTooltip();
            })
            .on('click', (event, d) => {
                this.selectState(d);
            });
            
        node.append('text')
            .attr('x', 0)
            .attr('y', d => this.scales.sizeScale(d.intensity) + 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('fill', '#2c3e50')
            .text(d => d.label);
            
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
                
            node
                .attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
        
        this.simulation = simulation;
    }
    
    renderTimelineChart() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 创建时间线
        const timelineData = this.data.nodes.map((node, i) => ({
            ...node,
            time: i,
            y: height / 2 + (Math.random() - 0.5) * 100
        }));
        
        // 时间轴
        const timeScale = d3.scaleLinear()
            .domain([0, timelineData.length - 1])
            .range([50, width - 50]);
            
        // 绘制时间轴
        this.mainGroup.append('line')
            .attr('x1', 50)
            .attr('y1', height / 2)
            .attr('x2', width - 50)
            .attr('y2', height / 2)
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', 2);
            
        // 绘制时间点
        const timePoints = this.mainGroup.selectAll('.time-point')
            .data(timelineData)
            .enter()
            .append('g')
            .attr('class', 'time-point')
            .attr('transform', d => `translate(${timeScale(d.time)}, ${height / 2})`);
            
        timePoints.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.scales.colorScale(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, this.getNodeTooltip(d));
            })
            .on('mouseout', () => {
                this.hideTooltip();
            })
            .on('click', (event, d) => {
                this.selectState(d);
            })
            .transition()
            .duration(this.options.animationDuration)
            .attr('r', d => this.scales.sizeScale(d.intensity));
            
        // 情绪曲线
        const line = d3.line()
            .x(d => timeScale(d.time))
            .y(d => d.y)
            .curve(d3.curveMonotoneX);
            
        this.mainGroup.append('path')
            .datum(timelineData)
            .attr('class', 'emotion-curve')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', '#98d8c8')
            .attr('stroke-width', 3)
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 0.8);
    }
    
    setupAnimation(nodes, links) {
        this.animationNodes = nodes;
        this.animationLinks = links;
        this.animationStep = 0;
        
        // 初始化动画状态
        nodes.style('opacity', 0);
        links.style('opacity', 0);
    }
    
    playAnimation() {
        if (!this.animationNodes || this.animationNodes.empty()) return;
        
        const speed = this.animationSpeed || 1;
        const delay = 1000 / speed;
        
        // 播放节点动画
        this.animationNodes.each((d, i) => {
            setTimeout(() => {
                this.animationNodes
                    .filter(node => node.id === d.id)
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
                    
                // 更新进度条
                this.updateProgress((i + 1) / this.animationNodes.size());
            }, i * delay);
        });
        
        // 播放连接线动画
        setTimeout(() => {
            this.animationLinks.each((d, i) => {
                setTimeout(() => {
                    this.animationLinks
                        .filter(link => link.source === d.source && link.target === d.target)
                        .transition()
                        .duration(500)
                        .style('opacity', 0.6);
                }, i * delay / 2);
            });
        }, this.animationNodes.size() * delay / 2);
        
        // 动画完成后重置
        setTimeout(() => {
            this.stopAnimation();
        }, this.animationNodes.size() * delay + 1000);
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
    
    startAnimation() {
        this.isPlaying = true;
        this.playButton.html('<span class="material-symbols-outlined">pause</span> 暂停动画');
        this.playAnimation();
    }
    
    stopAnimation() {
        this.isPlaying = false;
        this.playButton.html('<span class="material-symbols-outlined">play_arrow</span> 播放动画');
        this.updateProgress(0);
        
        // 重置所有元素为可见状态
        if (this.animationNodes) {
            this.animationNodes.style('opacity', 1);
        }
        if (this.animationLinks) {
            this.animationLinks.style('opacity', 0.6);
        }
    }
    
    updateProgress(progress) {
        this.progressFill.style('width', `${progress * 100}%`);
    }
    
    switchView(view) {
        this.currentView = view;
        
        // 更新按钮状态
        d3.selectAll('.view-button')
            .style('background', 'white')
            .style('color', '#6c757d');
            
        d3.select(`[data-view="${view}"]`)
            .style('background', '#98d8c8')
            .style('color', 'white');
            
        // 停止动画
        this.stopAnimation();
        
        // 重新渲染
        this.render();
    }
    
    switchFlow(flowType) {
        this.currentFlow = flowType;
        
        // 更新卡片状态
        d3.selectAll('.flow-card')
            .classed('active', false);
            
        d3.select(`[data-flow="${flowType}"]`)
            .classed('active', true);
            
        // 更新数据
        this.setData(this.flowData[flowType]);
        
        // 停止动画
        this.stopAnimation();
    }
    
    updateHeader() {
        // 更新页面标题和描述
        document.getElementById('flow-title').textContent = this.data.title;
        document.getElementById('flow-description').textContent = this.data.description;
    }
    
    getNodeTooltip(node) {
        return `
            <div style="font-weight: bold; margin-bottom: 5px;">${node.label}</div>
            <div style="margin-bottom: 3px;">类型: ${node.type}</div>
            <div style="margin-bottom: 3px;">强度: ${Math.round(node.intensity * 100)}%</div>
            <div style="margin-bottom: 3px;">描述: ${node.description}</div>
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
    
    highlightConnections(node) {
        // 高亮与节点相关的连接
        this.linksGroup.selectAll('.flow-link')
            .style('stroke', d => 
                (d.source === node.id || d.target === node.id) ? '#98d8c8' : '#e9ecef'
            )
            .style('stroke-width', d => 
                (d.source === node.id || d.target === node.id) ? Math.max(2, d.weight * 4) : Math.max(1, d.weight * 4)
            )
            .style('opacity', d => 
                (d.source === node.id || d.target === node.id) ? 1 : 0.3
            );
            
        // 高亮相关节点
        this.nodesGroup.selectAll('.flow-node')
            .style('opacity', d => {
                if (d.id === node.id) return 1;
                return this.data.links.some(link => 
                    (link.source === node.id && link.target === d.id) ||
                    (link.target === node.id && link.source === d.id)
                ) ? 1 : 0.3;
            });
    }
    
    clearHighlights() {
        this.linksGroup.selectAll('.flow-link')
            .style('stroke', '#e9ecef')
            .style('stroke-width', d => Math.max(1, d.weight * 4))
            .style('opacity', 0.6);
            
        this.nodesGroup.selectAll('.flow-node')
            .style('opacity', 1);
    }
    
    selectState(node) {
        this.selectedState = node;
        this.showStateDetails(node);
    }
    
    showStateDetails(node) {
        const detailsHTML = `
            <div class="state-details-content">
                <div class="state-header">
                    <h4>${node.label}</h4>
                    <span class="state-type" style="background: ${this.scales.colorScale(node.type)}">${node.type}</span>
                </div>
                <div class="state-info">
                    <div class="info-item">
                        <span class="info-label">情绪强度:</span>
                        <span class="info-value">${Math.round(node.intensity * 100)}%</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">描述:</span>
                        <span class="info-text">${node.description}</span>
                    </div>
                </div>
                <div class="state-characteristics">
                    <h5>情绪特征</h5>
                    <ul class="characteristics-list">
                        ${this.getEmotionalCharacteristics(node.type)}
                    </ul>
                </div>
                <div class="state-recommendations">
                    <h5>建议措施</h5>
                    <ul class="recommendations-list">
                        ${this.getRecommendations(node.type)}
                    </ul>
                </div>
            </div>
        `;
        
        document.getElementById('state-details').innerHTML = detailsHTML;
    }
    
    getEmotionalCharacteristics(type) {
        const characteristics = {
            'positive': '<li>积极的情绪体验</li><li>满足感和幸福感</li><li>对未来充满希望</li>',
            'neutral': '<li>平静的心理状态</li><li>理性的思考过程</li><li>客观的评估态度</li>',
            'negative': '<li>消极的情绪体验</li><li>失望和不满情绪</li><li>需要心理支持</li>',
            'anxiety': '<li>紧张和担忧</li><li>对未来的不确定感</li><li>需要安抚和指导</li>',
            'excitement': '<li>兴奋和期待</li><li>积极的情绪波动</li><li>对结果的渴望</li>',
            'satisfaction': '<li>满足和欣喜</li><li>目标达成的成就感</li><li>积极的自我评价</li>',
            'fear': '<li>恐惧和害怕</li><li>对风险的担忧</li><li>需要安全感和保护</li>',
            'confidence': '<li>自信和确信</li><li>决策的坚定性</li><li>对未来的信心</li>'
        };
        return characteristics[type] || '<li>需要进一步分析</li>';
    }
    
    getRecommendations(type) {
        const recommendations = {
            'positive': '<li>保持积极情绪</li><li>分享成功经验</li><li>建立长期目标</li>',
            'neutral': '<li>提供更多信息</li><li>促进深度思考</li><li>支持理性决策</li>',
            'negative': '<li>提供心理支持</li><li>倾听和关怀</li><li>专业心理咨询</li>',
            'anxiety': '<li>缓解焦虑情绪</li><li>提供专业指导</li><li>建立信任关系</li>',
            'excitement': '<li>管理期望值</li><li>提供现实信息</li><li>避免过度承诺</li>',
            'satisfaction': '<li>巩固积极效果</li><li>提供维护建议</li><li>鼓励分享体验</li>',
            'fear': '<li>消除恐惧源</li><li>提供安全保障</li><li>专业心理干预</li>',
            'confidence': '<li>强化信心</li><li>支持决策</li><li>提供后续指导</li>'
        };
        return recommendations[type] || '<li>个性化建议</li>';
    }
    
    // 力导向图拖拽函数
    dragstarted(event, d) {
        if (!event.active && this.simulation) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragended(event, d) {
        if (!event.active && this.simulation) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    exportFlow() {
        const svgData = this.svg.node().outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emotional-flow-${this.currentFlow}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 导出类
window.EmotionalFlow = EmotionalFlow;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化情绪流程图
    const flowChart = new EmotionalFlow('emotional-flow-chart', {
        width: 1200,
        height: 600,
        animationDuration: 1000
    });
    
    // 流程类型切换事件
    document.querySelectorAll('.flow-card').forEach(card => {
        card.addEventListener('click', function() {
            const flowType = this.dataset.flow;
            
            // 更新活跃状态
            document.querySelectorAll('.flow-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // 更新流程图
            flowChart.switchFlow(flowType);
        });
    });
    
    // 控制按钮事件
    document.querySelectorAll('.control-button').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            
            switch (action) {
                case 'play':
                    flowChart.togglePlay();
                    break;
                case 'reset':
                    flowChart.stopAnimation();
                    break;
                case 'export':
                    flowChart.exportFlow();
                    break;
            }
        });
    });
    
    // 视图切换事件
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // 更新活跃状态
            document.querySelectorAll('.view-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换视图
            flowChart.switchView(view);
        });
    });
});