# 本地测试指南

## ✅ 环境准备完成

你的 `.env.local` 文件已创建，包含以下配置：

```env
ACCESS_PASSWORD=test123456
```

---

## 🧪 本地测试方法

### 方法一：简单测试（推荐用于快速验证）

适用于测试前端鉴权逻辑和 UI，**不包含 API 功能**。

#### 1. 启动本地服务器

```bash
# 使用 Python（Windows/Mac/Linux 都支持）
python -m http.server 8080

# 或使用 Python 3
python3 -m http.server 8080
```

#### 2. 访问测试页面

打开浏览器访问：
```
http://localhost:8080/test-auth.html
```

#### 3. 模拟登录

1. 在测试页面输入任意密码（如 `test123456`）
2. 点击"模拟登录"按钮
3. 会自动保存 token 到 LocalStorage
4. 访问 `http://localhost:8080/index.html` 验证

#### 4. 测试效果

- ✅ 访问 `index.html` 应该能正常进入（有 token）
- ✅ 点击"清除 Token"后刷新，应跳转到 `auth.html`
- ✅ 可以查看 token 状态和过期时间

**注意**：此方法中 `/api/auth` 不可用，登录是模拟的。

---

### 方法二：完整测试（包含真实 API）

需要安装 Vercel CLI，可以测试完整的鉴权流程。

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel（首次需要）

```bash
vercel login
```

#### 3. 启动开发服务器

```bash
cd d:\projects\huasheng_editor
vercel dev
```

初次运行会询问：
- **Set up and develop?** → `Y`
- **Which scope?** → 选择你的账号
- **Link to existing project?** → `N`
- **What's your project's name?** → `huasheng-editor`
- **In which directory is your code located?** → `./`

#### 4. 访问测试

服务器启动后（通常在 `http://localhost:3000`）：

1. 访问 `http://localhost:3000`
2. 应自动跳转到 `http://localhost:3000/auth.html`
3. 输入密码：`test123456`
4. 点击"验证并进入"
5. 成功后进入编辑器

#### 5. 验证 API

打开浏览器开发者工具（F12）→ Network：
- 应该看到 POST 请求到 `/api/auth`
- 状态码：200 OK
- 响应包含 `token` 和 `expiresIn`

---

## 🔍 测试检查清单

### 前端功能测试

- [ ] 访问 `/` 自动跳转到 `/auth.html`
- [ ] 登录页面样式正常显示
- [ ] 输入框可以正常输入
- [ ] 密码输入时显示为 `****`
- [ ] 点击"验证并进入"按钮有反应

### Token 管理测试

- [ ] 登录成功后 LocalStorage 保存了 token
  ```javascript
  // 在浏览器控制台执行
  localStorage.getItem('auth_token')
  localStorage.getItem('auth_token_expiry')
  ```
- [ ] Token 包含正确的过期时间（24小时后）
- [ ] 刷新页面后 token 仍然存在
- [ ] 清除 token 后重新访问会跳转到登录页

### 鉴权逻辑测试

使用 `test-auth.html` 测试工具：

1. **检查 Token 状态**
   - [ ] 未登录时显示"未登录"
   - [ ] 登录后显示 token 信息和过期时间

2. **模拟登录**
   - [ ] 输入密码后点击"模拟登录"
   - [ ] 显示"登录成功"提示
   - [ ] Token 状态更新

3. **清除 Token**
   - [ ] 点击"清除 Token"按钮
   - [ ] 状态变为"未登录"

4. **访问主页**
   - [ ] 有 token 时：正常显示编辑器
   - [ ] 无 token 时：跳转到登录页

### API 功能测试（仅方法二）

- [ ] `/api/auth` 端点可访问
- [ ] POST 请求返回 200 状态码
- [ ] 正确密码返回 token
- [ ] 错误密码返回 401 错误
- [ ] 响应包含正确的 JSON 格式

---

## 🐛 常见问题

### Q1: `python -m http.server` 报错找不到命令

**解决方法**：
- Windows：确保 Python 已安装并添加到 PATH
- 尝试使用 `python3 -m http.server`
- 或使用 Vercel CLI：`vercel dev`

### Q2: `test-auth.html` 点击"模拟登录"没反应

**检查**：
1. 是否输入了密码
2. 打开浏览器控制台（F12）查看错误
3. 确认用的是 `http://localhost:8080` 而不是 `file://`

### Q3: Vercel CLI 安装失败

**解决方法**：
```bash
# 全局安装
npm install -g vercel

# 如果权限不足（Mac/Linux）
sudo npm install -g vercel

# 或使用 npx（无需安装）
npx vercel dev
```

### Q4: API 返回 500 错误

**检查**：
1. `.env.local` 文件是否存在
2. 文件中 `ACCESS_PASSWORD` 是否正确设置
3. Vercel CLI 是否正确读取了环境变量

---

## 📊 测试流程图

```
开始测试
    ↓
选择测试方法
    ├─ 方法一（简单）→ python -m http.server 8080
    │       ↓
    │   访问 test-auth.html
    │       ↓
    │   模拟登录
    │       ↓
    │   访问 index.html 验证
    │
    └─ 方法二（完整）→ vercel dev
            ↓
        访问 localhost:3000
            ↓
        输入真实密码
            ↓
        验证 API 响应
            ↓
        测试完整流程
```

---

## 🎯 推荐测试流程

### 第一步：快速验证（5分钟）

使用方法一快速验证前端逻辑：

```bash
# 1. 启动服务器
python -m http.server 8080

# 2. 打开浏览器
# http://localhost:8080/test-auth.html

# 3. 测试模拟登录
# 4. 访问 index.html 验证
```

### 第二步：完整测试（15分钟）

如果前端逻辑正常，再测试 API：

```bash
# 1. 安装 Vercel CLI（首次）
npm install -g vercel

# 2. 启动开发服务器
vercel dev

# 3. 完整测试流程
```

---

## 📝 测试记录

你可以记录测试结果：

| 测试项 | 预期结果 | 实际结果 | 状态 |
|--------|---------|---------|------|
| 访问首页跳转 | 跳转到 auth.html | | ⬜ |
| 输入密码登录 | 成功进入编辑器 | | ⬜ |
| Token 保存 | LocalStorage 有值 | | ⬜ |
| 刷新保持登录 | 不需要重新登录 | | ⬜ |
| 清除 token 后访问 | 跳转到登录页 | | ⬜ |
| API 验证（方法二）| 返回 200 OK | | ⬜ |

---

## 🚀 测试完成后

测试通过后，你可以：

1. **部署到 Vercel**：
   ```bash
   vercel --prod
   ```

2. **提交代码**：
   ```bash
   git add .
   git commit -m "feat: 添加鉴权功能"
   git push
   ```

3. **设置生产环境密码**：
   - 登录 Vercel Dashboard
   - 设置环境变量 `ACCESS_PASSWORD`
   - 使用更强的密码（不要用 test123456）

---

## 🔒 安全提醒

- ⚠️ **不要将 `.env.local` 提交到 Git**（已在 .gitignore 中）
- ⚠️ **生产环境使用强密码**（不要用 test123456）
- ⚠️ **定期更换密码**
- ⚠️ **通过安全渠道分享密码**

---

## 📞 需要帮助？

- 📖 查看 [QUICKSTART.md](QUICKSTART.md)
- 📝 查看 [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 检查浏览器控制台错误
- 💬 提交 GitHub Issue

---

**祝测试顺利！🎉**
