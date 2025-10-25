/**
 * Data Export and Import System
 * 数据导出和导入系统
 */

class DataManager {
    constructor() {
        this.currentData = {};
        this.dataHistory = [];
        this.notificationSystem = new NotificationSystem();
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
    }

    setCurrentData(data) {
        this.currentData = data;
        this.addToHistory(data);
        this.saveToLocalStorage();
        this.showNotification('数据已更新', 'success');
    }

    exportData(format = 'json') {
        try {
            let content, filename, mimeType;

            switch (format) {
                case 'json':
                    content = JSON.stringify(this.currentData, null, 2);
                    filename = `medical-aesthetics-data-${new Date().toISOString().split('T')[0]}.json`;
                    mimeType = 'application/json';
                    break;

                case 'csv':
                    content = this.convertToCSV();
                    filename = `medical-aesthetics-data-${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                    break;

                case 'xlsx':
                    this.exportToExcel();
                    return;

                default:
                    throw new Error('不支持的导出格式');
            }

            this.downloadFile(content, filename, mimeType);
            this.showNotification(`数据已导出为 ${format.toUpperCase()} 格式`, 'success');
            
        } catch (error) {
            this.showNotification(`导出失败: ${error.message}`, 'error');
        }
    }

    convertToCSV() {
        const csvData = [];
        
        // 添加数据集信息
        csvData.push(['数据集', '类型', '记录数', '导出时间']);
        csvData.push(['雷达图数据', '多维数据', this.currentData.radarData?.series?.length || 0, new Date().toLocaleString()]);
        csvData.push(['时间序列数据', '时序数据', this.currentData.timeSeriesData?.length || 0, new Date().toLocaleString()]);
        csvData.push(['热力图数据', '矩阵数据', this.currentData.heatMapData?.length || 0, new Date().toLocaleString()]);
        csvData.push(['网络图数据', '关系数据', this.currentData.networkData?.nodes?.length || 0, new Date().toLocaleString()]);
        csvData.push([]);

        // 雷达图数据
        if (this.currentData.radarData) {
            csvData.push(['=== 雷达图数据 ===']);
            csvData.push(['类别', ...this.currentData.radarData.categories]);
            this.currentData.radarData.series.forEach(series => {
                csvData.push([series.category, ...series.values]);
            });
            csvData.push([]);
        }

        // 时间序列数据
        if (this.currentData.timeSeriesData) {
            csvData.push(['=== 时间序列数据 ===']);
            csvData.push(['日期', '数值']);
            this.currentData.timeSeriesData.forEach(item => {
                csvData.push([item.date, item.value]);
            });
            csvData.push([]);
        }

        // 热力图数据
        if (this.currentData.heatMapData) {
            csvData.push(['=== 热力图数据 ===']);
            csvData.push(['类别', '时期', '数值']);
            this.currentData.heatMapData.forEach(item => {
                csvData.push([item.category, item.period, item.value]);
            });
            csvData.push([]);
        }

        // 网络图数据
        if (this.currentData.networkData) {
            csvData.push(['=== 网络图节点数据 ===']);
            csvData.push(['ID', '名称', '大小', '度数']);
            this.currentData.networkData.nodes.forEach(node => {
                csvData.push([node.id, node.name, node.size, node.degree]);
            });
            csvData.push([]);

            csvData.push(['=== 网络图连接数据 ===']);
            csvData.push(['源节点', '目标节点', '权重']);
            this.currentData.networkData.links.forEach(link => {
                csvData.push([link.source, link.target, link.value]);
            });
        }

        return csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    exportToExcel() {
        // 使用 SheetJS 库导出 Excel 文件
        if (typeof XLSX === 'undefined') {
            this.showNotification('Excel 导出功能需要加载 SheetJS 库', 'warning');
            return;
        }

        const wb = XLSX.utils.book_new();
        
        // 创建工作表
        if (this.currentData.radarData) {
            const radarSheet = XLSX.utils.json_to_sheet(this.flattenRadarData());
            XLSX.utils.book_append_sheet(wb, radarSheet, '雷达图数据');
        }

        if (this.currentData.timeSeriesData) {
            const timeSeriesSheet = XLSX.utils.json_to_sheet(this.currentData.timeSeriesData);
            XLSX.utils.book_append_sheet(wb, timeSeriesSheet, '时间序列数据');
        }

        if (this.currentData.heatMapData) {
            const heatMapSheet = XLSX.utils.json_to_sheet(this.currentData.heatMapData);
            XLSX.utils.book_append_sheet(wb, heatMapSheet, '热力图数据');
        }

        if (this.currentData.networkData) {
            const nodesSheet = XLSX.utils.json_to_sheet(this.currentData.networkData.nodes);
            const linksSheet = XLSX.utils.json_to_sheet(this.currentData.networkData.links);
            XLSX.utils.book_append_sheet(wb, nodesSheet, '网络节点');
            XLSX.utils.book_append_sheet(wb, linksSheet, '网络连接');
        }

        const filename = `medical-aesthetics-data-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        this.showNotification('数据已导出为 Excel 格式', 'success');
    }

    flattenRadarData() {
        const flattened = [];
        this.currentData.radarData.series.forEach(series => {
            this.currentData.radarData.categories.forEach((category, index) => {
                flattened.push({
                    '类别': series.category,
                    '维度': category,
                    '数值': series.values[index]
                });
            });
        });
        return flattened;
    }

    importData(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const fileName = file.name;
                const fileExtension = fileName.split('.').pop().toLowerCase();

                let importedData;

                switch (fileExtension) {
                    case 'json':
                        importedData = JSON.parse(content);
                        break;

                    case 'csv':
                        importedData = this.parseCSV(content);
                        break;

                    case 'xlsx':
                        this.importFromExcel(file);
                        return;

                    default:
                        throw new Error('不支持的文件格式');
                }

                this.validateAndSetData(importedData, fileName);
                
            } catch (error) {
                this.showNotification(`导入失败: ${error.message}`, 'error');
            }
        };

        reader.readAsText(file);
    }

    parseCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        const data = {};
        
        let currentSection = null;
        
        lines.forEach(line => {
            const cells = line.split(',').map(cell => cell.replace(/"/g, '').trim());
            
            if (cells[0].startsWith('=== ')) {
                currentSection = cells[0].replace(/=== | ===/g, '');
                return;
            }

            if (currentSection === '雷达图数据' && cells.length > 1) {
                if (!data.radarData) {
                    data.radarData = { categories: [], series: [] };
                }
                if (cells[0] === '类别') {
                    data.radarData.categories = cells.slice(1);
                } else if (cells[0] !== '') {
                    data.radarData.series.push({
                        category: cells[0],
                        values: cells.slice(1).map(v => parseFloat(v) || 0)
                    });
                }
            }

            if (currentSection === '时间序列数据' && cells.length > 1) {
                if (!data.timeSeriesData) {
                    data.timeSeriesData = [];
                }
                if (cells[0] !== '日期') {
                    data.timeSeriesData.push({
                        date: cells[0],
                        value: parseFloat(cells[1]) || 0
                    });
                }
            }

            if (currentSection === '热力图数据' && cells.length > 1) {
                if (!data.heatMapData) {
                    data.heatMapData = [];
                }
                if (cells[0] !== '类别') {
                    data.heatMapData.push({
                        category: cells[0],
                        period: cells[1],
                        value: parseFloat(cells[2]) || 0
                    });
                }
            }
        });

        return data;
    }

    importFromExcel(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                const importedData = {};
                
                workbook.SheetNames.forEach(sheetName => {
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    
                    if (sheetName === '雷达图数据') {
                        importedData.radarData = this.parseRadarDataFromExcel(jsonData);
                    } else if (sheetName === '时间序列数据') {
                        importedData.timeSeriesData = jsonData;
                    } else if (sheetName === '热力图数据') {
                        importedData.heatMapData = jsonData;
                    } else if (sheetName === '网络节点') {
                        importedData.networkData = importedData.networkData || {};
                        importedData.networkData.nodes = jsonData;
                    } else if (sheetName === '网络连接') {
                        importedData.networkData = importedData.networkData || {};
                        importedData.networkData.links = jsonData;
                    }
                });

                this.validateAndSetData(importedData, file.name);
                
            } catch (error) {
                this.showNotification(`Excel 导入失败: ${error.message}`, 'error');
            }
        };

