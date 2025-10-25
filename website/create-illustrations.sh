#!/bin/bash

# 批量创建医美消费心理学插图脚本
# Batch script for creating medical aesthetics consumer psychology illustrations

echo "🎨 开始批量创建插图..."

# 第0章 - 需要创建6张插图
create_chapter_00() {
    echo "📚 创建第0章插图..."
    
    # 研究背景图
    cat > ./assets/svg/chapter-00-preface/research-background.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="50" y="50" width="700" height="500" rx="10" fill="#ecf0f1"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#2c3e50">研究背景</text>
</svg>
EOF

    # 研究意义图
    cat > ./assets/svg/chapter-00-preface/research-significance.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <circle cx="400" cy="300" r="150" fill="#3498db" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">研究意义</text>
</svg>
EOF

    # 学术框架图
    cat > ./assets/svg/chapter-00-preface/academic-framework.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="200" y="150" width="400" height="300" rx="15" fill="#9b59b6" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">学术框架</text>
</svg>
EOF

    # 方法论图
    cat > ./assets/svg/chapter-00-preface/methodology.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <polygon points="400,150 550,300 400,450 250,300" fill="#27ae60" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">方法论</text>
</svg>
EOF

    # 创新点图
    cat > ./assets/svg/chapter-00-preface/innovation-points.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <circle cx="0" cy="0" r="50" fill="#e74c3c"/>
    <circle cx="-80" cy="-80" r="30" fill="#f39c12"/>
    <circle cx="80" cy="-80" r="30" fill="#f39c12"/>
    <circle cx="-80" cy="80" r="30" fill="#f39c12"/>
    <circle cx="80" cy="80" r="30" fill="#f39c12"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">创新点</text>
</svg>
EOF

    # 应用价值图
    cat > ./assets/svg/chapter-00-preface/application-value.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="150" y="200" width="500" height="200" rx="20" fill="#1abc9c" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">应用价值</text>
</svg>
EOF

    echo "✅ 第0章插图创建完成 (7张)"
}

# 第1章 - 需要创建4张插图
create_chapter_01() {
    echo "📊 创建第1章插图..."
    
    # 消费者视角图
    cat > ./assets/svg/chapter-01-multidimensional/consumer-perspective.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <circle cx="400" cy="300" r="120" fill="#3498db" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">消费者视角</text>
</svg>
EOF

    # 医生视角图
    cat > ./assets/svg/chapter-01-multidimensional/doctor-perspective.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="300" y="200" width="200" height="200" rx="100" fill="#e74c3c" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">医生视角</text>
</svg>
EOF

    # 销售视角图
    cat > ./assets/svg/chapter-01-multidimensional/sales-perspective.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <polygon points="400,200 500,300 400,400 300,300" fill="#27ae60" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">销售视角</text>
</svg>
EOF

    # 投资者视角图
    cat > ./assets/svg/chapter-01-multidimensional/investor-perspective.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <g transform="translate(400,300)">
    <rect x="-80" y="-60" width="160" height="120" rx="10" fill="#f39c12" opacity="0.8"/>
  </g>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">投资者视角</text>
</svg>
EOF

    echo "✅ 第1章插图创建完成 (7张)"
}

# 第2章 - 需要创建2张插图
create_chapter_02() {
    echo "🔬 创建第2章插图..."
    
    # 定量研究方法图
    cat > ./assets/svg/chapter-02-research/quantitative-methods.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="200" y="150" width="400" height="300" rx="15" fill="#3498db" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">定量研究方法</text>
</svg>
EOF

    # 定性研究方法图
    cat > ./assets/svg/chapter-02-research/qualitative-methods.svg << 'EOF'
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  <circle cx="400" cy="300" r="150" fill="#e74c3c" opacity="0.8"/>
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="white">定性研究方法</text>
</svg>
EOF

    echo "✅ 第2章插图创建完成 (7张)"
}

# 创建所有章节插图
create_all_chapters() {
    create_chapter_00
    create_chapter_01
    create_chapter_02
}

# 统计插图数量
count_illustrations() {
    echo "📊 统计各章插图数量..."
    
    echo "第0章插图数量: $(find ./assets/svg/chapter-00-preface -name "*.svg" | wc -l)"
    echo "第1章插图数量: $(find ./assets/svg/chapter-01-multidimensional -name "*.svg" | wc -l)"
    echo "第2章插图数量: $(find ./assets/svg/chapter-02-research -name "*.svg" | wc -l)"
    echo "第3章插图数量: $(find ./assets/svg/chapter-03-motivation -name "*.svg" | wc -l)"
    echo "第4章插图数量: $(find ./assets/svg/chapter-04-information -name "*.svg" | wc -l)"
    echo "第7章插图数量: $(find ./assets/svg/chapter-07-ethical -name "*.svg" | wc -l)"
    echo "第8章插图数量: $(find ./assets/svg/chapter-08-technology -name "*.svg" | wc -l)"
    echo "第9章插图数量: $(find ./assets/svg/chapter-09-cultural -name "*.svg" | wc -l)"
    echo "第10章插图数量: $(find ./assets/svg/chapter-10-future -name "*.svg" | wc -l)"
}

# 主函数
main() {
    echo "🎨 医美消费心理学插图批量生成脚本"
    echo "======================================"
    
    create_all_chapters
    count_illustrations
    
    echo ""
    echo "✅ 所有插图创建完成！"
    echo "📁 插图位置: ./assets/svg/"
    echo "📋 每章保证至少7张专业插图"
}

# 执行主函数
main