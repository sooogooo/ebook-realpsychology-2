# 🚀 Quick Deployment Guide
# 医美消费心理学网站快速部署指南

## ⚡ 一键部署 One-Click Deploy

### 🌟 推荐：Netlify (最简单)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/medical-aesthetics-psychology)

### 🚀 Vercel (性能优秀)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/medical-aesthetics-psychology)

### ☁️ Cloudflare Pages (免费 + CDN)
[![Deploy to Cloudflare Pages](https://cloudflare.com/pages/button.svg)](https://github.com/your-username/medical-aesthetics-psychology)

---

## 📋 快速开始 Quick Start

### 1️⃣ 克隆项目 Clone Repository

```bash
git clone https://github.com/your-username/medical-aesthetics-psychology.git
cd medical-aesthetics-psychology
```

### 2️⃣ 安装依赖 Install Dependencies

```bash
npm install
```

### 3️⃣ 本地运行 Local Development

```bash
# 开发模式
npm run serve:development

# 构建预览
npm run build:production
npm run serve:production
```

### 4️⃣ 选择部署平台 Choose Platform

| 平台 Platform | 难度 Difficulty | 费用 Cost | 性能 Performance | 推荐 Recommended |
|---------------|----------------|-----------|------------------|------------------|
| Netlify | ⭐ 简单 | 免费 | 优秀 | ✅ 推荐 |
| Vercel | ⭐ 简单 | 免费 | 优秀 | ✅ 推荐 |
| Cloudflare Pages | ⭐ 简单 | 免费 | 优秀 | ✅ 推荐 |
| GitHub Pages | ⭐⭐ 中等 | 免费 | 良好 | ✅ 适合开源 |
| AWS S3 + CloudFront | ⭐⭐⭐⭐ 困难 | 付费 | 优秀 | 企业级 |
| 阿里云 OSS | ⭐⭐ 中等 | 付费 | 良好 | 中国大陆 |

---

## 🎯 推荐部署方案 Recommended Deployments

### 方案一：Netlify (初学者首选)

```bash
# 1. 前往 https://netlify.com 注册账号
# 2. 点击 "New site from Git"
# 3. 连接你的 GitHub 仓库
# 4. 使用以下设置：
Build command: npm run build:production
Publish directory: dist
```

### 方案二：Vercel (性能优先)

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel --prod
```

### 方案三：GitHub Pages (开源项目)

```bash
# 1. 在仓库设置中启用 GitHub Pages
# 2. 选择 main 分支和 /root 文件夹
# 3. 推送代码即可自动部署
git push origin main
```

---

## 🔧 环境配置 Environment Setup

### 必需环境变量 Required Environment Variables

```bash
NODE_ENV=production
DOMAIN=medical-aesthetics-psychology.com
```

### 可选环境变量 Optional Environment Variables

```bash
# 分析工具
ANALYTICS_ID=your-google-analytics-id
UMAMI_WEBSITE_ID=your-umami-id

# 监控
SLACK_WEBHOOK_URL=your-slack-webhook
LHCI_GITHUB_APP_TOKEN=your-lighthouse-token

# 云平台凭证
AWS_ACCESS_KEY_ID=your-aws-key
NETLIFY_AUTH_TOKEN=your-netlify-token
```

---

## 📦 构建优化 Build Optimization

### 生产构建 Production Build

```bash
# 完整生产构建（包含所有优化）
npm run build:production

# 仅构建
npm run build

# 图片优化
npm run optimize-images

# 压缩文件
npm run compress
```

### 性能分析 Performance Analysis

```bash
# Lighthouse 性能测试
npm run test:lighthouse

# 打包分析
npm run analyze

# HTML 验证
npm run test:validation
```

---

## 🌍 多平台部署 Multi-Platform Deployment

### 自动化 CI/CD Automated CI/CD

项目已配置 GitHub Actions，支持自动部署到多个平台：

```yaml
# 推送到 main 分支后自动部署
git push origin main

# Pull Request 自动创建预览环境
# 支持多平台并行部署
# 自动性能测试和通知
```

### 手动部署命令 Manual Deployment Commands

```bash
# Netlify
npm run deploy:netlify

# Vercel
npm run deploy:vercel

# AWS S3
npm run deploy:aws

# 阿里云 OSS
npm run deploy:aliyun

# 腾讯云 COS
npm run deploy:tencent
```

---

## 🔍 部署验证 Deployment Verification

### 检查清单 Deployment Checklist

- [ ] 网站首页可以正常访问
- [ ] 所有页面链接正常工作
- [ ] 图片和资源加载正常
- [ ] 移动端适配正常
- [ ] 性能分数达标 (Lighthouse > 90)
- [ ] SSL 证书正常
- [ ] 域名解析正确
- [ ] 分析工具正常工作

### 性能基准 Performance Benchmarks

- **Lighthouse 分数**: > 90/100
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### 验证工具 Verification Tools

```bash
# 在线工具
# Lighthouse: https://pagespeed.web.dev/
# GTmetrix: https://gtmetrix.com/
# WebPageTest: https://www.webpagetest.org/

# 本地工具
npm run test:lighthouse
npx lighthouse https://your-domain.com
```

---

## 🚨 故障排除 Troubleshooting

### 常见问题 Common Issues

#### 构建失败 Build Failed
```bash
# 清理缓存重新安装
npm run clean
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 需要 18+
npm --version   # 需要 9+
```

#### 部署失败 Deployment Failed
```bash
# 检查构建输出
npm run build:production
ls -la dist/

# 检查环境变量
env | grep -E "(NODE_ENV|DOMAIN)"
```

#### 性能问题 Performance Issues
```bash
# 运行性能测试
npm run test:lighthouse

# 分析打包大小
npm run analyze

# 优化图片
npm run optimize-images
```

#### 权限问题 Permission Issues
```bash
# 文件权限
chmod +x deploy/chinese-platforms/*.sh

# 目录权限
chmod -R 755 dist/
```

### 获取帮助 Get Help

1. **查看日志**: 检查部署平台的构建日志
2. **本地测试**: 在本地重现问题
3. **搜索 Issues**: 查看 GitHub Issues
4. **联系支持**: bccsw@cqlhlg.work

---

## 📈 性能监控 Performance Monitoring

### 内置监控 Built-in Monitoring

项目集成了多种监控工具：

```javascript
// 性能监控
import { performanceMonitor } from './analytics/performance-monitoring.js';

// 用户行为分析
import { umamiAnalytics } from './analytics/umami-config.js';

// 可用性监控
import { uptimeMonitor } from './monitoring/uptime-monitoring.js';
```

### 监控指标 Monitoring Metrics

- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB
- **用户体验**: 页面加载时间，交互延迟
- **错误率**: JavaScript 错误，API 失败
- **用户行为**: 页面浏览，停留时间，滚动深度

### 实时监控 Real-time Monitoring

访问监控面板：
- 性能报告: `/api/performance`
- 健康状态: `/api/health`
- 错误日志: `/api/errors`

---

## 🔐 安全配置 Security Configuration

### 基础安全 Basic Security

```nginx
# 安全 HTTP 头
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 高级安全 Advanced Security

- **HTTPS 强制**: 所有平台自动 HTTPS
- **CSP 策略**: 内容安全策略
- **Rate Limiting**: API 访问限制
- **DDoS 防护**: Cloudflare 保护
- **定期扫描**: 安全漏洞检测

---

## 📞 支持与联系 Support & Contact

### 技术支持 Technical Support

- **邮箱**: bccsw@cqlhlg.work
- **Issues**: GitHub Issues
- **文档**: [完整部署指南](DEPLOYMENT_GUIDE.md)

### 更新更新 Updates

```bash
# 获取最新代码
git pull origin main

# 重新构建和部署
npm run build:production
npm run deploy:production
```

### 社区 Community

- **GitHub**: [项目仓库](https://github.com/your-username/medical-aesthetics-psychology)
- **讨论**: [GitHub Discussions](https://github.com/your-username/medical-aesthetics-psychology/discussions)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/medical-aesthetics-psychology/issues)

---

## 🎉 部署完成！Deployment Complete! 🎉

恭喜！你的医美消费心理学网站已成功部署！

### 下一步 Next Steps

1. ✅ **验证部署**: 确保网站正常访问
2. ✅ **配置域名**: 设置自定义域名
3. ✅ **启用分析**: 配置 Google Analytics 或 Umami
4. ✅ **设置监控**: 启用性能和错误监控
5. ✅ **定期维护**: 定期更新和安全检查

### 有用链接 Useful Links

- **项目主页**: https://github.com/your-username/medical-aesthetics-psychology
- **部署文档**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **API 文档**: [API-DOCS.md](api-docs.md)
- **性能报告**: [Performance Dashboard](/api/performance)

---

*最后更新: 2025年1月 | 版本: v1.0.0 | 维护者: 重庆联合丽格科技有限公司*