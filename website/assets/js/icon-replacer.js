// 图标SVG定义
const iconSVGs = {
  consumer: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="4" fill="currentColor"/>
    <path d="M12 12c-4 0-7 3-7 7v2h14v-2c0-4-3-7-7-7z" fill="currentColor"/>
  </svg>`,
  
  psychology: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C7 2 3 6 3 11c0 2.4 1.2 4.5 3 6v5l6-2 6 2v-5c1.8-1.5 3-3.6 3-6 0-5-4-9-9-9z" fill="currentColor"/>
    <circle cx="12" cy="11" r="2" fill="white"/>
  </svg>`,
  
  technology: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="4" fill="currentColor"/>
    <rect x="4" y="10" width="16" height="4" fill="currentColor"/>
    <rect x="4" y="16" width="16" height="4" fill="currentColor"/>
  </svg>`,
  
  culture: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l-6 6h4v10h4V8h4l-6-6z" fill="currentColor"/>
    <rect x="4" y="20" width="16" height="2" fill="currentColor"/>
  </svg>`,
  
  ethics: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 5 5 5 9v10c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7zm0 4c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3s-3-1.3-3-3V9c0-1.7 1.3-3 3-3z" fill="currentColor"/>
  </svg>`,
  
  decision: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l-6 6h4v10h4V8h4l-6-6z" fill="currentColor"/>
    <rect x="4" y="20" width="16" height="2" fill="currentColor"/>
  </svg>`,
  
  research: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3" fill="currentColor"/>
    <circle cx="16" cy="8" r="3" fill="currentColor"/>
    <path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" fill="currentColor"/>
  </svg>`,
  
  data: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="3" height="8" fill="currentColor"/>
    <rect x="9" y="8" width="3" height="12" fill="currentColor"/>
    <rect x="14" y="14" width="3" height="6" fill="currentColor"/>
    <rect x="19" y="10" width="3" height="10" fill="currentColor"/>
  </svg>`,
  
  emotion: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
    <path d="M8 16c2 2 4 2 6 0" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  trend: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polyline points="4,18 8,14 12,16 16,10 20,12" fill="none" stroke="currentColor" stroke-width="2"/>
    <polyline points="4,14 8,10 12,12 16,6 20,8" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  home: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l-6 6h4v10h4V8h4l-6-6z" fill="currentColor"/>
    <rect x="4" y="20" width="16" height="2" fill="currentColor"/>
  </svg>`
};

// 页面加载完成后替换图标
document.addEventListener('DOMContentLoaded', function() {
  // 替换所有ma-icon元素
  const iconElements = document.querySelectorAll('.ma-icon');
  
  iconElements.forEach(element => {
    const classes = element.className.split(' ');
    const iconClass = classes.find(cls => cls.startsWith('ma-icon-') && cls !== 'ma-icon');
    
    if (iconClass && iconSVGs[iconClass.replace('ma-icon-', '')]) {
      const iconName = iconClass.replace('ma-icon-', '');
      const svgHTML = iconSVGs[iconName];
      
      // 保持原有的类名
      element.innerHTML = svgHTML;
      
      // 移除原有的图标类名，但保持尺寸和颜色类名
      const newClasses = classes.filter(cls => 
        cls === 'ma-icon' || 
        cls.startsWith('ma-icon-') && ['sm', 'md', 'lg', 'xl', 'primary', 'success', 'warning', 'danger', 'info'].includes(cls.replace('ma-icon-', ''))
      );
      
      element.className = newClasses.join(' ');
    }
  });
  
  console.log('图标系统已更新为内联SVG格式');
});