#!/bin/bash

# 创建缺失章节插图的完整脚本
echo "🎨 开始创建所有缺失的章节插图..."

# 第1章补充2张插图
create_chapter_01_additional() {
    echo "📊 补充第1章插图..."
    
    # 多维度分析图
    cat > ./assets/svg/chapter-01-multidimensional/multi-dimensional-analysis.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="80" fill="#9b59b6" opacity="0.8"/>
    <circle cx="-100" cy="-100" r="40" fill="#3498db" opacity="0.8"/>
    <circle cx="100" cy="-100" r="40" fill="#e74c3c" opacity="0.8"/>
    <circle cx="-100" cy="100" r="40" fill="#27ae60" opacity="0.8"/>
    <circle cx="100" cy="100" r="40" fill="#f39c12" opacity="0.8"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">多维度分析</text>
</svg>
EOF

    # 利益相关者关系图
    cat > ./assets/svg/chapter-01-multidimensional/stakeholder-relationships.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="60" fill="#2c3e50" opacity="0.8"/>
    <circle cx="-120" cy="0" r="45" fill="#3498db" opacity="0.8"/>
    <circle cx="120" cy="0" r="45" fill="#e74c3c" opacity="0.8"/>
    <circle cx="0" cy="-120" r="45" fill="#27ae60" opacity="0.8"/>
    <circle cx="0" cy="120" r="45" fill="#f39c12" opacity="0.8"/>
    <line x1="-60" y1="0" x2="-75" y2="0" stroke="#bdc3c7" stroke-width="2"/>
    <line x1="60" y1="0" x2="75" y2="0" stroke="#bdc3c7" stroke-width="2"/>
    <line x1="0" y1="-60" x2="0" y2="-75" stroke="#bdc3c7" stroke-width="2"/>
    <line x1="0" y1="60" x2="0" y2="75" stroke="#bdc3c7" stroke-width="2"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">利益相关者</text>
</svg>
EOF
}

# 第2章补充4张插图
create_chapter_02_additional() {
    echo "🔬 补充第2章插图..."
    
    # 混合研究方法
    cat > ./assets/svg/chapter-02-research/mixed-methods.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-80" y="-60" width="160" height="120" rx="15" fill="#1abc9c" opacity="0.8"/>
    <circle cx="-40" cy="-30" r="20" fill="#3498db" opacity="0.9"/>
    <circle cx="40" cy="-30" r="20" fill="#e74c3c" opacity="0.9"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">混合研究</text>
</svg>
EOF

    # 行动研究方法
    cat > ./assets/svg/chapter-02-research/action-research.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="#f39c12" opacity="0.8"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">行动研究</text>
</svg>
EOF

    # 研究设计图
    cat > ./assets/svg/chapter-02-research/research-design.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-100" y="50" width="200" height="40" rx="20" fill="#27ae60" opacity="0.8"/>
    <rect x="-100" y="0" width="200" height="40" rx="20" fill="#3498db" opacity="0.8"/>
    <rect x="-100" y="-50" width="200" height="40" rx="20" fill="#e74c3c" opacity="0.8"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">研究设计</text>
</svg>
EOF

    # 数据收集方法
    cat > ./assets/svg/chapter-02-research/data-collection.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="80" fill="#9b59b6" opacity="0.8"/>
    <rect x="-60" y="-10" width="30" height="20" fill="white" opacity="0.9"/>
    <rect x="-20" y="-10" width="30" height="20" fill="white" opacity="0.9"/>
    <rect x="20" y="-10" width="30" height="20" fill="white" opacity="0.9"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">数据收集</text>
</svg>
EOF
}

