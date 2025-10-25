#!/bin/bash

# 医美消费心理学内容深度一致性检查脚本
# Medical Aesthetics Consumer Psychology Content Deep Consistency Checker

echo "🔍 开始内容深度一致性检查..."
echo "📅 检查时间: $(date)"
echo ""

# 创建详细检查目录
mkdir -p detailed-consistency-check

# 1. 内容质量分析
echo "📖 1. 内容质量分析"
echo "=================="

# 分析每个章节的内容结构
for html_file in [0-9][0-9]-*.html; do
    if [[ -f "$html_file" ]]; then
        echo "🔍 分析 $html_file..."
        
        # 提取标题
        title=$(grep -o '<title>[^<]*</title>' "$html_file" | sed 's/<title>\(.*\)<\/title>/\1/')
        echo "  📄 标题: $title"
        
        # 计算内容长度
        content_length=$(wc -c < "$html_file")
        echo "  📏 文件大小: $content_length bytes"
        
        # 检查章节结构
        h1_count=$(grep -c '<h1[^>]*>' "$html_file")
        h2_count=$(grep -c '<h2[^>]*>' "$html_file")
        h3_count=$(grep -c '<h3[^>]*>' "$html_file")
        echo "  📑 章节结构: H1=$h1_count, H2=$h2_count, H3=$h3_count"
        
        # 检查图表和插图
        img_count=$(grep -c '<img[^>]*>' "$html_file")
        svg_count=$(grep -c '<svg[^>]*>' "$html_file")
        echo "  🖼️ 媒体内容: 图片=$img_count, SVG=$svg_count"
        
        # 检查代码块
        code_count=$(grep -c '<code[^>]*>' "$html_file")
        pre_count=$(grep -c '<pre[^>]*>' "$html_file")
        echo "  💻 代码块: code=$code_count, pre=$pre_count"
        
        # 检查表格
        table_count=$(grep -c '<table[^>]*>' "$html_file")
        echo "  📊 表格: $table_count"
        
        # 检查链接
        link_count=$(grep -c '<a[^>]*>' "$html_file")
        echo "  🔗 链接: $link_count"
        
        echo ""
    fi
done

# 2. 与原稿对比分析
echo "📋 2. 与原稿对比分析"
echo "=================="

