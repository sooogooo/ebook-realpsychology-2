// 医美消费心理学内联SVG图标生成器

class MedicalAestheticsIcons {
  constructor() {
    this.icons = {
      // 消费者图标
      consumer: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="6" r="4" fill="currentColor"/>
          <path d="M12 12c-4 0-7 3-7 7v2h14v-2c0-4-3-7-7-7z" fill="currentColor"/>
        </svg>`,
        description: "消费者"
      },
      
      // 心理图标
      psychology: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7 2 3 6 3 11c0 2.4 1.2 4.5 3 6v5l6-2 6 2v-5c1.8-1.5 3-3.6 3-6 0-5-4-9-9-9z" fill="currentColor"/>
          <circle cx="12" cy="11" r="2" fill="white"/>
        </svg>`,
        description: "心理学"
      },
      
      // 技术图标
      technology: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="4" fill="currentColor"/>
          <rect x="4" y="10" width="16" height="4" fill="currentColor"/>
          <rect x="4" y="16" width="16" height="4" fill="currentColor"/>
        </svg>`,
        description: "技术"
      },
      
      // 文化图标
      culture: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l-6 6h4v10h4V8h4l-6-6z" fill="currentColor"/>
          <rect x="4" y="20" width="16" height="2" fill="currentColor"/>
        </svg>`,
        description: "文化"
      },
      