# 第7章创建7张插图
create_chapter_07() {
    echo "⚖️ 创建第7章插图..."
    
    # 伦理边界图
    cat > ./assets/svg/chapter-07-ethical/ethical-boundaries.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-100" y="-80" width="200" height="160" rx="20" fill="#e74c3c" opacity="0.8"/>
    <line x1="-80" y1="-60" x2="80" y2="-60" stroke="white" stroke-width="2"/>
    <line x1="-80" y1="-20" x2="80" y2="-20" stroke="white" stroke-width="2"/>
    <line x1="-80" y1="20" x2="80" y2="20" stroke="white" stroke-width="2"/>
    <line x1="-80" y1="60" x2="80" y2="60" stroke="white" stroke-width="2"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">伦理边界</text>
</svg>
EOF

    # 销售心理学伦理
    cat > ./assets/svg/chapter-07-ethical/sales-psychology-ethics.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="80" fill="#9b59b6" opacity="0.8"/>
    <circle cx="-40" cy="-40" r="25" fill="#f39c12" opacity="0.9"/>
    <circle cx="40" cy="-40" r="25" fill="#27ae60" opacity="0.9"/>
    <circle cx="0" cy="50" r="25" fill="#3498db" opacity="0.9"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">销售伦理</text>
</svg>
EOF

    # 知情同意
    cat > ./assets/svg/chapter-07-ethical/informed-consent.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-80" y="-60" width="160" height="120" rx="15" fill="#27ae60" opacity="0.8"/>
    <circle cx="-30" cy="-20" r="8" fill="white"/>
    <circle cx="30" cy="-20" r="8" fill="white"/>
    <rect x="-40" y="10" width="80" height="30" rx="5" fill="white" opacity="0.9"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">知情同意</text>
</svg>
EOF

    # 隐私保护
    cat > ./assets/svg/chapter-07-ethical/privacy-protection.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-70" y="-70" width="140" height="140" rx="20" fill="#3498db" opacity="0.8"/>
    <circle cx="0" cy="0" r="40" fill="white" opacity="0.9"/>
    <rect x="-25" y="-5" width="50" height="10" fill="#3498db"/>
    <rect x="-15" y="10" width="30" height="10" fill="#3498db"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">隐私保护</text>
</svg>
EOF

    # 风险告知
    cat > ./assets/svg/chapter-07-ethical/risk-disclosure.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="#f39c12" opacity="0.8"/>
    <text x="0" y="5" text-anchor="middle" font-size="24" fill="white">!</text>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">风险告知</text>
</svg>
EOF

    # 专业标准
    cat > ./assets/svg/chapter-07-ethical/professional-standards.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-80" y="-80" width="160" height="160" rx="20" fill="#1abc9c" opacity="0.8"/>
    <line x1="-50" y1="-50" x2="50" y2="-50" stroke="white" stroke-width="3"/>
    <line x1="-50" y1="0" x2="50" y2="0" stroke="white" stroke-width="3"/>
    <line x1="-50" y1="50" x2="50" y2="50" stroke="white" stroke-width="3"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="20" fill="white">专业标准</text>
</svg>
EOF

    # 伦理决策框架
    cat > ./assets/svg/chapter-07-ethical/ethical-decision-framework.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="80" fill="#2c3e50" opacity="0.8"/>
    <circle cx="-50" cy="-30" r="20" fill="#e74c3c" opacity="0.9"/>
    <circle cx="50" cy="-30" r="20" fill="#27ae60" opacity="0.9"/>
    <circle cx="0" cy="50" r="20" fill="#3498db" opacity="0.9"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">伦理决策</text>
</svg>
EOF
}

