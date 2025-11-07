# 前端API配置说明

## 概述

本项目已配置为支持直接访问线上后端API，无需依赖本地后端服务。通过环境变量配置，可以灵活切换API地址。

## 配置文件

### 1. 环境变量文件

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

### 2. 配置示例

```bash
# .env.development 或 .env.production
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 使用方法

### 步骤1：配置API地址

编辑 `.env.development` 文件，将 `VITE_API_BASE_URL` 设置为您的线上API地址：

```bash
VITE_API_BASE_URL=https://your-actual-api-domain.com/api
```

### 步骤2：重启开发服务器

```bash
npm run dev
```

## 配置逻辑

1. **API服务配置** (`src/services/api.ts`)
   - 使用 `import.meta.env.VITE_API_BASE_URL` 作为API基础地址
   - 如果未配置环境变量，则回退到 `/api`（本地代理）

2. **Vite配置** (`vite.config.ts`)
   - 动态检测环境变量
   - 如果配置了线上API地址，则禁用本地代理
   - 如果未配置或配置为 `/api`，则启用本地代理

3. **TypeScript类型定义** (`src/vite-env.d.ts`)
   - 为环境变量提供类型支持
   - 确保开发时的类型安全

## 验证配置

配置完成后，可以通过以下方式验证：

1. 检查浏览器开发者工具的Network标签
2. 观察API请求是否指向正确的域名
3. 确认不再有本地代理的日志输出

## 注意事项

1. **CORS配置**：确保您的线上API服务器已正确配置CORS，允许前端域名访问
2. **HTTPS**：如果前端使用HTTPS，API也应该使用HTTPS
3. **环境变量**：不要将包含敏感信息的环境变量提交到版本控制系统

## 故障排除

### 问题1：API请求失败
- 检查API地址是否正确
- 确认API服务器是否正常运行
- 检查CORS配置

### 问题2：仍然使用本地代理
- 确认环境变量文件名正确（`.env.development`）
- 检查环境变量值是否正确设置
- 重启开发服务器

### 问题3：TypeScript类型错误
- 确认 `src/vite-env.d.ts` 文件包含正确的类型定义
- 重启TypeScript服务或IDE