# 部署检查清单

使用此清单确保鉴权功能正确部署。

## 📋 部署前检查

### 代码准备
- [ ] 所有新文件已提交到 Git
  - [ ] `auth.html`
  - [ ] `api/auth.js`
  - [ ] `edge-functions/auth.js`
  - [ ] `vercel.json`
  - [ ] `.env.example`
  - [ ] 文档文件（README.md 等）
- [ ] `.env.local` 已添加到 `.gitignore`（不要提交）
- [ ] `index.html` 已包含鉴权检查脚本

### 密码准备
- [ ] 已生成强密码（12 位以上）
- [ ] 密码已安全保存（密码管理器或加密笔记）
- [ ] 已告知需要访问的用户

---

## 🚀 Vercel 部署清单

### 1. 项目导入
- [ ] 登录 Vercel Dashboard
- [ ] 点击 "Add New..." → "Project"
- [ ] 选择 GitHub 仓库
- [ ] 点击 "Import"

### 2. 环境变量配置
- [ ] 进入项目 Settings
- [ ] 点击 Environment Variables
- [ ] 添加 `ACCESS_PASSWORD`
- [ ] 值设置为你的密码（无引号、无空格）
- [ ] 应用于：Production, Preview, Development

### 3. 部署
- [ ] 点击 "Deploy" 按钮
- [ ] 等待部署完成（通常 1-2 分钟）
- [ ] 检查部署状态（应显示 "Ready"）

### 4. 验证
- [ ] 访问部署的域名
- [ ] 应自动跳转到 `/auth.html`
- [ ] 输入密码测试
- [ ] 验证成功后应进入编辑器
- [ ] 刷新页面，应保持登录状态
- [ ] 打开浏览器控制台，检查是否有错误

---

## 🌐 EdgeOne 部署清单

### 1. 上传静态文件
- [ ] 登录 EdgeOne 控制台
- [ ] 进入静态托管服务
- [ ] 上传以下文件：
  - [ ] `auth.html`
  - [ ] `index.html`
  - [ ] `app.js`
  - [ ] `styles.js`
  - [ ] `favicon.svg`, `logo.svg`, `icon.svg`
  - [ ] 其他资源文件

### 2. 创建边缘函数
- [ ] 进入边缘函数管理
- [ ] 创建新函数：`auth`
- [ ] 复制 `edge-functions/auth.js` 内容
- [ ] 设置触发路径：`/api/auth`
- [ ] 保存并发布

### 3. 配置环境变量
- [ ] 在边缘函数设置中
- [ ] 添加环境变量：`ACCESS_PASSWORD`
- [ ] 值设置为你的密码

### 4. 配置路由
- [ ] 进入路由配置
- [ ] 添加规则：`/` → 重定向 → `/auth.html`
- [ ] 添加规则：`/api/auth` → 边缘函数 → `auth`

### 5. 验证
- [ ] 访问自定义域名或 EdgeOne 域名
- [ ] 测试登录流程
- [ ] 检查 API 调用是否成功

---

## 🧪 功能测试清单

### 基础功能
- [ ] **首次访问**：跳转到登录页
- [ ] **密码错误**：显示错误提示
- [ ] **密码正确**：成功进入编辑器
- [ ] **刷新页面**：保持登录状态
- [ ] **24小时后**：Token 过期，需重新登录

### API 测试
- [ ] 打开浏览器开发者工具（F12）
- [ ] 切换到 Network 标签
- [ ] 输入密码提交
- [ ] 检查 `/api/auth` 请求：
  - [ ] 状态码：200 OK
  - [ ] 响应：`{ "success": true, "token": "...", "expiresIn": 86400 }`
- [ ] 检查 CORS 头：
  - [ ] `Access-Control-Allow-Origin: *`

### 前端测试
- [ ] 打开浏览器控制台（F12）
- [ ] 切换到 Application → Local Storage
- [ ] 检查存储项：
  - [ ] `auth_token`：Base64 字符串
  - [ ] `auth_token_expiry`：时间戳（数字）
- [ ] 手动删除 token
- [ ] 刷新页面，应跳转到登录页

### 安全测试
- [ ] 尝试直接访问 `/index.html`（无 token）
  - [ ] 应跳转到 `/auth.html`
- [ ] 在隐私模式打开网站
  - [ ] 应要求登录
- [ ] 使用错误密码多次尝试
  - [ ] 应持续显示错误（不应绕过）

---

## 📱 跨平台测试

### 桌面浏览器
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari（macOS）

### 移动浏览器
- [ ] Safari（iOS）
- [ ] Chrome（Android）
- [ ] 微信内置浏览器

### 响应式测试
- [ ] 桌面（> 1024px）
- [ ] 平板（768px - 1024px）
- [ ] 手机（< 768px）

---

## 🔒 安全检查

### 密码安全
- [ ] 密码长度 ≥ 12 位
- [ ] 包含大小写字母、数字、特殊字符
- [ ] 不是常见密码（如 password123）
- [ ] 密码已安全保存

### 代码安全
- [ ] `.env.local` 未提交到 Git
- [ ] 环境变量中无明文密码
- [ ] API 代码无 console.log 泄露敏感信息

### 传输安全
- [ ] 网站使用 HTTPS
- [ ] API 请求使用 HTTPS
- [ ] 无混合内容警告

---

## 📊 性能检查

### 加载速度
- [ ] 首页加载时间 < 2 秒
- [ ] API 响应时间 < 500ms
- [ ] 无明显卡顿

### 资源优化
- [ ] 图片已压缩
- [ ] JavaScript 无阻塞
- [ ] CSS 加载正常

---

## 📝 文档检查

### 用户文档
- [ ] README.md 包含鉴权说明
- [ ] QUICKSTART.md 可访问
- [ ] DEPLOYMENT.md 详细完整

### 团队文档
- [ ] 密码已告知相关人员
- [ ] 部署步骤已记录
- [ ] 应急联系方式已更新

---

## 🎉 部署完成

全部检查通过后，你可以：

- [ ] 发送访问链接给用户
- [ ] 提供密码（通过安全渠道）
- [ ] 设置提醒：定期更换密码
- [ ] 备份配置信息

---

## 🐛 问题排查

如果遇到问题，请检查：

1. **浏览器控制台**（F12）查看错误信息
2. **Network 标签**查看 API 请求状态
3. **Vercel/EdgeOne 日志**查看服务器错误
4. **环境变量**是否正确设置
5. **CORS 配置**是否正确

常见错误代码：
- `401`：密码错误或 token 无效
- `500`：服务器错误（检查环境变量）
- `404`：API 路径错误
- `CORS Error`：跨域配置问题

---

## 📞 需要帮助？

- 📖 查看 [DEPLOYMENT.md](DEPLOYMENT.md)
- 📝 查看 [AUTH_SUMMARY.md](AUTH_SUMMARY.md)
- 🏗️ 查看 [ARCHITECTURE.md](ARCHITECTURE.md)
- 💬 提交 GitHub Issue

---

**版本**：v1.0.0  
**日期**：2026-01-04
