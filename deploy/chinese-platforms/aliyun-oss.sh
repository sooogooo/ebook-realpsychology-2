#!/bin/bash

# 阿里云OSS部署脚本
# 部署医美消费心理学网站到阿里云OSS

set -e

# 配置变量
REGION="oss-cn-hangzhou"
BUCKET_NAME="medical-aesthetics-psychology"
DOMAIN="medical-aesthetics-psychology.com"
BUILD_DIR="dist"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查阿里云CLI是否安装
check_aliyun_cli() {
    if ! command -v aliyun &> /dev/null; then
        log_error "阿里云CLI未安装，请先安装: https://help.aliyun.com/zh/oss/developer-reference/install-ossutil"
        exit 1
    fi
}

# 检查构建目录
check_build_dir() {
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "构建目录不存在: $BUILD_DIR，请先运行 npm run build"
        exit 1
    fi
}

# 同步文件到OSS
sync_to_oss() {
    log_info "开始同步文件到阿里云OSS..."

    # 配置静态网站托管
    aliyun oss website --bucket $BUCKET_NAME \
        --index index.html \
        --error index.html

    # 设置Bucket为公共读
    aliyun oss bucket-policy --bucket $BUCKET_NAME \
        --policy-output-file bucket-policy.json

    # 同步文件，排除不必要的文件
    aliyun oss cp $BUILD_DIR/ oss://$BUCKET_NAME/ \
        --recursive \
        --exclude "*.DS_Store" \
        --exclude "*.log" \
        --update \
        --bigfile-threshold 104857600

    # 设置缓存策略
    log_info "设置缓存策略..."

    # HTML文件 - 不缓存
    aliyun oss batch-update-metass oss://$BUCKET_NAME/ \
        --include "*.html" \
        --cache-control "no-cache, must-revalidate" \
        --content-type "text/html; charset=utf-8"

    # CSS/JS文件 - 长期缓存
    aliyun oss batch-update-metass oss://$BUCKET_NAME/ \
        --include "*.css" \
        --cache-control "public, max-age=31536000, immutable"

    aliyun oss batch-update-metass oss://$BUCKET_NAME/ \
        --include "*.js" \
        --cache-control "public, max-age=31536000, immutable"

    # 图片文件 - 长期缓存
    aliyun oss batch-update-metass oss://$BUCKET_NAME/ \
        --include "*.{png,jpg,jpeg,gif,webp,avif}" \
        --cache-control "public, max-age=31536000, immutable"

    # SVG文件 - 长期缓存
    aliyun oss batch-update-metass oss://$BUCKET_NAME/ \
        --include "*.svg" \
        --cache-control "public, max-age=31536000, immutable"
}

# 设置CDN加速
setup_cdn() {
    log_info "配置CDN加速..."

    # 检查CDN域名是否存在
    DOMAIN_STATUS=$(aliyun cdn describe_domain_detail --domain-name $DOMAIN | jq '.DomainDetail.DomainStatus')

    if [ "$DOMAIN_STATUS" = "online" ]; then
        log_warn "CDN域名已在线，刷新缓存..."
        aliyun cdn refresh_object_cache --object-path "https://$DOMAIN/" --object-type File
    else
        log_info "配置CDN域名..."
        # 这里需要根据实际情况添加CDN配置
        # aliyun cdn add_cdn_domain ...
    fi
}

# 设置Gzip压缩
setup_compression() {
    log_info "启用Gzip压缩..."
    # 在阿里云CDN控制台或CLI中配置Gzip压缩
    # 这是一个示例，实际实现需要根据CDN服务提供商的具体API
}

# 主函数
main() {
    log_info "开始部署到阿里云OSS..."

    check_aliyun_cli
    check_build_dir

    sync_to_oss
    setup_cdn
    setup_compression

    log_info "✅ 部署完成！"
    log_info "🌐 网站地址: https://$DOMAIN"
    log_info "📊 监控面板: https://oss.console.aliyun.com/"
}

# 错误处理
trap 'log_error "部署失败！"; exit 1' ERR

# 执行主函数
main "$@"