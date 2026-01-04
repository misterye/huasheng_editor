/**
 * 鉴权 API - Vercel Serverless Function
 * 
 * 环境变量配置：
 * - ACCESS_PASSWORD: 访问密码
 * - TOKEN_SECRET: JWT 签名密钥（可选，用于生成 token）
 */

// 简单的 token 生成函数（使用 crypto API）
function generateToken(password) {
  const timestamp = Date.now();
  const tokenData = `${password}-${timestamp}`;
  
  // 使用 Web Crypto API 生成简单的 hash
  // 注意：这是简化版本，生产环境建议使用 JWT 库
  const base64 = Buffer.from(tokenData).toString('base64');
  return base64;
}

// 验证 token 是否有效（24小时过期）
function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [password, timestamp] = decoded.split('-');
    
    // 检查是否过期（24小时 = 86400000ms）
    const now = Date.now();
    const tokenAge = now - parseInt(timestamp, 10);
    const maxAge = 24 * 60 * 60 * 1000; // 24小时
    
    if (tokenAge > maxAge) {
      return { valid: false, reason: 'expired' };
    }
    
    // 验证密码
    if (password === process.env.ACCESS_PASSWORD) {
      return { valid: true };
    }
    
    return { valid: false, reason: 'invalid' };
  } catch (error) {
    return { valid: false, reason: 'malformed' };
  }
}

export default function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 检查环境变量是否配置
  if (!process.env.ACCESS_PASSWORD) {
    return res.status(500).json({
      success: false,
      message: '服务器未配置访问密码，请联系管理员'
    });
  }
  
  // POST 请求：验证密码
  if (req.method === 'POST') {
    const { password, action } = req.body;
    
    // 登录操作
    if (action === 'login') {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: '请输入密码'
        });
      }
      
      // 验证密码
      if (password === process.env.ACCESS_PASSWORD) {
        const token = generateToken(password);
        
        return res.status(200).json({
          success: true,
          message: '验证成功',
          token: token,
          expiresIn: 24 * 60 * 60 // 24小时（秒）
        });
      } else {
        return res.status(401).json({
          success: false,
          message: '密码错误，请重试'
        });
      }
    }
    
    // 验证 token 操作
    if (action === 'verify') {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '缺少 token'
        });
      }
      
      const result = verifyToken(token);
      
      if (result.valid) {
        return res.status(200).json({
          success: true,
          message: 'Token 有效'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: result.reason === 'expired' ? 'Token 已过期，请重新登录' : 'Token 无效'
        });
      }
    }
    
    return res.status(400).json({
      success: false,
      message: '未知操作'
    });
  }
  
  // 不支持的方法
  return res.status(405).json({
    success: false,
    message: '不支持的请求方法'
  });
}