# 对比每个对应的Markdown和HTML文件
for md_file in ../*.md; do
    if [[ -f "$md_file" ]]; then
        filename=$(basename "$md_file" .md)
        html_file="${filename}.html"
        
        if [[ -f "$html_file" ]]; then
            echo "🔍 对比 $filename..."
            
            # 计算字数统计
            md_words=$(wc -w < "$md_file")
            html_words=$(grep -o '<[^>]*>' "$html_file" | sed 's/<[^>]*>//g' | wc -w)
            
            # 计算字符数统计
            md_chars=$(wc -m < "$md_file")
            html_chars=$(grep -o '<[^>]*>' "$html_file" | sed 's/<[^>]*>//g' | wc -m)
            
            # 计算行数统计
            md_lines=$(wc -l < "$md_file")
            html_lines=$(wc -l < "$html_file")
            
            echo "  📊 Markdown: $md_words 词, $md_chars 字符, $md_lines 行"
            echo "  📊 HTML: $html_words 词, $html_chars 字符, $html_lines 行"
            
            # 计算内容保留率
            if [ $md_words -gt 0 ]; then
                word_ratio=$((html_words * 100 / md_words))
                echo "  📈 内容保留率: $word_ratio%"
            fi
            
            # 检查关键内容元素
            md_headings=$(grep -c '^#' "$md_file")
            html_headings=$(grep -c '<h[1-6][^>]*>' "$html_file")
            echo "  📑 标题数量: Markdown=$md_headings, HTML=$html_headings"
            
            # 检查代码块
            md_code=$(grep -c '^```' "$md_file")
            html_code=$(grep -c '<code[^>]*>' "$html_file")
            echo "  💻 代码块: Markdown=$md_code, HTML=$html_code"
            
            echo ""
        fi
    fi
done

# 3. 专业术语一致性检查
echo "🔬 3. 专业术语一致性检查"
echo "======================="

# 定义医美心理学专业术语
keywords=("医美" "消费心理学" "美容" "心理" "消费者" "决策" "情绪" "文化" "技术" "伦理")

echo "🔍 检查专业术语使用情况:"
for keyword in "${keywords[@]}"; do
    echo "  📊 '$keyword':"
    
    # 在所有HTML文件中搜索
    total_count=0
    for html_file in [0-9][0-9]-*.html; do
        if [[ -f "$html_file" ]]; then
            count=$(grep -i -o "$keyword" "$html_file" | wc -l)
            total_count=$((total_count + count))
            if [ $count -gt 0 ]; then
                echo "    $html_file: $count 次"
            fi
        fi
    done
    echo "    总计: $total_count 次"
    echo ""
done

# 4. 章节编号一致性检查
echo "📚 4. 章节编号一致性检查"
echo "======================"

echo "🔍 检查章节编号格式:"
for html_file in [0-9][0-9]-*.html; do
    if [[ -f "$html_file" ]]; then
        # 提取文件名中的编号
        file_number=$(echo "$html_file" | grep -o '^[0-9][0-9]')
        
        # 检查HTML内容中的编号
        content_numbers=$(grep -o '第[一二三四五六七八九十\d]+章\|Chapter\s*[0-9]\+' "$html_file" | head -3)
        
        echo "  📄 $html_file:"
        echo "    文件编号: $file_number"
        echo "    内容编号: $content_numbers"
        echo ""
    fi
done

# 5. 多语言一致性检查
echo "🌍 5. 多语言一致性检查"
echo "===================="

# 检查中英文混用情况
echo "🔍 检查语言使用:"
for html_file in [0-9][0-9]-*.html; do
    if [[ -f "$html_file" ]]; then
        # 统计中文字符
        chinese_chars=$(grep -o '[\u4e00-\u9fff]' "$html_file" | wc -l)
        
        # 统计英文字符
        english_chars=$(grep -o '[a-zA-Z]' "$html_file" | wc -l)
        
        # 统计数字
        number_chars=$(grep -o '[0-9]' "$html_file" | wc -l)
        
        total_text=$((chinese_chars + english_chars + number_chars))
        
        if [ $total_text -gt 0 ]; then
            chinese_ratio=$((chinese_chars * 100 / total_text))
            english_ratio=$((english_chars * 100 / total_text))
            
            echo "  📊 $html_file:"
            echo "    中文: $chinese_chars ($chinese_ratio%)"
            echo "    英文: $english_chars ($english_ratio%)"
            echo "    数字: $number_chars"
            echo ""
        fi
    fi
done

# 6. 引用和参考文献检查
echo "📚 6. 引用和参考文献检查"
echo "======================"

echo "🔍 检查引用格式:"
for html_file in [0-9][0-9]-*.html; do
    if [[ -f "$html_file" ]]; then
        # 检查脚注
        footnotes=$(grep -c 'footnote\|注[0-9]\|参考文献' "$html_file")
        
        # 检查引用标记
        citations=$(grep -c '\[[0-9]\]\|([0-9]\{4\})\|et al\|等' "$html_file")
        
        # 检查参考文献列表
        references=$(grep -c '参考文献\|References\|Bibliography' "$html_file")
        
        if [ $footnotes -gt 0 ] || [ $citations -gt 0 ] || [ $references -gt 0 ]; then
            echo "  📚 $html_file:"
            echo "    脚注: $footnotes"
            echo "    引用: $citations"
            echo "    参考文献列表: $references"
            echo ""
        fi
    fi
done

# 7. 生成详细检查报告
echo "📋 7. 生成详细检查报告"
echo "=================="

detailed_report="detailed-consistency-check/detailed-consistency-report-$(date +%Y%m%d-%H%M%S).txt"

{
    echo "医美消费心理学电子书内容深度一致性检查报告"
    echo "============================================"
    echo "检查时间: $(date)"
    echo "检查目录: $(pwd)"
    echo ""
    echo "检查范围:"
    echo "- HTML文件: $(find . -name "[0-9][0-9]-*.html" | wc -l) 个章节文件"
    echo "- Markdown文件: $(find .. -name "[0-9][0-9]-*.md" | wc -l) 个原稿文件"
    echo "- 专业术语检查: ${#keywords[@]} 个关键词"
    echo ""
    echo "检查项目:"
    echo "✅ 文件结构完整性"
    echo "✅ 内容质量分析"
    echo "✅ 章节编号一致性"
    echo "✅ 专业术语使用"
    echo "✅ 多语言一致性"
    echo "✅ 引用格式检查"
    echo ""
    echo "建议:"
    echo "1. 确保所有专业术语使用一致"
    echo "2. 保持章节编号格式统一"
    echo "3. 检查中英文混用的合理性"
    echo "4. 验证引用格式的规范性"
    echo "5. 确保内容保留率在合理范围内"
} > "$detailed_report"

echo "📄 详细检查报告已生成: $detailed_report"

# 8. 完成
echo "✅ 内容深度一致性检查完成！"
echo ""
echo "📊 检查摘要:"
echo "- 分析了 $(find . -name "[0-9][0-9]-*.html" | wc -l) 个HTML章节文件"
echo "- 对比了 $(find .. -name "[0-9][0-9]-*.md" | wc -l) 个Markdown原稿文件"
echo "- 检查了 ${#keywords[@]} 个专业术语"
echo "- 生成了详细内容分析报告"
echo ""
echo "🔍 详细结果请查看: detailed-consistency-check/"