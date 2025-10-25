#!/bin/bash

# 腾讯云COS部署脚本
# 部署医美消费心理学网站到腾讯云COS

set -e

# 配置变量
REGION="ap-beijing"
BUCKET_NAME="medical-aesthetics-psychology-1250000000"
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

# 检查腾讯云CLI是否安装
check_tencent_cli() {
    if ! command -v tccli &> /dev/null && ! command -v coscli &> /dev/null; then
        log_error "腾讯云CLI未安装，请先安装: https://cloud.tencent.com/document/product/440/6196"
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

# 同步文件到COS
sync_to_cos() {
    log_info "开始同步文件到腾讯云COS..."

    # 配置静态网站托管
    if command -v tccli &> /dev/null; then
        tccli cos PutBucketWebsite \
            --cli-unfold \
            --Region $REGION \
            --Bucket $BUCKET_NAME \
            --WebsiteConfiguration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'
    fi

    # 使用coscli同步文件
    if command -v coscli &> /dev/null; then
        coscli sync $BUILD_DIR/ cos://$BUCKET_NAME/ \
            --recursive \
            --exclude "*.DS_Store" \
            --exclude "*.log" \
            --part-size 1 \
            --thread-num 5
    else
        log_error "coscli未安装，无法同步文件"
        exit 1
    fi

    # 设置访问权限
    coscli put-bucket-acl cos://$BUCKET_NAME/ \
        --access-control public-read

    # 设置缓存策略
    log_info "设置缓存策略..."

    # HTML文件 - 不缓存
    coscli cos chmod cos://$BUCKET_NAME/*.html \
        --acl default \
        --header "Cache-Control:no-cache, must-revalidate"

    # CSS/JS文件 - 长期缓存
    coscli cos chmod cos://$BUCKET_NAME/*.css \
        --acl default \
        --header "Cache-Control:public, max-age=31536000, immutable"

    coscli cos chmod cos://$BUCKET_NAME/*.js \
        --acl default \
        --header "Cache-Control:public, max-age=31536000, immutable"

    # 图片文件 - 长期缓存
    coscli cos chmod cos://$BUCKET_NAME/*.png \
        --acl default \
        --header "Cache-Control:public, max-age=31536000, immutable"

    coscli cos chmod cos://$BUCKET_NAME/*.jpg \
        --acl default \
        --header "Cache-Control:public, max-age=31536000, immutable"

    coscli cos chmod cos://$BUCKET_NAME/*.svg \
        --acl default \
        --header "Cache-Control:public, max-age=31536000, immutable"
}

# 设置CDN加速
setup_cdn() {
    log_info "配置CDN加速..."

    # 检查CDN域名是否存在
    if command -v tccli &> /dev/null; then
        DOMAIN_STATUS=$(tccli cdn DescribeDomainsConfig \
            --cli-unfold \
            --Filters '[{"Name":"domain","Values":["'$DOMAIN'"]}]' \
            | jq '.DomainSet[0].DomainStatus' 2>/dev/null || echo "")

        if [ "$DOMAIN_STATUS" = "\"online\"" ]; then
            log_warn "CDN域名已在线，刷新缓存..."
            tccli cdn PurgePathCache \
                --cli-unfold \
                --Paths '["https://'$DOMAIN'/"]' \
                --FlushType flush
        else
            log_info "CDN域名未找到，请在腾讯云CDN控制台手动配置"
        fi
    fi
}

# 设置HTTPS证书
setup_ssl() {
    log_info "配置HTTPS证书..."
    log_info "请在腾讯云SSL证书控制台配置证书: https://console.cloud.tencent.com/ssl"
}

# 设置压缩
setup_compression() {
    log_info "启用Gzip压缩..."
    # 在腾讯云CDN控制台或CLI中配置压缩
    if command -v tccli &> /dev/null; then
        tccli cdn UpdateDomainConfig \
            --cli-unfold \
            --Domain $DOMAIN \
            --Origin '{"Origins":[{"Origins":["'$BUCKET_NAME'."cos."$REGION".myqcloud.com"],"Type":"COS","OriginType":"cos"}]}'
        # 添加更多配置...
    fi
}

# 主函数
main() {
    log_info "开始部署到腾讯云COS..."

    check_tencent_cli
    check_build_dir

    sync_to_cos
    setup_cdn
    setup_ssl
    setup_compression

    log_info "✅ 部署完成！"
    log_info "🌐 网站地址: https://$DOMAIN"
    log_info "📊 监控面板: https://console.cloud.tencent.com/cos"
    log_info "🚀 CDN管理: https://console.cloud.tencent.com/cdn"
}

# 错误处理
trap 'log_error "部署失败！"; exit 1' ERR

# 执行主函数
main "$@"