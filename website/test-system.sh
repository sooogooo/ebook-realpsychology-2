#!/bin/bash

# 医美消费心理学可视化系统测试脚本
# Medical Aesthetics Consumer Psychology Visualization System Test Script

echo "🧠 医美消费心理学可视化系统测试"
echo "=================================="

# 设置变量
SERVER_URL="http://localhost:8000"
TEST_RESULTS=()

# 测试函数
test_url() {
    local url="$1"
    local name="$2"
    local expected_code="${3:-200}"
    
    echo "🔍 测试: $name"
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response_code" = "$expected_code" ]; then
        echo "✅ $name - 通过 (HTTP $response_code)"
        TEST_RESULTS+=("✅ $name - 通过")
        return 0
    else
        echo "❌ $name - 失败 (HTTP $response_code, 期望 $expected_code)"
        TEST_RESULTS+=("❌ $name - 失败")
        return 1
    fi
}

# 测试文件内容
test_file_content() {
    local url="$1"
    local name="$2"
    local search_term="$3"
    
    echo "🔍 测试: $name"
    local content=$(curl -s "$url" 2>/dev/null)
    
    if [[ "$content" == *"$search_term"* ]]; then
        echo "✅ $name - 通过 (找到 '$search_term')"
        TEST_RESULTS+=("✅ $name - 通过")
        return 0
    else
        echo "❌ $name - 失败 (未找到 '$search_term')"
        TEST_RESULTS+=("❌ $name - 失败")
        return 1
    fi
}

# 开始测试
echo "🚀 开始系统测试..."

# 测试主要页面
echo ""
echo "📄 测试主要页面..."
test_url "$SERVER_URL" "首页"
test_url "$SERVER_URL/index.html" "首页 (HTML)"
test_url "$SERVER_URL/emotional-flow.html" "情绪状态流程图"
test_url "$SERVER_URL/decision-tree.html" "交互式决策树"
test_url "$SERVER_URL/cultural-comparison.html" "文化差异对比分析"
test_url "$SERVER_URL/data-visualization.html" "数据可视化"
test_url "$SERVER_URL/technology-timeline.html" "技术发展时间线"
test_url "$SERVER_URL/psychological-assessment.html" "心理评估工具"
test_url "$SERVER_URL/test-system.html" "系统测试页面"

# 测试资源文件
echo ""
echo "🎨 测试资源文件..."
test_url "$SERVER_URL/assets/css/main.css" "主样式文件"
test_url "$SERVER_URL/assets/css/emotional-flow.css" "情绪流程样式"
test_url "$SERVER_URL/assets/css/decision-tree.css" "决策树样式"
test_url "$SERVER_URL/assets/css/cultural-comparison.css" "文化比较样式"
test_url "$SERVER_URL/assets/css/data-visualization.css" "数据可视化样式"
test_url "$SERVER_URL/assets/css/technology-timeline.css" "技术时间线样式"
test_url "$SERVER_URL/assets/css/psychological-assessment.css" "心理评估样式"

test_url "$SERVER_URL/assets/js/emotional-flow.js" "情绪流程脚本"
test_url "$SERVER_URL/assets/js/decision-tree.js" "决策树脚本"
test_url "$SERVER_URL/assets/js/cultural-comparison.js" "文化比较脚本"
test_url "$SERVER_URL/assets/js/data-visualization.js" "数据可视化脚本"
test_url "$SERVER_URL/assets/js/technology-timeline.js" "技术时间线脚本"
test_url "$SERVER_URL/assets/js/psychological-assessment.js" "心理评估脚本"

# 测试文件内容
echo ""
echo "🔍 测试文件内容..."
test_file_content "$SERVER_URL/assets/js/emotional-flow.js" "EmotionalFlow 类" "class EmotionalFlow"
test_file_content "$SERVER_URL/assets/js/decision-tree.js" "DecisionTree 类" "class DecisionTree"
test_file_content "$SERVER_URL/assets/js/technology-timeline.js" "TechnologyTimeline 类" "class TechnologyTimeline"
test_file_content "$SERVER_URL/assets/js/cultural-comparison.js" "CulturalComparison 类" "class CulturalComparison"
test_file_content "$SERVER_URL/assets/js/data-visualization.js" "DataVisualization 类" "class PsychologyDataVisualization"
test_file_content "$SERVER_URL/assets/js/psychological-assessment.js" "PsychologicalAssessment 类" "class PsychologicalAssessment"

# 测试外部依赖
echo ""
echo "🌐 测试外部依赖..."
test_url "https://d3js.org/d3.v7.min.js" "D3.js 库"
test_url "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" "Google Fonts"

# 测试 SVG 资源
echo ""
echo "🎭 测试 SVG 资源..."
test_url "$SERVER_URL/assets/svg/concepts/decision-process.svg" "决策流程图"
test_url "$SERVER_URL/assets/svg/concepts/stakeholders.svg" "利益相关者图"
test_url "$SERVER_URL/assets/svg/concepts/technology-adoption.svg" "技术采用图"

# 测试文档章节
echo ""
echo "📚 测试文档章节..."
test_url "$SERVER_URL/00-preface-and-introduction.html" "前言和导论"
test_url "$SERVER_URL/01-multidimensional-perspectives.html" "多维视角"
test_url "$SERVER_URL/02-research-methods-and-critical-thinking.html" "研究方法"
test_url "$SERVER_URL/03-consumption-motivation-and-psychological-needs.html" "消费动机"
test_url "$SERVER_URL/04-information-processing-and-decision-making.html" "信息处理"
test_url "$SERVER_URL/07-ethical-boundaries-of-sales-psychology.html" "伦理边界"
test_url "$SERVER_URL/08-technology-development-and-psychological-adaptation.html" "技术发展"
test_url "$SERVER_URL/08-technology-impact-research.html" "技术影响研究"
test_url "$SERVER_URL/09-cultural-differences-and-globalization.html" "文化差异"
test_url "$SERVER_URL/09-cultural-differences-research.html" "文化差异研究"
test_url "$SERVER_URL/10-future-outlook-and-development-trends.html" "未来展望"

# 统计结果
echo ""
echo "📊 测试结果统计..."
PASSED=0
FAILED=0

for result in "${TEST_RESULTS[@]}"; do
    if [[ "$result" == ✅* ]]; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
done

TOTAL=${#TEST_RESULTS[@]}
echo "总测试数: $TOTAL"
echo "通过: $PASSED"
echo "失败: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "🎉 所有测试通过！系统运行正常。"
    echo "🌐 访问地址: $SERVER_URL"
    echo "🧪 测试页面: $SERVER_URL/test-system.html"
    exit 0
else
    echo ""
    echo "⚠️  有 $FAILED 个测试失败，请检查相关文件。"
    exit 1
fi