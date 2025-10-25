/**
 * SVG插图管理系统
 * SVG Illustration Management System
 * 
 * 用于加载、显示和管理医美消费心理学书籍的SVG插图
 */

class SVGIllustrationManager {
    constructor(options = {}) {
        this.options = {
            basePath: '/assets/svg/',
            animationDuration: options.animationDuration || 800,
            cacheEnabled: options.cacheEnabled || true,
            ...options
        };
        
        this.illustrations = new Map();
        this.currentChapter = null;
        this.loadedIllustrations = new Set();
        this.loadingPromises = new Map();
        
        this.init();
    }
    
    init() {
        this.createIllustrationContainer();
        this.bindEvents();
        this.loadIllustrationIndex();
    }
    
    createIllustrationContainer() {
        // 在页面中创建插图容器
        if (!document.getElementById('svg-illustration-container')) {
            const container = document.createElement('div');
            container.id = 'svg-illustration-container';
            container.style.display = 'none';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            container.style.zIndex = '10000';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            
            document.body.appendChild(container);
        }
    }
    
    bindEvents() {
        // 绑定关闭事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideIllustration();
            }
        });
        
        // 绑定容器点击事件
        const container = document.getElementById('svg-illustration-container');
        if (container) {
            container.addEventListener('click', (e) => {
                if (e.target === container) {
                    this.hideIllustration();
                }
            });
        }
    }
    
    async loadIllustrationIndex() {
        try {
            const response = await fetch(`${this.options.basePath}illustration-index.json`);
            if (response.ok) {
                this.illustrationIndex = await response.json();
                console.log('SVG插图索引加载成功');
            }
        } catch (error) {
            console.warn('无法加载插图索引，使用默认配置');
            this.createDefaultIllustrationIndex();
        }
    }
    
    createDefaultIllustrationIndex() {
        // 创建默认的插图索引
        this.illustrationIndex = {
            chapters: {
                'chapter-01-perspectives': {
                    title: '多维视角',
                    illustrations: [
                        { id: 'four-perspectives-framework', name: '四维视角框架图', description: '展示消费者、医生、销售人员、投资者四个视角' },
                        { id: 'consumer-needs-hierarchy', name: '消费者心理需求层次', description: '基于马斯洛需求理论的医美版本' },
                        { id: 'decision-process-flow', name: '医美决策过程流程图', description: '完整的消费者决策路径' },
                        { id: 'stakeholder-network', name: '利益相关者关系网络', description: '6类利益相关者的关系图谱' },
                        { id: 'psychology-model', name: '医美消费心理模型', description: '核心理论模型的视觉化' },
                        { id: 'consumer-segments', name: '消费者画像细分', description: '5类典型消费者群体' },
                        { id: 'service-ecosystem', name: '医美服务生态圈', description: '完整的医美服务产业链' },
                        { id: 'risk-perception-matrix', name: '风险认知矩阵', description: '2x2矩阵展示不同类型风险' },
                        { id: 'consumer-lifecycle', name: '医美消费生命周期', description: '从认知到忠诚的完整周期' },
                        { id: 'psychology-factors-map', name: '心理影响因素图谱', description: '20+心理因素的关系网络' },
                        { id: 'trend-evolution', name: '医美消费趋势演变', description: '近10年消费趋势变化' },
                        { id: 'interdisciplinary-framework', name: '跨学科知识框架', description: '心理学、医学、商学的交叉框架' }
                    ]
                },
                'chapter-02-research-methods': {
                    title: '研究方法',
                    illustrations: [
                        { id: 'research-methodology-spectrum', name: '研究方法谱系图', description: '定量、定性、混合、行动研究方法谱系' },
                        { id: 'critical-thinking-framework', name: '批判性思维框架', description: '批判性思维的五个核心要素' },
                        { id: 'research-process-flow', name: '研究过程流程图', description: '从问题定义到发表应用的完整流程' },
                        { id: 'data-analysis-methods', name: '数据分析方法图', description: '定量、定性、混合数据分析方法' },
                        { id: 'evidence-evaluation-framework', name: '证据评估框架', description: '循证医学的证据等级金字塔' },
                        { id: 'quantitative-design-flow', name: '定量研究设计流程', description: '从假设到结论的完整流程' },
                        { id: 'qualitative-methods-classification', name: '定性研究方法分类', description: '5类主要定性研究方法' },
                        { id: 'data-collection-tools', name: '数据收集工具集', description: '问卷调查、深度访谈等工具' },
                        { id: 'statistical-analysis-map', name: '统计分析方法图', description: '常用统计方法的选择指南' },
                        { id: 'research-quality-framework', name: '研究质量评估框架', description: '信度、效度等质量指标' },
                        { id: 'sampling-strategies', name: '样本设计策略', description: '不同抽样方法的比较' }
                    ]
                },
                'chapter-03-motivation': {
                    title: '消费动机',
                    illustrations: [
                        { id: 'motivation-theory-integration', name: '动机理论整合图', description: '多种动机理论的整合' },
                        { id: 'intrinsic-extrinsic-motivation', name: '内在动机vs外在动机', description: '双因素对比分析' },
                        { id: 'social-influence-mechanisms', name: '社会影响机制', description: '从众、认同等社会影响' },
                        { id: 'psychological-needs-behavior', name: '心理需求与消费行为', description: '需求到行为的转化过程' },
                        { id: 'deep-motivations', name: '医美消费的深层动机', description: '表层动机与深层动机' },
                        { id: 'cultural-motivation-influence', name: '文化背景对动机的影响', description: '不同文化背景的动机差异' },
                        { id: 'age-motivation-changes', name: '年龄与动机变化', description: '不同年龄段的动机变化' },
                        { id: 'gender-differences', name: '性别差异分析', description: '男女在医美消费中的差异' },
                        { id: 'motivation-conflict-resolution', name: '动机冲突解决', description: '内在动机冲突的处理' },
                        { id: 'long-term-motivation', name: '长期动机维持', description: '如何维持长期消费动机' }
                    ]
                },
                'chapter-04-information': {
                    title: '信息处理',
                    illustrations: [
                        { id: 'information-processing-model', name: '信息处理模型', description: '认知心理学视角的信息处理' },
                        { id: 'cognitive-biases-map', name: '认知偏差图谱', description: '常见认知偏差的分类' },
                        { id: 'risk-assessment-cognition', name: '风险评估认知', description: '消费者对风险的认知过程' },
                        { id: 'information-source-credibility', name: '信息来源可信度', description: '不同信息源的可信度比较' },
                        { id: 'social-media-influence', name: '社交媒体影响', description: '社交媒体对消费决策的影响' },
                        { id: 'information-overload-handling', name: '信息过载处理', description: '信息过载时的应对策略' },
                        { id: 'professional-knowledge-acquisition', name: '医美专业知识获取', description: '专业知识的获取渠道' },
                        { id: 'advertising-information-decoding', name: '广告信息解码', description: '广告信息的解码过程' },
                        { id: 'decision-support-system', name: '决策支持系统', description: '辅助决策的信息系统' }
                    ]
                },
                'chapter-07-ethics': {
                    title: '伦理边界',
                    illustrations: [
                        { id: 'ethics-framework-overview', name: '伦理框架总览', description: '医美消费的伦理框架' },
                        { id: 'informed-consent-process', name: '知情同意流程', description: '完整的知情同意流程' },
                        { id: 'marketing-ethics-boundaries', name: '营销伦理边界', description: '营销行为的伦理边界' },
                        { id: 'doctor-patient-ethics', name: '医患关系伦理', description: '医患关系的伦理要求' },
                        { id: 'data-privacy-protection', name: '数据隐私保护', description: '消费者数据隐私保护' },
                        { id: 'pricing-ethics', name: '价格伦理', description: '定价的伦理考量' },
                        { id: 'advertising-ethics-standards', name: '广告伦理标准', description: '广告宣传的伦理标准' },
                        { id: 'industry-self-regulation', name: '行业自律机制', description: '行业自律的组织架构' },
                        { id: 'ethics-conflict-resolution', name: '伦理冲突解决', description: '伦理冲突的解决机制' }
                    ]
                },
                'chapter-08-technology': {
                    title: '技术发展',
                    illustrations: [
                        { id: 'technology-development-timeline', name: '技术发展时间线', description: '医美技术发展历程' },
                        { id: 'technology-adoption-lifecycle', name: '技术采用生命周期', description: '技术采用的各个阶段' },
                        { id: 'emerging-technologies-assessment', name: '新兴技术评估', description: '新兴技术的评估框架' },
                        { id: 'innovation-driving-factors', name: '技术创新驱动因素', description: '技术创新的驱动因素' },
                        { id: 'technology-acceptance-model', name: '技术接受模型', description: '消费者对技术的接受过程' },
                        { id: 'digital-health-transformation', name: '数字化医疗转型', description: '医疗行业的数字化进程' },
                        { id: 'ai-applications', name: '人工智能应用', description: 'AI在医美领域的应用' },
                        { id: 'virtual-reality-technology', name: '虚拟现实技术', description: 'VR技术在医美中的应用' },
                        { id: 'technology-risk-assessment', name: '技术风险评估', description: '新技术的风险评估' },
                        { id: 'technology-standardization', name: '技术标准化进程', description: '技术标准化的进程' },
                        { id: 'technology-training-system', name: '技术培训体系', description: '技术培训的体系结构' },
                        { id: 'technology-development-trends', name: '技术发展趋势', description: '未来技术发展趋势' }
                    ]
                },
                'chapter-09-culture': {
                    title: '文化差异',
                    illustrations: [
                        { id: 'global-cultural-differences-map', name: '全球文化差异地图', description: '全球医美文化差异分布' },
                        { id: 'east-west-aesthetics-comparison', name: '东西方审美对比', description: '东西方审美标准对比' },
                        { id: 'cultural-values-influence', name: '文化价值观影响', description: '文化价值观对消费的影响' },
                        { id: 'religious-cultural-factors', name: '宗教文化因素', description: '宗教对医美消费的影响' },
                        { id: 'social-norms-differences', name: '社会规范差异', description: '不同社会规范的差异' },
                        { id: 'cross-cultural-communication', name: '跨文化沟通策略', description: '跨文化沟通的策略' },
                        { id: 'cultural-adaptation-process', name: '文化适应过程', description: '文化适应的阶段过程' },
                        { id: 'globalization-localization', name: '全球化与本土化', description: '全球化与本土化的平衡' },
                        { id: 'cultural-sensitivity-training', name: '文化敏感性培训', description: '文化敏感性培训体系' },
                        { id: 'cultural-conflict-resolution', name: '文化冲突解决', description: '文化冲突的解决方法' },
                        { id: 'future-cultural-trends', name: '未来文化趋势', description: '未来文化发展趋势' }
                    ]
                },
                'chapter-10-future': {
                    title: '未来展望',
                    illustrations: [
                        { id: 'future-development-trends', name: '未来发展趋势', description: '医美消费的未来趋势' },
                        { id: 'technology-development-forecast', name: '技术发展预测', description: '未来技术发展预测' },
                        { id: 'market-prospects-analysis', name: '市场前景分析', description: '市场前景的分析预测' },
                        { id: 'consumer-behavior-evolution', name: '消费者行为演变', description: '消费者行为的未来演变' },
                        { id: 'industry-transformation-direction', name: '行业变革方向', description: '行业变革的方向预测' },
                        { id: 'sustainable-development-path', name: '可持续发展路径', description: '行业可持续发展路径' },
                        { id: 'innovative-business-models', name: '创新商业模式', description: '未来创新商业模式' },
                        { id: 'policy-regulation-outlook', name: '政策法规展望', description: '未来政策法规展望' },
                        { id: 'education-training-development', name: '教育与培训发展', description: '未来教育培训发展' },
                        { id: 'social-responsibility', name: '社会责任担当', description: '行业社会责任担当' }
                    ]
                }
            }
        };
    }
    
    async loadIllustration(chapter, illustrationId) {
        const key = `${chapter}/${illustrationId}`;
        
        // 检查缓存
        if (this.options.cacheEnabled && this.illustrations.has(key)) {
            return this.illustrations.get(key);
        }
        
        // 检查是否正在加载
        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }
        
        // 构建URL
        const url = `${this.options.basePath}${chapter}/${illustrationId}.svg`;
        
        // 创建加载Promise
        const loadPromise = this.fetchIllustration(url, key);
        this.loadingPromises.set(key, loadPromise);
        
        try {
            const svgContent = await loadPromise;
            this.illustrations.set(key, svgContent);
            this.loadedIllustrations.add(key);
            return svgContent;
        } catch (error) {
            console.error(`加载插图失败: ${url}`, error);
            throw error;
        } finally {
            this.loadingPromises.delete(key);
        }
    }
    
    async fetchIllustration(url, key) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const svgText = await response.text();
            return this.processSVG(svgText, key);
        } catch (error) {
            console.error(`获取插图失败: ${url}`, error);
            throw error;
        }
    }
    
    processSVG(svgText, key) {
        // 创建DOM元素
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (!svgElement) {
            throw new Error('无效的SVG格式');
        }
        
        // 处理SVG属性
        svgElement.setAttribute('data-illustration-key', key);
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.style.maxWidth = '90vw';
        svgElement.style.maxHeight = '90vh';
        svgElement.style.backgroundColor = 'white';
        svgElement.style.borderRadius = '8px';
        svgElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        
        // 添加交互功能
        this.addSVGInteractivity(svgElement);
        
        return svgElement.outerHTML;
    }
    
    addSVGInteractivity(svgElement) {
        // 为可交互元素添加事件处理
        const interactiveElements = svgElement.querySelectorAll('[data-interactive], [data-tooltip], .interactive');
        
        interactiveElements.forEach(element => {
            // 添加悬停效果
            element.style.cursor = 'pointer';
            element.style.transition = 'all 0.3s ease';
            
            // 添加工具提示
            if (element.dataset.tooltip) {
                element.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e, element.dataset.tooltip);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            }
            
            // 添加点击事件
            if (element.dataset.onclick) {
                element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleSVGClick(element.dataset.onclick, element);
                });
            }
        });
    }
    
    async showIllustration(chapter, illustrationId, options = {}) {
        try {
            const svgContent = await this.loadIllustration(chapter, illustrationId);
            const container = document.getElementById('svg-illustration-container');
            
            if (!container) return;
            
            // 清空容器
            container.innerHTML = '';
            
            // 创建插图显示区域
            const illustrationWrapper = document.createElement('div');
            illustrationWrapper.style.position = 'relative';
            illustrationWrapper.style.maxWidth = '95vw';
            illustrationWrapper.style.maxHeight = '95vh';
            illustrationWrapper.innerHTML = svgContent;
            
            // 添加控制按钮
            const controls = this.createIllustrationControls(chapter, illustrationId);
            illustrationWrapper.appendChild(controls);
            
            // 添加标题和信息
            const info = this.getIllustrationInfo(chapter, illustrationId);
            if (info) {
                const header = this.createIllustrationHeader(info);
                illustrationWrapper.insertBefore(header, illustrationWrapper.firstChild);
            }
            
            container.appendChild(illustrationWrapper);
            container.style.display = 'flex';
            
            // 添加显示动画
            setTimeout(() => {
                illustrationWrapper.style.opacity = '1';
                illustrationWrapper.style.transform = 'scale(1)';
            }, 50);
            
        } catch (error) {
            console.error('显示插图失败:', error);
            this.showError('插图加载失败，请稍后重试');
        }
    }
    
    hideIllustration() {
        const container = document.getElementById('svg-illustration-container');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }
    
    createIllustrationControls(chapter, illustrationId) {
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.top = '10px';
        controls.style.right = '10px';
        controls.style.display = 'flex';
        controls.style.gap = '10px';
        controls.style.zIndex = '10001';
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => this.hideIllustration());
        
        // 下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '⬇';
        downloadBtn.style.width = '30px';
        downloadBtn.style.height = '30px';
        downloadBtn.style.border = 'none';
        downloadBtn.style.borderRadius = '50%';
        downloadBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        downloadBtn.style.color = 'white';
        downloadBtn.style.fontSize = '14px';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.addEventListener('click', () => this.downloadIllustration(chapter, illustrationId));
        
        controls.appendChild(closeBtn);
        controls.appendChild(downloadBtn);
        
        return controls;
    }
    
    createIllustrationHeader(info) {
        const header = document.createElement('div');
        header.style.position = 'absolute';
        header.style.top = '-50px';
        header.style.left = '0';
        header.style.right = '0';
        header.style.padding = '10px 20px';
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        header.style.color = 'white';
        header.style.borderRadius = '8px 8px 0 0';
        
        const title = document.createElement('h3');
        title.textContent = info.name;
        title.style.margin = '0 0 5px 0';
        title.style.fontSize = '16px';
        title.style.fontWeight = '600';
        
        const description = document.createElement('p');
        description.textContent = info.description;
        description.style.margin = '0';
        description.style.fontSize = '12px';
        description.style.opacity = '0.8';
        
        header.appendChild(title);
        header.appendChild(description);
        
        return header;
    }
    
    getIllustrationInfo(chapter, illustrationId) {
        if (!this.illustrationIndex || !this.illustrationIndex.chapters[chapter]) {
            return null;
        }
        
        const chapterData = this.illustrationIndex.chapters[chapter];
        return chapterData.illustrations.find(ill => ill.id === illustrationId);
    }
    
    async downloadIllustration(chapter, illustrationId) {
        try {
            const svgContent = await this.loadIllustration(chapter, illustrationId);
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${chapter}-${illustrationId}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('下载插图失败:', error);
            this.showError('下载失败，请稍后重试');
        }
    }
    
    showTooltip(event, content) {
        // 移除现有工具提示
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.id = 'svg-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.padding = '8px 12px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '10002';
        tooltip.style.maxWidth = '200px';
        tooltip.textContent = content;
        
        document.body.appendChild(tooltip);
        
        // 定位工具提示
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('svg-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    handleSVGClick(action, element) {
        // 处理SVG内部的点击事件
        console.log('SVG点击事件:', action, element);
        
        // 可以根据不同的action执行不同的操作
        switch (action) {
            case 'zoom':
                this.zoomElement(element);
                break;
            case 'details':
                this.showElementDetails(element);
                break;
            case 'navigate':
                this.navigateToRelated(element.dataset.target);
                break;
            default:
                console.log('未处理的SVG点击动作:', action);
        }
    }
    
    zoomElement(element) {
        // 实现元素缩放功能
        element.style.transform = element.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
        element.style.transformOrigin = 'center';
    }
    
    showElementDetails(element) {
        // 显示元素详细信息
        const details = element.dataset.details || '暂无详细信息';
        alert(details);
    }
    
    navigateToRelated(target) {
        // 导航到相关内容
        console.log('导航到:', target);
        // 实现导航逻辑
    }
    
    showError(message) {
        // 显示错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.padding = '12px 20px';
        errorDiv.style.backgroundColor = '#e74c3c';
        errorDiv.style.color = 'white';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.zIndex = '10003';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
    
    // 批量预加载插图
    async preloadIllustrations(chapter) {
        if (!this.illustrationIndex || !this.illustrationIndex.chapters[chapter]) {
            return;
        }
        
        const chapterData = this.illustrationIndex.chapters[chapter];
        const loadPromises = chapterData.illustrations.map(ill => 
            this.loadIllustration(chapter, ill.id).catch(error => {
                console.warn(`预加载插图失败: ${chapter}/${ill.id}`, error);
            })
        );
        
        await Promise.all(loadPromises);
        console.log(`章节 ${chapter} 插图预加载完成`);
    }
    
    // 获取章节插图列表
    getChapterIllustrations(chapter) {
        if (!this.illustrationIndex || !this.illustrationIndex.chapters[chapter]) {
            return [];
        }
        
        return this.illustrationIndex.chapters[chapter].illustrations;
    }
    
    // 搜索插图
    searchIllustrations(query) {
        const results = [];
        
        if (!this.illustrationIndex) return results;
        
        Object.keys(this.illustrationIndex.chapters).forEach(chapter => {
            const chapterData = this.illustrationIndex.chapters[chapter];
            chapterData.illustrations.forEach(ill => {
                if (ill.name.includes(query) || ill.description.includes(query)) {
                    results.push({
                        chapter: chapter,
                        chapterTitle: chapterData.title,
                        ...ill
                    });
                }
            });
        });
        
        return results;
    }
}

// 导出类
window.SVGIllustrationManager = SVGIllustrationManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化SVG插图管理器
    window.svgIllustrationManager = new SVGIllustrationManager({
        basePath: '/assets/svg/',
        animationDuration: 800,
        cacheEnabled: true
    });
    
    console.log('SVG插图管理系统初始化完成');
});