      // 伦理图标
      ethics: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8 2 5 5 5 9v10c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7zm0 4c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3s-3-1.3-3-3V9c0-1.7 1.3-3 3-3z" fill="currentColor"/>
        </svg>`,
        description: "伦理"
      },
      
      // 决策图标
      decision: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l-6 6h4v10h4V8h4l-6-6z" fill="currentColor"/>
          <rect x="4" y="20" width="16" height="2" fill="currentColor"/>
        </svg>`,
        description: "决策"
      },
      
      // 研究图标
      research: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="3" fill="currentColor"/>
          <circle cx="16" cy="8" r="3" fill="currentColor"/>
          <path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" fill="currentColor"/>
        </svg>`,
        description: "研究"
      },
      
      // 数据图标
      data: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="12" width="3" height="8" fill="currentColor"/>
          <rect x="9" y="8" width="3" height="12" fill="currentColor"/>
          <rect x="14" y="14" width="3" height="6" fill="currentColor"/>
          <rect x="19" y="10" width="3" height="10" fill="currentColor"/>
        </svg>`,
        description: "数据"
      },
      
      // 情绪图标
      emotion: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
          <path d="M8 16c2 2 4 2 6 0" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        description: "情绪"
      },
      
      // 趋势图标
      trend: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polyline points="4,18 8,14 12,16 16,10 20,12" fill="none" stroke="currentColor" stroke-width="2"/>
          <polyline points="4,14 8,10 12,12 16,6 20,8" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        description: "趋势"
      },
      
      // 医疗图标
      medical: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="currentColor"/>
          <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        description: "医疗"
      },
      
      // 美容图标
      beauty: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 6v6l4 4" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>`,
        description: "美容"
      },
      
      // 分析图标
      analysis: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>`,
        description: "分析"
      },
      
      // 目标图标
      target: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>`,
        description: "目标"
      },
      
      // 检查图标
      check: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polyline points="20,6 9,17 4,12" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        description: "检查"
      },
      
      // 警告图标
      warning: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 20h20L12 2zm0 6v6m0 2v2" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>`,
        description: "警告"
      },
      
      // 信息图标
      info: {
        svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 7v1m0 4v5" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        description: "信息"
      }
    };
  }

  // 创建图标元素
  createIcon(name, options = {}) {
    const icon = this.icons[name];
    if (!icon) {
      console.warn(`Icon "${name}" not found`);
      return '';
    }

    const {
      size = 'md',
      color = 'default',
      className = '',
      title = icon.description
    } = options;

    const sizeMap = {
      sm: '16',
      md: '24',
      lg: '32',
      xl: '48'
    };

    const width = sizeMap[size] || '24';
    const height = width;

    const colorClasses = {
      default: '',
      primary: 'ma-icon-primary',
      success: 'ma-icon-success',
      warning: 'ma-icon-warning',
      danger: 'ma-icon-danger',
      info: 'ma-icon-info',
      mint: 'ma-icon-mint',
      lavender: 'ma-icon-lavender',
      coral: 'ma-icon-coral'
    };

    const iconClass = `ma-icon ma-icon-${size} ${colorClasses[color] || ''} ${className}`.trim();

    return `
      <span class="${iconClass}" ${title ? `title="${title}"` : ''}>
        ${icon.svg}
      </span>
    `;
  }

  // 创建图标文字组合
  createIconText(name, text, options = {}) {
    const iconHtml = this.createIcon(name, options);
    return `<span class="ma-icon-text">${iconHtml}${text}</span>`;
  }

  // 创建图标按钮
  createIconButton(name, text, onClick, options = {}) {
    const iconHtml = this.createIcon(name, options);
    return `
      <button class="ma-icon-btn" onclick="${onClick}">
        ${iconHtml}
        ${text || ''}
      </button>
    `;
  }

  // 创建提示框
  createTipBox(title, content, iconName = 'info') {
    const iconHtml = this.createIcon(iconName, { size: 'md', color: 'mint' });
    return `
      <div class="tip-box">
        <div class="tip-box-header">
          ${iconHtml}
          ${title}
        </div>
        <div class="tip-box-content">
          ${content}
        </div>
      </div>
    `;
  }

  // 创建警告框
  createWarningBox(title, content, iconName = 'warning') {
    const iconHtml = this.createIcon(iconName, { size: 'md', color: 'warning' });
    return `
      <div class="warning-box">
        <div class="warning-box-header">
          ${iconHtml}
          ${title}
        </div>
        <div class="warning-box-content">
          ${content}
        </div>
      </div>
    `;
  }

  // 创建案例框
  createCaseBox(title, content, iconName = 'analysis') {
    const iconHtml = this.createIcon(iconName, { size: 'md', color: 'lavender' });
    return `
      <div class="case-box">
        <div class="case-box-header">
          ${iconHtml}
          ${title}
        </div>
        <div class="case-box-content">
          ${content}
        </div>
      </div>
    `;
  }

  // 创建章节图标
  createChapterIcon(name, title, options = {}) {
    const iconHtml = this.createIcon(name, { size: 'lg', color: 'mint', ...options });
    return `
      <div class="chapter-icon">
        ${iconHtml}
        <span>${title}</span>
      </div>
    `;
  }

  // 创建列表图标
  createListItemIcon(name, text, options = {}) {
    const iconHtml = this.createIcon(name, { size: 'sm', color: 'primary', ...options });
    return `
      <div class="list-icon">
        ${iconHtml}
        <span>${text}</span>
      </div>
    `;
  }

  // 创建强调图标
  createEmphasisIcon(name, text, options = {}) {
    const iconHtml = this.createIcon(name, { size: 'md', color: 'info', ...options });
    return `
      <div class="emphasis-icon">
        ${iconHtml}
        <span>${text}</span>
      </div>
    `;
  }

  // 获取所有图标名称
  getIconNames() {
    return Object.keys(this.icons);
  }

  // 获取图标信息
  getIconInfo(name) {
    return this.icons[name] || null;
  }
}

// 创建全局实例
window.medicalAestheticsIcons = new MedicalAestheticsIcons();

// 便捷函数
function createIcon(name, options = {}) {
  return window.medicalAestheticsIcons.createIcon(name, options);
}

function createIconText(name, text, options = {}) {
  return window.medicalAestheticsIcons.createIconText(name, text, options);
}

function createTipBox(title, content, iconName = 'info') {
  return window.medicalAestheticsIcons.createTipBox(title, content, iconName);
}

function createWarningBox(title, content, iconName = 'warning') {
  return window.medicalAestheticsIcons.createWarningBox(title, content, iconName);
}

function createCaseBox(title, content, iconName = 'analysis') {
  return window.medicalAestheticsIcons.createCaseBox(title, content, iconName);
}