# 医美消费心理学网站部署指南

## 部署前准备

### 系统要求
- **Web服务器**: Apache 2.4+ 或 Nginx 1.18+
- **PHP**: 7.4+ (可选，用于后端API)
- **Node.js**: 16+ (可选，用于构建工具)
- **浏览器支持**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### 域名和SSL
- 准备域名 (如: medical-aesthetics-psychology.com)
- 配置SSL证书 (Let's Encrypt或商业证书)
- 设置DNS记录

### 服务器配置
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install nginx git curl -y

# 安装Node.js (可选)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 文件部署

### 1. 获取代码
```bash
# 克隆代码仓库
git clone <repository-url> /var/www/medical-aesthetics-psychology

# 进入项目目录
cd /var/www/medical-aesthetics-psychology

# 设置权限
sudo chown -R www-data:www-data /var/www/medical-aesthetics-psychology
sudo chmod -R 755 /var/www/medical-aesthetics-psychology
```

### 2. 配置Nginx
```nginx
# /etc/nginx/sites-available/medical-aesthetics-psychology
server {
    listen 80;
    server_name medical-aesthetics-psychology.com www.medical-aesthetics-psychology.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name medical-aesthetics-psychology.com www.medical-aesthetics-psychology.com;
    
    # SSL配置
    ssl_certificate /etc/letsencrypt/live/medical-aesthetics-psychology.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/medical-aesthetics-psychology.com/privkey.pem;
    
    # SSL优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    
    # 网站根目录
    root /var/www/medical-aesthetics-psychology;
    index index.html;
    
    # 字符集
    charset utf-8;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/js text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # HTML文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }
    
    # API代理 (可选)
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline'" always;
    
    # 访问日志
    access_log /var/log/nginx/medical-aesthetics-psychology.access.log;
    error_log /var/log/nginx/medical-aesthetics-psychology.error.log;
}
```

### 3. 启用站点
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/medical-aesthetics-psychology /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## SSL证书配置

### 使用Let's Encrypt
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d medical-aesthetics-psychology.com -d www.medical-aesthetics-psychology.com

# 设置自动续期
sudo crontab -e
# 添加以下行:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 性能优化

### 1. 启用HTTP/2
Nginx配置中已包含HTTP/2支持，确保SSL证书正确配置。

### 2. 资源优化
```bash
# 压缩图片 (需要安装ImageMagick)
find . -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) -exec mogrify -quality 85 -strip {} \;

# 压缩SVG
find . -name "*.svg" -exec svgo {} \;

# 压缩CSS/JS (需要安装相关工具)
npm install -g uglify-js clean-css-cli
uglify-js assets/js/*.js -o assets/js/*.min.js
cleancss -o assets/css/*.min.css assets/css/*.css
```

### 3. 启用浏览器缓存
在Nginx配置中已设置静态资源的缓存策略。

### 4. CDN配置 (可选)
```nginx
# 配置CDN源站
upstream cdn_origin {
    server medical-aesthetics-psychology.com;
}

# CDN代理配置
location ~* \.(jpg|jpeg|png|gif|css|js|svg|webp)$ {
    proxy_pass http://cdn_origin;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_pragma;
    proxy_cache_revalidate on;
    proxy_cache_min_uses 1;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
}
```

## 安全配置

### 1. 防火墙设置
```bash
# 安装UFW
sudo apt install ufw -y

# 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. 文件权限
```bash
# 设置正确的文件权限
sudo find /var/www/medical-aesthetics-psychology -type d -exec chmod 755 {} \;
sudo find /var/www/medical-aesthetics-psychology -type f -exec chmod 644 {} \;
sudo chown -R www-data:www-data /var/www/medical-aesthetics-psychology
```

### 3. 禁用目录列表
```nginx
# 在Nginx配置中添加
autoindex off;
```

### 4. 隐藏敏感文件
```nginx
# 隐藏隐藏文件
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

# 隐藏备份文件
location ~ ~$ {
    deny all;
    access_log off;
    log_not_found off;
}
```

## 监控和分析

### 1. 访问日志分析
```bash
# 安装GoAccess
sudo apt install goaccess -y

# 生成实时报告
goaccess /var/log/nginx/medical-aesthetics-psychology.access.log -o /var/www/medical-aesthetics-psychology/analytics/report.html --real-time-html
```

### 2. 性能监控
```bash
# 安装监控工具
sudo apt install htop iotop -y

# 监控系统资源
htop
iotop
```

### 3. 错误日志监控
```bash
# 实时监控错误日志
sudo tail -f /var/log/nginx/medical-aesthetics-psychology.error.log
```

## 备份策略

### 1. 文件备份
```bash
# 创建备份脚本
cat > /home/backup/backup_website.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/backup/medical-aesthetics-psychology"
DATE=$(date +%Y%m%d_%H%M%S)
WEBSITE_DIR="/var/www/medical-aesthetics-psychology"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份网站文件
tar -czf $BACKUP_DIR/website_$DATE.tar.gz -C $WEBSITE_DIR .

# 保留最近30天的备份
find $BACKUP_DIR -name "website_*.tar.gz" -mtime +30 -delete

echo "备份完成: $BACKUP_DIR/website_$DATE.tar.gz"
EOF

# 设置执行权限
chmod +x /home/backup/backup_website.sh

# 设置定时任务
crontab -e
# 添加以下行:
# 0 2 * * * /home/backup/backup_website.sh
```

### 2. 数据库备份 (可选)
```bash
# 如果使用数据库，创建数据库备份脚本
cat > /home/backup/backup_database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/backup/medical-aesthetics-psychology"
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE_NAME="medical_aesthetics"

# 备份数据库
mysqldump -u root -p$DATABASE_PASSWORD $DATABASE_NAME > $BACKUP_DIR/database_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/database_$DATE.sql

# 保留最近30天的备份
find $BACKUP_DIR -name "database_*.sql.gz" -mtime +30 -delete

echo "数据库备份完成: $BACKUP_DIR/database_$DATE.sql.gz"
EOF
```

## 维护和更新

### 1. 定期更新
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新Nginx
sudo systemctl reload nginx

# 更新SSL证书
sudo certbot renew
```

### 2. 日志轮转
```bash
# 创建日志轮转配置
cat > /etc/logrotate.d/medical-aesthetics-psychology << 'EOF'
/var/log/nginx/medical-aesthetics-psychology.access.log
/var/log/nginx/medical-aesthetics-psychology.error.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF
```

### 3. 性能监控脚本
```bash
# 创建性能监控脚本
cat > /home/monitor/monitor_performance.sh << 'EOF'
#!/bin/bash
LOG_FILE="/var/log/medical-aesthetics-psychology/performance.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# 获取系统信息
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
MEMORY_USAGE=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')
DISK_USAGE=$(df -h / | awk 'NR==2{printf "%s", $5}')

# 记录日志
echo "[$DATE] CPU: $CPU_USAGE%, Memory: $MEMORY_USAGE%, Disk: $DISK_USAGE" >> $LOG_FILE

# 发送警告 (如果使用率过高)
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    echo "CPU usage is too high: $CPU_USAGE%" | mail -s "High CPU Usage Alert" admin@example.com
fi

if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
    echo "Memory usage is too high: $MEMORY_USAGE%" | mail -s "High Memory Usage Alert" admin@example.com
fi

if (( ${DISK_USAGE%?} > 80 )); then
    echo "Disk usage is too high: $DISK_USAGE" | mail -s "High Disk Usage Alert" admin@example.com
fi
EOF

# 设置执行权限
chmod +x /home/monitor/monitor_performance.sh

# 设置定时任务 (每5分钟检查一次)
crontab -e
# 添加以下行:
# */5 * * * * /home/monitor/monitor_performance.sh
```

## 故障排除

### 1. 常见问题

#### 网站无法访问
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# 检查防火墙
sudo ufw status

# 检查SSL证书
sudo certbot certificates
```

#### 性能问题
```bash
# 检查系统资源
htop
df -h
free -h

# 检查Nginx进程
ps aux | grep nginx

# 检查网络连接
netstat -an | grep :80
netstat -an | grep :443
```

#### 错误日志
```bash
# 查看Nginx错误日志
sudo tail -f /var/log/nginx/medical-aesthetics-psychology.error.log

# 查看系统日志
sudo tail -f /var/log/syslog
```

### 2. 应急处理

#### 网站宕机
```bash
# 重启Nginx
sudo systemctl restart nginx

# 重启服务器 (最后手段)
sudo reboot
```

#### 数据丢失
```bash
# 恢复文件备份
cd /var/www
sudo tar -xzf /home/backup/medical-aesthetics-psychology/website_YYYYMMDD_HHMMSS.tar.gz

# 恢复数据库备份 (如果需要)
mysql -u root -p medical_aesthetics < /home/backup/medical-aesthetics-psychology/database_YYYYMMDD_HHMMSS.sql
```

## 扩展部署

### 1. 负载均衡
```nginx
# 负载均衡配置
upstream medical_aesthetics_backend {
    server server1.example.com;
    server server2.example.com;
    server server3.example.com;
}

server {
    listen 80;
    server_name medical-aesthetics-psychology.com;
    
    location / {
        proxy_pass http://medical_aesthetics_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Docker部署
```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制网站文件
COPY . /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建Docker镜像
docker build -t medical-aesthetics-psychology .

# 运行容器
docker run -d -p 80:80 --name medical-aesthetics-psychology medical-aesthetics-psychology
```

### 3. 容器编排 (Docker Compose)
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./logs:/var/log/nginx
    restart: unless-stopped
  
  monitoring:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana
    restart: unless-stopped

volumes:
  grafana-storage:
```

## 验证部署

### 1. 功能测试
```bash
# 测试网站访问
curl -I http://medical-aesthetics-psychology.com
curl -I https://medical-aesthetics-psychology.com

# 测试SSL证书
openssl s_client -connect medical-aesthetics-psychology.com:443 -servername medical-aesthetics-psychology.com

# 测试性能
ab -n 1000 -c 10 https://medical-aesthetics-psychology.com/
```

### 2. 安全测试
```bash
# SSL测试
sslscan medical-aesthetics-psychology.com

# 安全头检查
curl -I https://medical-aesthetics-psychology.com | grep -E "X-|Content-Security-Policy"
```

### 3. 监控设置
- 设置Google Analytics
- 配置Search Console
- 设置错误监控 (Sentry等)
- 配置性能监控

---

*部署指南最后更新: 2025-01-01*