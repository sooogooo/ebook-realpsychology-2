/**
 * 交互式决策树可视化组件
 * Interactive Decision Tree Visualization Components
 */

class DecisionTree {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            margin: options.margin || { top: 40, right: 40, bottom: 40, left: 40 },
            colors: options.colors || {
                start: '#98d8c8',
                process: '#b8a9c9',
                decision: '#ff9a8b',
                action: '#f4a261',
                outcome: '#4ecdc4',
                risk: '#e76f51',
                emotion: '#a8dadc'
            },
            animationDuration: options.animationDuration || 1000,
            interactive: options.interactive || true,
            responsive: options.responsive || true,
            ...options
        };
        
        this.data = null;
        this.svg = null;
        this.scales = {};
        this.selectedPath = [];
        this.nodeHistory = [];
        this.currentNode = null;
        this.pathData = [];
        this.nodeElements = new Map();
        this.linkElements = new Map();
        
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
            .attr('class', 'tree-group')
            .attr('transform', `translate(${this.options.margin.left}, ${this.options.margin.top})`);
            
        this.linksGroup = this.mainGroup.append('g')
            .attr('class', 'links-group');
            
        this.nodesGroup = this.mainGroup.append('g')
            .attr('class', 'nodes-group');
            
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'decision-tooltip')
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
            .attr('class', 'tree-controls')
            .style('margin-bottom', '20px');
            
        // 视图控制
        const viewControls = controlsContainer.append('div')
            .attr('class', 'view-controls')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('justify-content', 'center')
            .style('margin-bottom', '15px');
            
        viewControls.append('button')
            .attr('class', 'view-button active')
            .attr('data-view', 'tree')
            .style('padding', '8px 16px')
            .style('background', '#98d8c8')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .text('树状视图');
            
        viewControls.append('button')
            .attr('class', 'view-button')
            .attr('data-view', 'radial')
            .style('padding', '8px 16px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '6px')
            .style('cursor', 'pointer')
            .text('径向视图');
            
        // 交互控制
        const interactionControls = controlsContainer.append('div')
            .attr('class', 'interaction-controls')
            .style('display', 'flex')
            .style('gap', '10px')
            .style('justify-content', 'center');
            
        interactionControls.append('button')
            .attr('class', 'control-button')
            .attr('data-action', 'reset')
            .style('padding', '6px 12px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '4px')
            .style('cursor', 'pointer')
            .style('font-size', '12px')
            .text('重置');
            
        interactionControls.append('button')
            .attr('class', 'control-button')
            .attr('data-action', 'export')
            .style('padding', '6px 12px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '4px')
            .style('cursor', 'pointer')
            .style('font-size', '12px')
            .text('导出');
            
        interactionControls.append('button')
            .attr('class', 'control-button')
            .attr('data-action', 'history')
            .style('padding', '6px 12px')
            .style('background', '#6c757d')
            .style('color', 'white')
            .style('border', 'none')
            .style('border-radius', '4px')
            .style('cursor', 'pointer')
            .style('font-size', '12px')
            .text('历史');
    }
    
    bindEvents() {
        // 视图切换
        d3.selectAll('.view-button').on('click', (event) => {
            const view = event.target.dataset.view;
            this.switchView(view);
        });
        
        // 控制按钮
        d3.selectAll('.control-button').on('click', (event) => {
            const action = event.target.dataset.action;
            this.handleControlAction(action);
        });
        
        // 键盘导航
        d3.select('body').on('keydown', (event) => {
            if (this.currentNode) {
                switch(event.key) {
                    case 'ArrowUp':
                        this.navigateUp();
                        break;
                    case 'ArrowDown':
                        this.navigateDown();
                        break;
                    case 'ArrowLeft':
                        this.navigateLeft();
                        break;
                    case 'ArrowRight':
                        this.navigateRight();
                        break;
                    case 'Enter':
                        this.selectNode(this.currentNode);
                        break;
                }
            }
        });
    }
    
    setData(data) {
        this.data = data;
        this.processData();
        this.setupScales();
        this.render();
    }
    
    processData() {
        // 处理树状数据，添加必要的属性
        this.processNode(this.data.rootNode, 0, null);
    }
    
    processNode(node, depth, parent) {
        node.depth = depth;
        node.parent = parent;
        node.id = node.id || `node-${Math.random().toString(36).substr(2, 9)}`;
        
        if (node.children) {
            node.children.forEach((child, index) => {
                this.processNode(child, depth + 1, node);
            });
        }
    }
    
    setupScales() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        
        // 计算树的布局
        this.treeLayout = d3.tree()
            .size([width, height]);
            
        // 创建层次结构
        this.root = d3.hierarchy(this.data.rootNode);
        this.treeLayout(this.root);
    }
    
    render() {
        this.linksGroup.html('');
        this.nodesGroup.html('');
        
        switch(this.currentView) {
            case 'tree':
                this.renderTreeView();
                break;
            case 'radial':
                this.renderRadialView();
                break;
            default:
                this.renderTreeView();
        }
    }
    
    renderTreeView() {
        // 绘制连接线
        const links = this.linksGroup.selectAll('.tree-link')
            .data(this.root.links())
            .enter()
            .append('path')
            .attr('class', 'tree-link')
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .attr('fill', 'none')
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        // 绘制节点
        const nodes = this.nodesGroup.selectAll('.tree-node')
            .data(this.root.descendants())
            .enter()
            .append('g')
            .attr('class', 'tree-node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('opacity', 0);
            
        // 节点圆圈
        nodes.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.getNodeColor(d.data))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, this.getNodeTooltip(d.data));
                this.highlightPath(d);
            })
            .on('mouseout', () => {
                this.hideTooltip();
                this.clearHighlights();
            })
            .on('click', (event, d) => {
                this.selectNode(d);
            })
            .transition()
            .duration(this.options.animationDuration)
            .attr('r', d => this.getNodeSize(d.data))
            .transition()
            .duration(200)
            .style('opacity', 1);
            
        // 节点标签
        nodes.append('text')
            .attr('x', 0)
            .attr('y', d => this.getNodeSize(d.data) + 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2c3e50')
            .style('opacity', 0)
            .text(d => d.data.label)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        // 节点类型图标
        nodes.append('text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('fill', 'white')
            .style('pointer-events', 'none')
            .text(d => this.getNodeIcon(d.data));
            
        // 保存节点元素引用
        nodes.each(function(d) {
            this.nodeElements.set(d.data.id, d3.select(this));
        }.bind(this));
        
        links.each(function(d) {
            this.linkElements.set(`${d.source.data.id}-${d.target.data.id}`, d3.select(this));
        }.bind(this));
    }
    
    renderRadialView() {
        const width = this.options.width - this.options.margin.left - this.options.margin.right;
        const height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        const radius = Math.min(width, height) / 2;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 径向树布局
        const radialTree = d3.tree()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
            
        const radialRoot = d3.hierarchy(this.data.rootNode);
        radialTree(radialRoot);
        
        // 绘制连接线
        const links = this.linksGroup.selectAll('.radial-link')
            .data(radialRoot.links())
            .enter()
            .append('path')
            .attr('class', 'radial-link')
            .attr('d', d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y))
            .attr('fill', 'none')
            .attr('stroke', '#e9ecef')
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
            
        // 绘制节点
        const nodes = this.nodesGroup.selectAll('.radial-node')
            .data(radialRoot.descendants())
            .enter()
            .append('g')
            .attr('class', 'radial-node')
            .attr('transform', d => `translate(${centerX + d.y * Math.cos(d.x - Math.PI / 2)}, ${centerY + d.y * Math.sin(d.x - Math.PI / 2)})`)
            .style('opacity', 0);
            
        // 节点圆圈
        nodes.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.getNodeColor(d.data))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, this.getNodeTooltip(d.data));
                this.highlightPath(d);
            })
            .on('mouseout', () => {
                this.hideTooltip();
                this.clearHighlights();
            })
            .on('click', (event, d) => {
                this.selectNode(d);
            })
            .transition()
            .duration(this.options.animationDuration)
            .attr('r', d => this.getNodeSize(d.data))
            .transition()
            .duration(200)
            .style('opacity', 1);
            
        // 节点标签
        nodes.append('text')
            .attr('x', 0)
            .attr('y', d => this.getNodeSize(d.data) + 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2c3e50')
            .style('opacity', 0)
            .text(d => d.data.label)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
    }
    
    getNodeColor(nodeData) {
        return this.options.colors[nodeData.type] || '#6c757d';
    }
    
    getNodeSize(nodeData) {
        const baseSize = 20;
        const sizeMap = {
            'start': 25,
            'process': 20,
            'decision': 22,
            'action': 18,
            'outcome': 16,
            'risk': 19,
            'emotion': 17,
            'category': 21,
            'concern': 18,
            'treatment': 20,
            'stage': 22,
            'source': 16,
            'factor': 18
        };
        return sizeMap[nodeData.type] || baseSize;
    }
    
    getNodeIcon(nodeData) {
        const iconMap = {
            'start': '▶',
            'process': '⚙',
            'decision': '❓',
            'action': '▶',
            'outcome': '✓',
            'risk': '⚠',
            'emotion': '♥',
            'category': '📁',
            'concern': '!',
            'treatment': '💊',
            'stage': '📍',
            'source': '📚',
            'factor': '🔍'
        };
        return iconMap[nodeData.type] || '•';
    }
    
    getNodeTooltip(nodeData) {
        let tooltip = `
            <div style="font-weight: bold; margin-bottom: 5px;">${nodeData.label}</div>
            <div style="margin-bottom: 3px;">类型: ${nodeData.type}</div>
            <div style="margin-bottom: 3px;">描述: ${nodeData.description}</div>
        `;
        
        if (nodeData.probability) {
            tooltip += `<div style="margin-bottom: 3px;">概率: ${Math.round(nodeData.probability * 100)}%</div>`;
        }
        
        if (nodeData.riskScore) {
            tooltip += `<div style="margin-bottom: 3px;">风险评分: ${nodeData.riskScore}</div>`;
        }
        
        if (nodeData.intensity) {
            tooltip += `<div style="margin-bottom: 3px;">强度: ${Math.round(nodeData.intensity * 100)}%</div>`;
        }
        
        return tooltip;
    }
    
    selectNode(node) {
        // 更新当前选中节点
        this.currentNode = node;
        
        // 添加到路径历史
        this.addToPath(node.data);
        
        // 高亮选中节点
        this.nodesGroup.selectAll('.tree-node circle')
            .attr('stroke', d => d === node ? '#ff6b6b' : '#fff')
            .attr('stroke-width', d => d === node ? 3 : 2);
            
        // 触发选择事件
        this.onNodeSelect(node.data);
        
        // 展开子节点
        if (node.data.children && node.data.children.length > 0) {
            this.expandChildren(node);
        }
    }
    
    addToPath(nodeData) {
        this.pathData.push(nodeData);
        this.nodeHistory.push({
            timestamp: new Date().toLocaleString(),
            action: `选择节点: ${nodeData.label}`,
            result: nodeData.description
        });
        
        // 限制历史记录长度
        if (this.nodeHistory.length > 20) {
            this.nodeHistory.shift();
        }
    }
    
    expandChildren(node) {
        // 如果子节点已存在，则显示动画
        const childNodes = this.nodesGroup.selectAll('.tree-node')
            .filter(d => d.parent === node);
            
        childNodes
            .style('opacity', 0)
            .transition()
            .duration(this.options.animationDuration)
            .style('opacity', 1);
    }
    
    highlightPath(node) {
        // 高亮从根节点到当前节点的路径
        const path = node.ancestors().reverse();
        
        // 高亮路径上的节点
        this.nodesGroup.selectAll('.tree-node')
            .style('opacity', d => path.includes(d) ? 1 : 0.3);
            
        // 高亮路径上的连接线
        this.linksGroup.selectAll('.tree-link')
            .style('opacity', d => {
                const sourceInPath = path.find(n => n === d.source);
                const targetInPath = path.find(n => n === d.target);
                return sourceInPath && targetInPath ? 1 : 0.2;
            });
    }
    
    clearHighlights() {
        this.nodesGroup.selectAll('.tree-node')
            .style('opacity', 1);
            
        this.linksGroup.selectAll('.tree-link')
            .style('opacity', 1);
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
    
    switchView(view) {
        this.currentView = view;
        
        // 更新按钮状态
        d3.selectAll('.view-button')
            .style('background', '#6c757d')
            .style('color', 'white');
            
        d3.select(`[data-view="${view}"]`)
            .style('background', '#98d8c8')
            .style('color', 'white');
            
        // 重新渲染
        this.render();
    }
    
    handleControlAction(action) {
        switch(action) {
            case 'reset':
                this.resetTree();
                break;
            case 'export':
                this.exportTree();
                break;
            case 'history':
                this.showHistory();
                break;
        }
    }
    
    resetTree() {
        this.selectedPath = [];
        this.pathData = [];
        this.currentNode = null;
        this.clearHighlights();
        
        // 重置节点样式
        this.nodesGroup.selectAll('.tree-node circle')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
    }
    
    exportTree() {
        const svgData = this.svg.node().outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `decision-tree-${this.data.id}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    showHistory() {
        if (typeof window.showDecisionHistory === 'function') {
            window.showDecisionHistory(this.nodeHistory);
        }
    }
    
    // 导航方法
    navigateUp() {
        if (this.currentNode && this.currentNode.parent) {
            this.selectNode(this.currentNode.parent);
        }
    }
    
    navigateDown() {
        if (this.currentNode && this.currentNode.children && this.currentNode.children.length > 0) {
            this.selectNode(this.currentNode.children[0]);
        }
    }
    
    navigateLeft() {
        if (this.currentNode && this.currentNode.parent) {
            const siblings = this.currentNode.parent.children;
            const currentIndex = siblings.indexOf(this.currentNode);
            if (currentIndex > 0) {
                this.selectNode(siblings[currentIndex - 1]);
            }
        }
    }
    
    navigateRight() {
        if (this.currentNode && this.currentNode.parent) {
            const siblings = this.currentNode.parent.children;
            const currentIndex = siblings.indexOf(this.currentNode);
            if (currentIndex < siblings.length - 1) {
                this.selectNode(siblings[currentIndex + 1]);
            }
        }
    }
    
    // 获取路径分析结果
    getPathAnalysis() {
        return {
            pathLength: this.pathData.length,
            nodes: this.pathData,
            riskScore: this.calculatePathRisk(),
            expectedSatisfaction: this.calculatePathSatisfaction(),
            recommendations: this.generateRecommendations()
        };
    }
    
    calculatePathRisk() {
        const riskNodes = this.pathData.filter(node => node.riskScore);
        if (riskNodes.length === 0) return 0;
        return riskNodes.reduce((sum, node) => sum + node.riskScore, 0) / riskNodes.length;
    }
    
    calculatePathSatisfaction() {
        const satisfactionNodes = this.pathData.filter(node => node.satisfaction);
        if (satisfactionNodes.length === 0) return 0;
        return satisfactionNodes.reduce((sum, node) => sum + node.satisfaction, 0) / satisfactionNodes.length;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // 基于路径分析生成建议
        if (this.calculatePathRisk() > 60) {
            recommendations.push('建议重新评估风险因素');
        }
        
        if (this.pathData.length > 5) {
            recommendations.push('决策路径较长，建议简化流程');
        }
        
        if (this.calculatePathSatisfaction() < 0.6) {
            recommendations.push('预期满意度较低，建议调整期望');
        }
        
        return recommendations;
    }
    
    // 事件处理
    onNodeSelect(nodeData) {
        // 可以被重写以实现自定义逻辑
        console.log('Node selected:', nodeData);
        
        // 触发自定义事件
        const event = new CustomEvent('nodeSelect', {
            detail: { node: nodeData, path: this.pathData }
        });
        this.container.dispatchEvent(event);
    }
}

// 导出类
window.DecisionTree = DecisionTree;