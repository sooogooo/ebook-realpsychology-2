# 医美消费心理学网站部署指南
# Medical Aesthetics Psychology Website Deployment Guide

## 📋 目录 Table of Contents

1. [快速开始 Quick Start](#快速开始-quick-start)
2. [平台部署指南 Platform Deployment Guides](#平台部署指南-platform-deployment-guides)
   - [Netlify](#netlify-部署)
   - [Vercel](#vercel-部署)
   - [GitHub Pages](#github-pages-部署)
   - [Cloudflare Pages](#cloudflare-pages-部署)
   - [AWS S3 + CloudFront](#aws-s3--cloudfront-部署)
   - [中国平台 Chinese Platforms](#中国平台部署)
3. [CI/CD自动化](#cicd自动化)
4. [性能优化](#性能优化)
5. [监控和分析](#监控和分析)
6. [故障排除](#故障排除)

## 🚀 快速开始 Quick Start

### 前置要求 Prerequisites

- Node.js 18+ 和 npm 9+
- Git 2.0+
- 对应平台的账号（Netlify、Vercel等）

### 本地开发 Local Development

```bash
# 克隆项目
git clone https://github.com/your-username/medical-aesthetics-psychology.git
cd medical-aesthetics-psychology

# 安装依赖
npm install

# 开发模式运行
npm run serve:development

# 构建生产版本
npm run build:production

# 预览构建结果
npm run serve:production
```

## 📦 平台部署指南 Platform Deployment Guides

### Netlify 部署

#### 1. 准备工作

- 注册 [Netlify](https://netlify.com) 账号
- 准备你的 GitHub/GitLab 仓库

#### 2. 部署步骤

##### 方法一：拖拽部署（最快 Drag & Drop）

```bash
# 构建项目
npm run build:production

# 将 dist 文件夹拖拽到 Netlify 部署界面
```

##### 方法二：Git 集成部署

1. 登录 Netlify，点击 "New site from Git"
2. 选择 Git 提供商（GitHub）
3. 选择仓库：`medical-aesthetics-psychology`
4. 配置构建设置：
   ```
   Build command: npm run build:production
   Publish directory: dist
   ```

#### 3. 环境变量设置

在 Netlify 控制台设置以下环境变量：

```
NODE_ENV=production
ANALYTICS_ID=your-google-analytics-id
LHCI_GITHUB_APP_TOKEN=your-lighthouse-token
```

#### 4. 域名配置

1. 进入 Domain settings
2. 添加自定义域名：`medical-aesthetics-psychology.com`
3. 配置 DNS 指向 Netlify
4. 启用 HTTPS

#### 5. 高级配置

使用项目根目录的 `netlify.toml` 配置文件进行高级设置。

#### 6. 部署命令

```bash
# 使用 Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=dist
```

### Vercel 部署

#### 1. 准备工作

- 注册 [Vercel](https://vercel.com) 账号
- 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 部署步骤

##### 方法一：Vercel CLI

```bash
# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署列表
vercel ls
```

##### 方法二：Git 集成

1. 登录 Vercel Dashboard
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 配置设置：
   ```
   Framework Preset: Other
   Build Command: npm run build:production
   Output Directory: dist
   Install Command: npm ci
   ```

#### 3. 环境变量

在 Vercel Dashboard 设置环境变量：

```
NODE_ENV=production
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

#### 4. 域名配置

1. 进入 Settings → Domains
2. 添加域名：`medical-aesthetics-psychology.com`
3. 配置 DNS 记录

#### 5. 配置文件

使用项目根目录的 `vercel.json` 进行自定义配置。

### GitHub Pages 部署

#### 1. 仓库设置

1. 进入 GitHub 仓库设置
2. 找到 Pages 部分
3. Source 选择 "Deploy from a branch"
4. Branch 选择 `main`，文件夹选择 `/root`

#### 2. Jekyll 配置

由于 GitHub Pages 使用 Jekyll，项目包含 `_config.yml` 配置文件：

```yaml
# GitHub Pages Jekyll Configuration
title: "医美消费心理学"
description: "Medical Aesthetics Consumer Psychology"
url: "https://your-username.github.io"
baseurl: "/medical-aesthetics-psychology"
```

#### 3. 自动部署

使用 GitHub Actions 自动部署：

```bash
# GitHub Actions 已配置，推送代码即可触发部署
git add .
git commit -m "Update website"
git push origin main
```

#### 4. 自定义域名

1. 在仓库设置中添加自定义域名
2. 配置 CNAME 文件或 DNS 记录

### Cloudflare Pages 部署

#### 1. 准备工作

- 注册 [Cloudflare](https://cloudflare.com) 账号
- 将域名托管到 Cloudflare

#### 2. 部署步骤

1. 登录 Cloudflare Dashboard
2. 进入 Pages 服务
3. 点击 "Create a project"
4. 连接 GitHub 仓库
5. 配置构建设置：
   ```
   Build command: npm run build:production
   Build output directory: dist
   ```

#### 3. 环境变量

在 Cloudflare Pages 设置环境变量：
```
NODE_ENV=production
CLOUDFLARE_API_TOKEN=your-token
```

#### 4. 自定义域名

1. 进入项目设置
2. 添加自定义域名
3. 配置 DNS 记录（自动配置）

#### 5. 高级功能

- 使用 `_headers` 文件配置 HTTP 头
- 使用 `_redirects` 文件配置 URL 重定向

### AWS S3 + CloudFront 部署

#### 1. 准备工作

- AWS 账号和凭证
- 安装 AWS CLI

```bash
pip install awscli
aws configure
```

#### 2. S3 配置

```bash
# 创建 S3 存储桶
aws s3 mb s3://medical-aesthetics-psychology-website

# 启用静态网站托管
aws s3 website s3://medical-aesthetics-psychology-website \
  --index-document index.html \
  --error-document index.html

# 设置公共读取权限
aws s3api put-bucket-policy \
  --bucket medical-aesthetics-psychology-website \
  --policy file://aws-deploy/s3-bucket-policy.json
```

#### 3. CloudFront 配置

```bash
# 创建 CloudFront 分配
aws cloudfront create-distribution \
  --distribution-config file://aws-deploy/cloudfront-config.json
```

#### 4. 部署脚本

```bash
# 构建项目
npm run build:production

# 同步到 S3
aws s3 sync dist/ s3://medical-aesthetics-psychology-website \
  --delete \
  --exclude "*.DS_Store"

# 清除 CloudFront 缓存
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABCDEF \
  --paths "/*"
```

#### 5. 环境变量

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

### 中国平台部署

#### 阿里云 OSS 部署

```bash
# 1. 安装阿里云 CLI
pip install aliyun-cli

# 2. 配置凭证
aliyun configure

# 3. 运行部署脚本
chmod +x deploy/chinese-platforms/aliyun-oss.sh
./deploy/chinese-platforms/aliyun-oss.sh
```

环境变量：
```bash
export ALIYUN_ACCESS_KEY_ID=your-access-key-id
export ALIYUN_ACCESS_KEY_SECRET=your-access-secret
export ALIYUN_OSS_BUCKET=medical-aesthetics-psychology
export ALIYUN_OSS_REGION=oss-cn-hangzhou
```

#### 腾讯云 COS 部署

```bash
# 1. 安装腾讯云 CLI
pip install tccli

# 2. 配置凭证
tccli configure

# 3. 运行部署脚本
chmod +x deploy/chinese-platforms/tencent-cos.sh
./deploy/chinese-platforms/tencent-cos.sh
```

环境变量：
```bash
export TENCENT_SECRET_ID=your-secret-id
export TENCENT_SECRET_KEY=your-secret-key
export TENCENT_COS_BUCKET=medical-aesthetics-psychology-1250000000
export TENCENT_COS_REGION=ap-beijing
```

## 🔄 CI/CD 自动化

### GitHub Actions 工作流

项目已配置完整的 GitHub Actions 工作流（`.github/workflows/deploy.yml`）：

#### 触发条件
- 推送到 main 分支：生产部署
- 推送到 develop 分支：预览部署
- Pull Request：预览环境
- 定时任务：每日检查

#### 部署阶段
1. **构建和测试**
   - 代码检查
   - 构建优化
   - Lighthouse 性能测试
   - 安全扫描

2. **预览部署**
   - Netlify 预览环境
   - 自动评论 PR 链接

3. **生产部署**
   - 多平台并行部署
   - 性能监控
   - 通知推送

#### 密钥配置

在 GitHub 仓库设置中添加以下 Secrets：

```
# Netlify
NETLIFY_AUTH_TOKEN=netlify-token
NETLIFY_SITE_ID=netlify-site-id

# Vercel
VERCEL_TOKEN=vercel-token
VERCEL_ORG_ID=vercel-org-id
VERCEL_PROJECT_ID=vercel-project-id

# AWS
AWS_ACCESS_KEY_ID=aws-access-key
AWS_SECRET_ACCESS_KEY=aws-secret-key
AWS_REGION=us-east-1
AWS_CLOUDFRONT_DISTRIBUTION_ID=cloudfront-id

# 阿里云
ALIYUN_ACCESS_KEY_ID=aliyun-access-key
ALIYUN_ACCESS_KEY_SECRET=aliyun-secret

# 腾讯云
TENCENT_SECRET_ID=tencent-secret-id
TENCENT_SECRET_KEY=tencent-secret-key

# 监控
SLACK_WEBHOOK_URL=slack-webhook
LHCI_GITHUB_APP_TOKEN=lighthouse-token
```

## ⚡ 性能优化

### 构建优化

```bash
# 生产构建（包含所有优化）
npm run build:production

# 图片优化
npm run optimize-images

# 压缩文件
npm run compress

# 分析打包大小
npm run analyze
```

### 缓存策略

配置了多级缓存：
- **HTML 文件**：无缓存，必须重新验证
- **CSS/JS 文件**：长期缓存（1年）
- **图片文件**：长期缓存（1年）
- **SVG 文件**：长期缓存（1年）

### 压缩策略

- **Gzip**：所有文本文件
- **Brotli**：更好的压缩率
- **图片优化**：WebP、AVIF 格式支持
- **代码压缩**：HTML、CSS、JS 压缩

### CDN 配置

建议使用全球 CDN：
- **Netlify/Vercel**：内置全球 CDN
- **Cloudflare**：免费 CDN + 安全防护
- **AWS CloudFront**：企业级 CDN

## 📊 监控和分析

### 性能监控

项目集成了多种性能监控：

```javascript
// Core Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

// 自定义性能监控
import { performanceMonitor } from './analytics/performance-monitoring.js';
```

### 分析工具

1. **Umami Analytics**：开源、隐私友好的分析
2. **Google Analytics**：标准分析工具
3. **自定义事件追踪**：用户行为分析

### 错误监控

```javascript
// 错误追踪
window.addEventListener('error', (event) => {
  // 发送错误信息到监控服务
});

// API 错误监控
fetch('/api/monitoring', {
  method: 'POST',
  body: JSON.stringify(errorData)
});
```

### 健康检查

定期健康检查端点：
- `/api/health`：基本健康状态
- `/api/health/performance`：性能指标
- `/api/health/monitoring`：监控状态

## 🔧 故障排除

### 常见问题

#### 1. 构建失败

```bash
# 清理缓存
npm run clean
rm -rf node_modules
npm install

# 检查 Node.js 版本
node --version  # 应该是 18+
npm --version   # 应该是 9+
```

#### 2. 部署失败

```bash
# 检查构建结果
npm run build:production
ls -la dist/

# 检查环境变量
env | grep -E "(NODE_ENV|AWS_|NETLIFY_|VERCEL_)"
```

#### 3. 性能问题

```bash
# 运行性能分析
npm run test:lighthouse

# 检查打包大小
npm run analyze

# 优化图片
npm run optimize-images
```

#### 4. 权限问题

```bash
# AWS S3 权限
aws s3api get-bucket-policy --bucket your-bucket

# CloudFront 权限
aws cloudfront get-distribution-config --id your-distribution-id
```

### 调试模式

```bash
# 启用调试模式
export DEBUG=*
export NODE_ENV=development

# 查看详细日志
npm run build:production -- --verbose
```

### 联系支持

如果遇到无法解决的问题，请：

1. 查看 GitHub Issues
2. 检查部署平台文档
3. 联系技术支持：`bccsw@cqlhlg.work`

## 📚 相关文档

- [项目 README.md](README.md)
- [API 文档](api-docs.md)
- [性能基准](performance-benchmarks.md)
- [安全指南](security-guide.md)

## 🔄 版本更新

部署新版本的步骤：

1. 更新代码
2. 运行测试
3. 构建项目
4. 部署到预览环境
5. 验证功能
6. 部署到生产环境
7. 监控性能

```bash
# 完整更新流程
git pull origin main
npm test
npm run build:production
npm run deploy:preview
# 验证后...
npm run deploy:production
```

---

*最后更新：2025年1月*
*版本：v1.0.0*
*维护者：重庆联合丽格科技有限公司*