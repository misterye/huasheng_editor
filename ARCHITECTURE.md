# 鉴权系统架构说明

## 🏗️ 系统架构

本鉴权系统采用前端 + Serverless 的轻量级架构，适合静态站点部署。

### 架构图

请参考项目中的架构图（由 AI 生成），展示了完整的鉴权流程。

### 核心组件

#### 1. **auth.html** - 登录页面
- **功能**：提供密码输入界面
- **技术**：纯 HTML + JavaScript
- **职责**：
  - 收集用户密码
  - 调用 API 验证
  - 保存 token 到 LocalStorage
  - 跳转到主页面

#### 2. **API /api/auth** - 鉴权服务
- **平台**：Vercel Serverless Function / EdgeOne 边缘函数
- **技术**：Node.js / Service Worker API
- **职责**：
  - 验证密码（对比环境变量）
  - 生成 token（Base64 编码）
  - 验证 token 有效性
  - 返回 JSON 响应

#### 3. **index.html** - 主应用
- **功能**：Markdown 编辑器主界面
- **技术**：Vue 3 + Markdown-it
- **职责**：
  - 启动前检查 token
  - 无效 token 时跳转到登录页
  - 正常提供编辑器功能

#### 4. **LocalStorage** - 前端存储
- **类型**：浏览器本地存储
- **数据**：
  - `auth_token`：认证令牌
  - `auth_token_expiry`：过期时间戳

---

## 🔄 完整流程

### 首次访问流程

```
1. 用户访问 https://your-site.com/
   ↓
2. 路由重定向到 /auth.html（Vercel 配置）
   ↓
3. 显示登录页面，用户输入密码
   ↓
4. JavaScript 发送 POST 请求到 /api/auth
   Body: { "action": "login", "password": "xxx" }
   ↓
5. API 验证密码
   - 读取环境变量 ACCESS_PASSWORD
   - 对比用户输入
   ↓
6. 密码正确：
   - 生成 token = Base64(password-timestamp)
   - 返回 { "success": true, "token": "...", "expiresIn": 86400 }
   ↓
7. 前端保存 token
   - localStorage.setItem('auth_token', token)
   - localStorage.setItem('auth_token_expiry', Date.now() + 86400000)
   ↓
8. 跳转到 /index.html
   ↓
9. index.html 检查 token
   - 存在且未过期：正常显示
   - 不存在或已过期：跳转回 /auth.html
```

### 后续访问流程

```
1. 用户访问 https://your-site.com/
   ↓
2. 路由重定向到 /auth.html
   ↓
3. auth.html 检查 LocalStorage
   - 有 token 且未过期：自动跳转到 /index.html
   - 无 token 或已过期：显示登录表单
   ↓
4. 用户直接访问 /index.html
   ↓
5. index.html 检查 token
   - 有效：正常显示
   - 无效：跳转回 /auth.html
```

---

## 🔐 安全机制

### 1. 密码保护

- ✅ 密码存储在环境变量中（服务器端）
- ✅ 不暴露在前端代码中
- ✅ 传输使用 HTTPS 加密

### 2. Token 机制

- ✅ Token 包含时间戳，防止重放攻击
- ✅ 24 小时自动过期
- ✅ Base64 编码（简单但有效）

### 3. 前端保护

- ✅ 页面加载前检查 token
- ✅ 无效 token 立即跳转
- ✅ LocalStorage 隔离（同源策略）

### 4. API 保护

- ✅ CORS 配置正确
- ✅ 仅接受 POST 请求
- ✅ 参数验证
- ✅ 错误处理完善

---

## 📊 数据流图

### 登录数据流