        reader.readAsArrayBuffer(file);
    }

    parseRadarDataFromExcel(data) {
        const radarData = { categories: [], series: [] };
        const categories = new Set();
        const seriesMap = {};

        data.forEach(row => {
            categories.add(row['维度']);
            
            if (!seriesMap[row['类别']]) {
                seriesMap[row['类别']] = {};
            }
            seriesMap[row['类别']][row['维度']] = row['数值'];
        });

        radarData.categories = Array.from(categories);
        
        Object.keys(seriesMap).forEach(category => {
            const series = {
                category: category,
                values: radarData.categories.map(cat => seriesMap[category][cat] || 0)
            };
            radarData.series.push(series);
        });

        return radarData;
    }

    validateAndSetData(data, fileName) {
        // 基本数据验证
        if (!data || typeof data !== 'object') {
            throw new Error('无效的数据格式');
        }

        // 验证数据结构
        const validData = {};
        
        if (data.radarData && data.radarData.categories && data.radarData.series) {
            validData.radarData = data.radarData;
        }
        
        if (data.timeSeriesData && Array.isArray(data.timeSeriesData)) {
            validData.timeSeriesData = data.timeSeriesData;
        }
        
        if (data.heatMapData && Array.isArray(data.heatMapData)) {
            validData.heatMapData = data.heatMapData;
        }
        
        if (data.networkData && data.networkData.nodes && data.networkData.links) {
            validData.networkData = data.networkData;
        }

        if (Object.keys(validData).length === 0) {
            throw new Error('未找到有效的数据集');
        }

        this.setCurrentData(validData);
        this.showNotification(`成功导入数据: ${fileName}`, 'success');
        
        // 更新图表
        this.updateCharts(validData);
    }

    updateCharts(data) {
        // 触发图表更新事件
        document.dispatchEvent(new CustomEvent('dataImported', {
            detail: { data: data }
        }));
    }

    refreshData() {
        // 重新生成模拟数据
        const newData = {
            radarData: this.generateRadarData(),
            timeSeriesData: this.generateTimeSeriesData(),
            heatMapData: this.generateHeatMapData(),
            networkData: this.generateNetworkData()
        };

        this.setCurrentData(newData);
        this.updateCharts(newData);
        this.showNotification('数据已刷新', 'success');
    }

    generateRadarData() {
        const categories = ['外貌焦虑', '风险感知', '自我认同', '社会压力', '期望管理', '满意度'];
        const series = [
            { category: '全部人群', values: categories.map(() => Math.floor(Math.random() * 40) + 60) },
            { category: '年轻群体', values: categories.map(() => Math.floor(Math.random() * 40) + 50) },
            { category: '中年群体', values: categories.map(() => Math.floor(Math.random() * 40) + 60) },
            { category: '资深群体', values: categories.map(() => Math.floor(Math.random() * 40) + 70) }
        ];
        return { categories, series };
    }

    generateTimeSeriesData() {
        const data = [];
        const startDate = new Date('2024-01-01');
        
        for (let i = 0; i < 24; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i * 15);
            
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 50) + 30
            });
        }
        
        return data;
    }

    generateHeatMapData() {
        const categories = ['微整形', '手术整形', '激光治疗'];
        const periods = ['术前1周', '术前1天', '术后1天', '术后1周', '术后1月'];
        const data = [];

        categories.forEach(category => {
            periods.forEach(period => {
                data.push({
                    category,
                    period,
                    value: Math.floor(Math.random() * 10) + 1
                });
            });
        });

        return data;
    }

    generateNetworkData() {
        const nodes = [
            { id: 1, name: '消费者', size: 20, degree: 3 },
            { id: 2, name: '家人', size: 15, degree: 4 },
            { id: 3, name: '朋友', size: 15, degree: 5 },
            { id: 4, name: '医生', size: 18, degree: 6 },
            { id: 5, name: '销售人员', size: 12, degree: 3 },
            { id: 6, name: '意见领袖', size: 16, degree: 7 },
            { id: 7, name: '社交媒体', size: 14, degree: 8 }
        ];

        const links = [
            { source: 1, target: 2, value: Math.floor(Math.random() * 5) + 5 },
            { source: 1, target: 3, value: Math.floor(Math.random() * 5) + 5 },
            { source: 1, target: 4, value: Math.floor(Math.random() * 5) + 5 },
            { source: 1, target: 5, value: Math.floor(Math.random() * 5) + 3 },
            { source: 1, target: 6, value: Math.floor(Math.random() * 5) + 3 },
            { source: 1, target: 7, value: Math.floor(Math.random() * 5) + 5 },
            { source: 2, target: 4, value: Math.floor(Math.random() * 3) + 2 },
            { source: 3, target: 6, value: Math.floor(Math.random() * 3) + 4 },
            { source: 3, target: 7, value: Math.floor(Math.random() * 3) + 5 },
            { source: 4, target: 5, value: Math.floor(Math.random() * 3) + 3 },
            { source: 6, target: 7, value: Math.floor(Math.random() * 3) + 6 }
        ];

        return { nodes, links };
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    addToHistory(data) {
        this.dataHistory.push({
            data: JSON.parse(JSON.stringify(data)),
            timestamp: new Date().toISOString()
        });

        // 保留最近10条历史记录
        if (this.dataHistory.length > 10) {
            this.dataHistory = this.dataHistory.slice(-10);
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('medicalAestheticsData', JSON.stringify({
                currentData: this.currentData,
                history: this.dataHistory,
                lastUpdate: new Date().toISOString()
            }));
        } catch (error) {
            console.warn('无法保存到本地存储:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('medicalAestheticsData');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.currentData = parsed.currentData || {};
                this.dataHistory = parsed.history || [];
            }
        } catch (error) {
            console.warn('无法从本地存储加载:', error);
        }
    }

    updateDataStatus() {
        const totalDataPoints = this.calculateTotalDataPoints();
        const datasetCount = Object.keys(this.currentData).length;
        
        document.getElementById('datasetCount').textContent = datasetCount;
        document.getElementById('totalDataPoints').textContent = totalDataPoints.toLocaleString();
        document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
        
        // 更新状态指示器
        const indicator = document.getElementById('dataStatusIndicator');
        const statusDot = indicator.querySelector('.status-dot');
        const statusText = indicator.querySelector('.status-text');
        
        if (datasetCount > 0) {
            statusDot.classList.add('active');
            statusText.textContent = '数据已加载';
        } else {
            statusDot.classList.remove('active');
            statusText.textContent = '无数据';
        }
    }

    calculateTotalDataPoints() {
        let count = 0;
        
        if (this.currentData.radarData) {
            count += this.currentData.radarData.series.length * this.currentData.radarData.categories.length;
        }
        
        if (this.currentData.timeSeriesData) {
            count += this.currentData.timeSeriesData.length;
        }
        
        if (this.currentData.heatMapData) {
            count += this.currentData.heatMapData.length;
        }
        
        if (this.currentData.networkData) {
            count += this.currentData.networkData.nodes.length + this.currentData.networkData.links.length;
        }
        
        return count;
    }

    showNotification(message, type = 'info') {
        this.notificationSystem.show(message, type);
    }

    setupEventListeners() {
        // 监听数据导入事件
        document.addEventListener('dataImported', (e) => {
            console.log('数据已导入:', e.detail.data);
        });

        // 监听语言变化事件
        document.addEventListener('languageChanged', (e) => {
            this.updateDataStatus();
        });
    }
}

/**
 * Notification System
 * 通知系统
 */
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = [];
        this.init();
    }

    init() {
        if (!this.container) {
            this.container = this.createContainer();
        }
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.id = 'notificationContainer';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        
        // 添加动画类
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // 自动移除
        setTimeout(() => {
            this.remove(notification);
        }, duration);

        this.notifications.push(notification);
        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        `;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => this.remove(notification);

        notification.appendChild(content);
        notification.appendChild(closeBtn);

        return notification;
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    remove(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataManager, NotificationSystem };
} else if (typeof window !== 'undefined') {
    window.DataManager = DataManager;
    window.NotificationSystem = NotificationSystem;
}