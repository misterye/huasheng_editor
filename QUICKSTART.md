# 快速开始指南

## 🚀 5 分钟完成部署

### 步骤 1：准备代码

确保你的项目包含以下文件：

```
✅ auth.html              - 登录页面
✅ index.html             - 主页面（已集成鉴权）
✅ api/auth.js            - Vercel API
✅ edge-functions/auth.js - EdgeOne 函数
✅ vercel.json            - Vercel 配置
```

### 步骤 2：选择部署平台

#### 选项 A：Vercel（推荐，0 配置）

1. **登录 Vercel**：https://vercel.com/dashboard
2. **导入项目**：
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"
3. **设置环境变量**：
   - 进入 Settings → Environment Variables
   - 添加：`ACCESS_PASSWORD` = `你的密码`
4. **部署**：点击 "Deploy" 按钮
5. **完成**：访问你的域名测试

#### 选项 B：EdgeOne

1. **上传静态文件**到 EdgeOne 静态托管
2. **创建边缘函数**：
   - 路径：`/api/auth`
   - 代码：复制 `edge-functions/auth.js`
3. **设置环境变量**：`ACCESS_PASSWORD`
4. **配置路由**：`/` → `/auth.html`
5. **完成**：访问你的域名测试

### 步骤 3：测试鉴权

1. 访问你的网站（应该自动跳转到登录页）
2. 输入你设置的密码
3. 验证成功后进入编辑器
4. 刷新页面，应保持登录状态

---

## 🧪 本地测试（可选）

### 快速测试（无 API）

```bash
# 启动服务器
python3 -m http.server 8080

# 访问测试页面
open http://localhost:8080/test-auth.html

# 模拟登录后访问主页
open http://localhost:8080/index.html
```

### 完整测试（含 API）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 创建环境变量文件
echo "ACCESS_PASSWORD=test123456" > .env.local

# 启动开发服务器
vercel dev

# 访问
open http://localhost:3000
```

---

## 🔑 密码设置建议

### 生成强密码

推荐使用 12-16 位包含以下字符的密码：
- ✅ 大写字母：A-Z
- ✅ 小写字母：a-z
- ✅ 数字：0-9
- ✅ 特殊字符：!@#$%^&*

### 示例（请勿使用）

```
MyEditor2026!Secure
P@ssw0rd_2026_Strong
Editor#2026$Safe!
```

### 在线生成器

- https://passwordsgenerator.net/
- https://www.random.org/passwords/

---

## 📋 常见问题

### Q1: 部署后访问不了？

**检查清单**：
- ✅ 环境变量 `ACCESS_PASSWORD` 已设置
- ✅ 项目已重新部署（修改环境变量后需重新部署）
- ✅ 浏览器控制台无报错
- ✅ 网络请求到 `/api/auth` 返回 200

### Q2: 输入正确密码还是提示错误？

**可能原因**：
- 环境变量中有多余的空格或引号
- 区分大小写
- 环境变量未生效（需重新部署）

**解决方法**：
1. 检查 Vercel 控制台的环境变量
2. 确保值完全匹配（无空格、无引号）
3. 保存后点击 "Redeploy"

### Q3: 本地测试时 API 不可用？

**解决方法**：
- 使用 `vercel dev` 而不是 `python -m http.server`
- 或者使用 `test-auth.html` 模拟登录

### Q4: 如何修改 Token 有效期？

编辑 `api/auth.js` 第 15 行：

```javascript
const maxAge = 24 * 60 * 60 * 1000; // 修改这里
// 例如：7 天 = 7 * 24 * 60 * 60 * 1000
```

---

## 🎯 下一步

- [ ] 测试登录功能
- [ ] 备份你的密码
- [ ] 定期查看访问日志
- [ ] 考虑启用双因素认证（未来功能）

---

## 📞 需要帮助？

- 📖 查看详细文档：[DEPLOYMENT.md](DEPLOYMENT.md)
- 📝 查看实现总结：[AUTH_SUMMARY.md](AUTH_SUMMARY.md)
- 🐛 提交 Issue：[GitHub Issues](https://github.com/alchaincyf/huasheng_editor/issues)

---

**祝你使用愉快！🎉**