```
用户输入密码
    ↓
auth.html (前端)
    ↓ POST /api/auth
    ↓ { action: "login", password: "xxx" }
    ↓
API 服务器
    ↓ 读取 env.ACCESS_PASSWORD
    ↓ 验证密码
    ↓ 生成 token
    ↓ 返回 { success: true, token: "...", expiresIn: 86400 }
    ↓
auth.html (前端)
    ↓ 保存到 LocalStorage
    ↓ 跳转到 index.html
    ↓
index.html (前端)
    ↓ 检查 LocalStorage
    ↓ Token 有效
    ↓ 显示编辑器
```

### Token 验证流程

```
index.html 加载
    ↓
读取 LocalStorage
    ├─ auth_token: "xxx"
    └─ auth_token_expiry: 1736966400000
    ↓
检查是否过期
    ├─ Date.now() < expiry ✅
    └─ Date.now() >= expiry ❌
    ↓
✅ 有效：继续加载
❌ 无效：跳转到 auth.html
```

---

## 🛠️ 技术选型理由

### 为什么选择 Serverless？

- ✅ **零运维**：无需管理服务器
- ✅ **自动扩展**：流量增加自动扩容
- ✅ **按需付费**：低流量几乎零成本
- ✅ **全球分发**：Vercel/EdgeOne 自带 CDN

### 为什么选择 LocalStorage？

- ✅ **简单易用**：标准浏览器 API
- ✅ **持久化**：刷新页面不丢失
- ✅ **足够安全**：同源策略保护
- ✅ **无需后端**：完全前端实现

### 为什么选择 Base64 Token？

- ✅ **简单实现**：无需额外库
- ✅ **可读性好**：易于调试
- ✅ **足够安全**：结合时间戳和 HTTPS
- ✅ **兼容性好**：所有浏览器支持

> **注意**：这不是 JWT，而是简化版 token。对于单密码访问控制已足够。

---

## 🔄 与传统鉴权的对比

| 特性 | 传统 Session | JWT | 本方案 |
|------|-------------|-----|--------|
| 服务器状态 | 有状态 | 无状态 | 无状态 |
| 实现复杂度 | 高 | 中 | 低 |
| 扩展性 | 差 | 好 | 好 |
| 安全性 | 高 | 高 | 中 |
| 适用场景 | 多用户系统 | 多用户系统 | 单密码访问 |

---

## 🎯 优点和局限

### ✅ 优点

1. **部署简单**：无需数据库
2. **成本低**：Vercel/EdgeOne 免费额度足够
3. **性能好**：全球 CDN 加速
4. **维护简单**：修改密码只需更新环境变量

### ⚠️ 局限

1. **单用户**：只支持一个密码
2. **安全级别**：适合个人项目，不适合企业应用
3. **功能有限**：无用户管理、权限控制等高级功能

---

## 🚀 未来改进方向

### 短期优化

- [ ] 添加验证码防暴力破解
- [ ] 记录登录日志和 IP
- [ ] 支持自定义 Token 有效期

### 中期扩展

- [ ] 支持多用户（用户名 + 密码）
- [ ] 集成第三方登录（GitHub、Google）
- [ ] 添加权限级别（只读、编辑、管理）

### 长期规划

- [ ] 完整的用户管理系统
- [ ] 基于角色的访问控制（RBAC）
- [ ] 审计日志和安全监控
- [ ] 双因素认证（2FA）

---

## 📖 相关资源

### 官方文档

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [EdgeOne 边缘函数](https://cloud.tencent.com/document/product/1552)
- [MDN - LocalStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

### 最佳实践

- [OWASP 认证最佳实践](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Serverless 安全指南](https://github.com/puresec/awesome-serverless-security)

---

## 📞 技术支持

如需定制更复杂的鉴权系统，请联系：

- 📧 Email: alchaincyf@gmail.com
- 🌟 知识星球：[AI编程：从入门到精通](https://wx.zsxq.com/group/48888144124288)
- 💻 GitHub: [@alchaincyf](https://github.com/alchaincyf)

---

**文档版本**：v1.0.0  
**更新时间**：2026-01-04  
**维护者**：花生 (alchaincyf)
