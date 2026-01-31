# 部署指南

## 部署到 Vercel (推荐)

Vercel 是 Next.js 开发团队提供的部署平台，最适合部署 Next.js 应用。

### 步骤：

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd E:\program_code\ps_claude_code_th
vercel
```

按照提示操作：
- 首次部署会询问是否要设置项目，选择 `Yes`
- 选择项目名称（默认即可）
- 选择部署范围（选择全局或你的账户）

4. **完成**
部署完成后，Vercel 会给你一个 `.vercel.app` 域名，比如 `https://your-project.vercel.app`

### 环境变量（如果需要）

如果需要配置环境变量，在 Vercel 控制台中：
1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加需要的变量

---

## 部署到 Netlify

### 步骤：

1. **构建项目**
```bash
npm run build
```

2. **部署到 Netlify**
- 访问 [netlify.com](https://www.netlify.com/)
- 拖拽 `.next` 文件夹到 Netlify
- 或者使用 Netlify CLI：`npm install -g netlify-cli` 然后 `netlify deploy --prod`

---

## 部署到自己的服务器 (VPS/Linux)

### 方式一：使用 PM2 部署

1. **安装 Node.js 和 npm**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

2. **上传项目文件**
```bash
# 使用 scp 上传
scp -r E:\program_code\ps_claude_code_th user@your-server:/var/www/

# 或使用 git
git clone <your-repo-url>
```

3. **安装依赖**
```bash
cd /var/www/ps_claude_code_th
npm install
```

4. **构建项目**
```bash
npm run build
```

5. **安装 PM2**
```bash
npm install -g pm2
```

6. **启动应用**
```bash
pm2 start npm --name "product-configurator" -- start
pm2 save
pm2 startup
```

7. **配置 Nginx 反向代理**
```bash
sudo nano /etc/nginx/sites-available/product-configurator
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/product-configurator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 方式二：使用 Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

更新 `next.config.mjs`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tablechairetc.auinno.site',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
```

构建和运行：

```bash
docker build -t product-configurator .
docker run -p 3000:3000 product-configurator
```

---

## 方式三：导出静态 HTML（最简单）

如果你想部署到静态托管服务（如 GitHub Pages、S3 等）：

1. 修改 `next.config.mjs`：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

2. 构建静态文件：
```bash
npm run build
```

3. 将 `out` 文件夹上传到任何静态托管服务。

---

## 快速检查清单

部署前确保：

- [ ] `npm run build` 成功运行
- [ ] `npm run dev` 在本地正常工作
- [ ] 环境变量已配置（如果需要）
- [ ] 图片域名已添加到允许列表
- [ ] 所有依赖都已安装 (`npm install`)

---

## 故障排查

### 构建失败
```bash
rm -rf .next node_modules
npm install
npm run build
```

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000
# 或
netstat -ano | findstr :3000

# 杀死进程
kill -9 <PID>
```

### PM2 常用命令
```bash
pm2 list              # 查看所有进程
pm2 logs              # 查看日志
pm2 restart all       # 重启所有
pm2 delete all        # 删除所有
```