# 第9章创建7张插图
create_chapter_09() {
    echo "🌍 创建第9章插图..."
    
    # 文化差异图
    cat > ./assets/svg/chapter-09-cultural/cultural-differences.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="80" fill="#f39c12" opacity="0.8"/>
    <circle cx="-60" cy="0" r="25" fill="#e74c3c" opacity="0.9"/>
    <circle cx="60" cy="0" r="25" fill="#27ae60" opacity="0.9"/>
    <circle cx="0" cy="-60" r="25" fill="#3498db" opacity="0.9"/>
    <circle cx="0" cy="60" r="25" fill="#9b59b6" opacity="0.9"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">文化差异</text>
</svg>
EOF

    # 全球化影响
    cat > ./assets/svg/chapter-09-cultural/globalization-impact.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="90" fill="#3498db" opacity="0.8"/>
    <path d="M -30,-30 L 30,-30 L 30,30 L -30,30 Z" fill="white" opacity="0.9"/>
    <path d="M -15,-15 L 15,-15 L 15,15 L -15,15 Z" fill="#3498db"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">全球化</text>
</svg>
EOF

    # 跨文化消费
    cat > ./assets/svg/chapter-09-cultural/cross-cultural-consumption.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <ellipse cx="0" cy="0" rx="100" ry="70" fill="#9b59b6" opacity="0.8"/>
    <circle cx="-40" cy="-20" r="20" fill="#f39c12" opacity="0.9"/>
    <circle cx="40" cy="-20" r="20" fill="#27ae60" opacity="0.9"/>
    <circle cx="0" cy="30" r="20" fill="#e74c3c" opacity="0.9"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">跨文化消费</text>
</svg>
EOF

    # 美丽标准
    cat > ./assets/svg/chapter-09-cultural/beauty-standards.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="#e74c3c" opacity="0.8"/>
    <circle cx="0" cy="0" r="30" fill="white" opacity="0.9"/>
    <circle cx="0" cy="0" r="15" fill="#e74c3c"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">美丽标准</text>
</svg>
EOF

    # 文化适应
    cat > ./assets/svg/chapter-09-cultural/cultural-adaptation.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-80" y="-60" width="160" height="120" rx="20" fill="#27ae60" opacity="0.8"/>
    <path d="M -40,-20 L 0,-40 L 40,-20 L 40,20 L 0,40 L -40,20 Z" fill="white" opacity="0.9"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">文化适应</text>
</svg>
EOF

    # 地区差异
    cat > ./assets/svg/chapter-09-cultural/regional-differences.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="80" fill="#1abc9c" opacity="0.8"/>
    <path d="M -50,-30 L -20,-50 L 20,-50 L 50,-30 L 50,30 L 20,50 L -20,50 L -50,30 Z" fill="white" opacity="0.9"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">地区差异</text>
</svg>
EOF

    # 文化营销
    cat > ./assets/svg/chapter-09-cultural/cultural-marketing.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-80" y="-50" width="160" height="100" rx="15" fill="#9b59b6" opacity="0.8"/>
    <circle cx="-30" cy="0" r="15" fill="#f39c12" opacity="0.9"/>
    <circle cx="30" cy="0" r="15" fill="#3498db" opacity="0.9"/>
    <rect x="-10" y="-20" width="20" height="40" fill="white" opacity="0.9"/>
  </g>
  <text x="400" y="450" text-anchor="middle" font-size="20" fill="#2c3e50">文化营销</text>
</svg>
EOF
}

# 执行所有创建函数
main() {
    echo "🎨 开始创建所有缺失的章节插图..."
    echo "================================"
    
    create_chapter_01_additional
    create_chapter_02_additional
    create_chapter_07
    create_chapter_09
    
    echo ""
    echo "📊 最终统计各章插图数量:"
    echo "第0章: $(find ./assets/svg/chapter-00-preface -name "*.svg" | wc -l) 张"
    echo "第1章: $(find ./assets/svg/chapter-01-multidimensional -name "*.svg" | wc -l) 张"
    echo "第2章: $(find ./assets/svg/chapter-02-research -name "*.svg" | wc -l) 张"
    echo "第3章: $(find ./assets/svg/chapter-03-motivation -name "*.svg" | wc -l) 张"
    echo "第4章: $(find ./assets/svg/chapter-04-information -name "*.svg" | wc -l) 张"
    echo "第7章: $(find ./assets/svg/chapter-07-ethical -name "*.svg" | wc -l) 张"
    echo "第8章: $(find ./assets/svg/chapter-08-technology -name "*.svg" | wc -l) 张"
    echo "第9章: $(find ./assets/svg/chapter-09-cultural -name "*.svg" | wc -l) 张"
    echo "第10章: $(find ./assets/svg/chapter-10-future -name "*.svg" | wc -l) 张"
    
    total=$(find ./assets/svg/chapter-* -name "*.svg" | wc -l)
    echo ""
    echo "✅ 插图创建完成！总计: $total 张"
}

main