#!/bin/bash

# 医美消费心理学电子书一致性检查脚本
# Medical Aesthetics Consumer Psychology Ebook Consistency Checker

echo "🔍 开始电子书与原稿一致性检查..."
echo "📅 检查时间: $(date)"
echo "📁 项目目录: $(pwd)"
echo ""

# 创建检查结果目录
mkdir -p consistency-check-results

# 1. 文件结构检查
echo "📋 1. 文件结构检查"
echo "=================="

# 检查Markdown源文件
echo "📄 Markdown源文件:"
find .. -name "*.md" -type f | sort
markdown_count=$(find .. -name "*.md" -type f | wc -l)
echo "总计: $markdown_count 个Markdown文件"
echo ""

# 检查HTML文件
echo "🌐 HTML文件:"
find . -name "*.html" -type f | sort
html_count=$(find . -name "*.html" -type f | wc -l)
echo "总计: $html_count 个HTML文件"
echo ""

# 2. 章节对应关系检查
echo "📚 2. 章节对应关系检查"
echo "===================="

# 提取章节映射关系
echo "🔗 章节映射关系:"
echo "----------------"
for md_file in ../*.md; do
    if [[ -f "$md_file" ]]; then
        filename=$(basename "$md_file" .md)
        html_file="${filename}.html"
        
        if [[ -f "$html_file" ]]; then
            echo "✅ $filename -> $html_file"
        else
            echo "❌ $filename -> 缺失HTML文件"
        fi
    fi
done
echo ""

# 3. 内容完整性检查
echo "📖 3. 内容完整性检查"
echo "=================="

# 检查每个HTML文件的基本结构
for html_file in *.html; do
    if [[ -f "$html_file" ]]; then
        echo "🔍 检查 $html_file..."
        
        # 检查基本HTML结构
        if grep -q "<!DOCTYPE html>" "$html_file"; then
            echo "  ✅ DOCTYPE声明"
        else
            echo "  ❌ 缺少DOCTYPE声明"
        fi
        
        # 检查标题
        if grep -q "<title>" "$html_file"; then
            echo "  ✅ 页面标题"
        else
            echo "  ❌ 缺少页面标题"
        fi
        
        # 检查内容区域
        if grep -q "main\|content\|article" "$html_file"; then
            echo "  ✅ 内容区域"
        else
            echo "  ❌ 缺少内容区域"
        fi
        
        # 检查导航
        if grep -q "nav\|navigation" "$html_file"; then
            echo "  ✅ 导航结构"
        else
            echo "  ❌ 缺少导航结构"
        fi
        
        echo ""
    fi
done

# 4. 内容长度对比
echo "📏 4. 内容长度对比"
echo "=================="

echo "📊 文件大小对比:"
echo "文件名 | Markdown大小 | HTML大小 | 状态"
echo "-------|-------------|----------|------"

for md_file in ../*.md; do
    if [[ -f "$md_file" ]]; then
        filename=$(basename "$md_file" .md)
        html_file="${filename}.html"
        
        if [[ -f "$html_file" ]]; then
            md_size=$(wc -c < "$md_file")
            html_size=$(wc -c < "$html_file")
            
            # 计算比例
            if [ $md_size -gt 0 ]; then
                ratio=$((html_size * 100 / md_size))
                echo "$filename | $md_size bytes | $html_size bytes | ${ratio}%"
            else
                echo "$filename | $md_size bytes | $html_size bytes | N/A"
            fi
        else
            echo "$filename | $(wc -c < "$md_file") bytes | N/A | 缺失HTML"
        fi
    fi
done

echo ""

# 5. 特殊内容检查
echo "🔧 5. 特殊内容检查"
echo "=================="

# 检查图表和插图
echo "📊 SVG插图检查:"
svg_count=$(find ./assets/svg -name "*.svg" 2>/dev/null | wc -l)
echo "总计: $svg_count 个SVG文件"

# 检查JavaScript功能
echo "⚙️ JavaScript功能:"
js_count=$(find ./assets/js -name "*.js" 2>/dev/null | wc -l)
echo "总计: $js_count 个JavaScript文件"

# 检查CSS样式
echo "🎨 CSS样式:"
css_count=$(find ./assets/css -name "*.css" 2>/dev/null | wc -l)
echo "总计: $css_count 个CSS文件"

echo ""

# 6. 链接完整性检查
echo "🔗 6. 链接完整性检查"
echo "=================="

broken_links=0
for html_file in *.html; do
    if [[ -f "$html_file" ]]; then
        echo "🔍 检查 $html_file 的链接..."
        
        # 提取所有href链接
        grep -o 'href="[^"]*"' "$html_file" | cut -d'"' -f2 | while read link; do
            if [[ "$link" == http* ]]; then
                echo "  🌐 外部链接: $link"
            elif [[ "$link" == *.html ]]; then
                if [[ -f "$link" ]]; then
                    echo "  ✅ 内部链接: $link"
                else
                    echo "  ❌ 断开链接: $link"
                    broken_links=$((broken_links + 1))
                fi
            fi
        done
    fi
done

echo "断开链接总数: $broken_links"
echo ""

# 7. 生成检查报告
echo "📋 7. 生成检查报告"
echo "=================="

report_file="consistency-check-results/consistency-report-$(date +%Y%m%d-%H%M%S).txt"

{
    echo "医美消费心理学电子书一致性检查报告"
    echo "=================================="
    echo "检查时间: $(date)"
    echo "检查目录: $(pwd)"
    echo ""
    echo "文件统计:"
    echo "- Markdown文件: $markdown_count"
    echo "- HTML文件: $html_count"
    echo "- SVG插图: $svg_count"
    echo "- JavaScript文件: $js_count"
    echo "- CSS文件: $css_count"
    echo "- 断开链接: $broken_links"
    echo ""
    echo "检查状态:"
    if [ $broken_links -eq 0 ]; then
        echo "✅ 所有检查通过"
    else
        echo "⚠️ 发现 $broken_links 个断开链接"
    fi
} > "$report_file"

echo "📄 检查报告已生成: $report_file"

# 8. 完成
echo "✅ 一致性检查完成！"
echo ""
echo "📊 检查摘要:"
echo "- 检查了 $markdown_count 个Markdown文件"
echo "- 检查了 $html_count 个HTML文件"
echo "- 发现 $broken_links 个断开链接"
echo "- 生成了详细检查报告"
echo ""
echo "🔍 详细结果请查看: consistency-check-results/"