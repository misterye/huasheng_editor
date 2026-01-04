# 鉴权功能部署指南

本项目已添加访问密码鉴权功能，用户需要输入正确的密码才能访问编辑器。

## 📋 功能说明

- **鉴权页面**：用户首次访问会看到密码输入页面（`auth.html`）
- **Token 管理**：验证成功后生成 token，有效期 24 小时
- **自动过期**：Token 过期后自动跳转回鉴权页面
- **本地存储**：Token 保存在 localStorage，刷新页面不需要重新登录
- **安全性**：密码从环境变量读取，不会暴露在代码中

## 🚀 部署步骤

### 方案一：Vercel 部署

#### 1. 上传代码到 GitHub

确保以下文件已提交：
- `auth.html` - 鉴权页面
- `index.html` - 主页面（已添加鉴权检查）
- `api/auth.js` - Vercel Serverless Function
- `vercel.json` - Vercel 配置文件
- `.env.example` - 环境变量示例

#### 2. 在 Vercel 中导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择你的 GitHub 仓库
4. 点击 **"Import"**

#### 3. 配置环境变量

在项目设置中添加环境变量：

1. 进入项目 → **Settings** → **Environment Variables**
2. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ACCESS_PASSWORD` | `your_password_here` | 访问密码（自定义） |

**重要**：密码建议使用强密码，包含字母、数字和特殊字符。

#### 4. 部署

1. 点击 **"Deploy"**
2. 等待部署完成
3. 访问你的域名，应该会看到鉴权页面

#### 5. 测试

1. 访问网站主页，应自动跳转到 `auth.html`
2. 输入你设置的密码
3. 验证成功后跳转到 `index.html`
4. 刷新页面，应保持登录状态（24小时内）

---

### 方案二：EdgeOne 部署

#### 1. 上传静态文件

将以下文件上传到 EdgeOne 静态托管：
- `auth.html`
- `index.html`
- `app.js`
- `styles.js`
- 其他静态资源（favicon.svg, logo.svg 等）

#### 2. 配置边缘函数

1. 在 EdgeOne 控制台创建边缘函数
2. 将 `edge-functions/auth.js` 的内容复制到边缘函数编辑器
3. 设置触发路径：`/api/auth`

#### 3. 配置环境变量

在边缘函数的环境变量中添加：

| 变量名 | 值 |
|--------|-----|
| `ACCESS_PASSWORD` | `your_password_here` |

#### 4. 配置路由

在 EdgeOne 控制台配置路由规则：

1. **首页重定向**：
   - 路径：`/`
   - 重定向到：`/auth.html`

2. **边缘函数**：
   - 路径：`/api/auth`
   - 处理方式：边缘函数

#### 5. 测试

与 Vercel 测试步骤相同。

---

## 🔧 本地开发测试

### 1. 安装依赖（可选）

如果需要本地测试 Vercel Serverless Function：

```bash
npm install -g vercel
```

### 2. 创建本地环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，设置密码：

```
ACCESS_PASSWORD=test123456
```

### 3. 启动本地服务器

```bash
vercel dev
```

或使用简单的 HTTP 服务器（不支持 API）：

```bash
python3 -m http.server 8080
```

**注意**：使用简单 HTTP 服务器时，API 功能不可用，需要修改 `auth.html` 中的 `API_ENDPOINT` 指向你的开发环境。

---

## 📝 配置说明

### Token 有效期

默认 token 有效期为 24 小时，可在以下文件中修改：

**`api/auth.js`（Vercel）**
```javascript
const maxAge = 24 * 60 * 60 * 1000; // 修改这里（毫秒）
```

**`edge-functions/auth.js`（EdgeOne）**
```javascript
const maxAge = 24 * 60 * 60 * 1000; // 修改这里（毫秒）
```

### 自定义鉴权页面

编辑 `auth.html` 可以修改：
- 页面标题
- Logo
- 提示文字
- 样式

### API 端点

鉴权 API 端点默认为 `/api/auth`，如果需要修改：

1. 修改 `auth.html` 中的 `API_ENDPOINT` 常量
2. 修改 `vercel.json` 或 EdgeOne 配置中的路由规则

---

## 🔒 安全建议

1. **使用强密码**：
   - 至少 12 位字符
   - 包含大小写字母、数字、特殊字符
   - 避免使用常见密码

2. **定期更换密码**：
   - 在平台环境变量中修改 `ACCESS_PASSWORD`
   - 重新部署项目

3. **HTTPS 部署**：
   - Vercel 和 EdgeOne 默认使用 HTTPS
   - 确保自定义域名也启用了 HTTPS

4. **不要提交 .env 文件**：
   - `.env.local` 已添加到 `.gitignore`
   - 永远不要将包含真实密码的文件提交到 Git

---

## 🐛 常见问题

### Q1: 输入正确密码还是提示错误？

**可能原因**：
- 环境变量未正确配置
- 环境变量中有多余的空格或引号

**解决方法**：
1. 检查 Vercel/EdgeOne 控制台的环境变量
2. 确保 `ACCESS_PASSWORD` 的值与输入的密码完全一致
3. 重新部署项目

### Q2: 刷新页面就需要重新登录？

**可能原因**：
- Token 没有正确保存到 localStorage
- 浏览器禁用了 localStorage

**解决方法**：
1. 检查浏览器控制台是否有错误
2. 确认浏览器允许使用 localStorage
3. 清除浏览器缓存后重试

### Q3: API 请求失败（CORS 错误）？

**可能原因**：
- CORS 头配置不正确
- API 端点路径错误

**解决方法**：
1. 检查 `vercel.json` 中的 CORS 配置
2. 检查浏览器控制台的网络请求，确认 API 路径正确
3. 确保 API 函数正确返回了 CORS 头

### Q4: 本地开发时 API 不可用？

**解决方法**：
1. 使用 `vercel dev` 启动本地服务器
2. 或者临时修改 `auth.html`，将 `API_ENDPOINT` 指向线上地址

---

## 📄 文件说明

| 文件 | 说明 |
|-----|------|
| `auth.html` | 鉴权登录页面 |
| `index.html` | 主页面（已添加鉴权检查） |
| `api/auth.js` | Vercel Serverless Function |
| `edge-functions/auth.js` | EdgeOne 边缘函数 |
| `vercel.json` | Vercel 配置文件 |
| `.env.example` | 环境变量示例 |
| `DEPLOYMENT.md` | 本文档 |

---

## 🎯 下一步

1. **自定义样式**：修改 `auth.html` 的 CSS
2. **添加注册功能**：扩展 API 支持多用户
3. **集成第三方登录**：OAuth、微信登录等
4. **审计日志**：记录登录日志

---

**版本**：v1.0.0  
**更新时间**：2026-01-04  
**维护者**：项目团队
