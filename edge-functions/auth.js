/**
 * EdgeOne 边缘函数 - 鉴权 API
 * 
 * 环境变量配置：
 * - ACCESS_PASSWORD: 访问密码
 */

// 简单的 token 生成函数
function generateToken(password) {
    const timestamp = Date.now();
    const tokenData = `${password}-${timestamp}`;

    // Base64 编码
    const base64 = btoa(tokenData);
    return base64;
}

// 验证 token 是否有效（24小时过期）
function verifyToken(token, correctPassword) {
    try {
        const decoded = atob(token);
        const [password, timestamp] = decoded.split('-');

        // 检查是否过期（24小时 = 86400000ms）
        const now = Date.now();
        const tokenAge = now - parseInt(timestamp, 10);
        const maxAge = 24 * 60 * 60 * 1000; // 24小时

        if (tokenAge > maxAge) {
            return { valid: false, reason: 'expired' };
        }

        // 验证密码
        if (password === correctPassword) {
            return { valid: true };
        }

        return { valid: false, reason: 'invalid' };
    } catch (error) {
        return { valid: false, reason: 'malformed' };
    }
}

async function handleRequest(request) {
    const url = new URL(request.url);

    // 处理 CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            }
        });
    }

    // 检查环境变量
    const ACCESS_PASSWORD = env.ACCESS_PASSWORD;
    if (!ACCESS_PASSWORD) {
        return new Response(JSON.stringify({
            success: false,
            message: '服务器未配置访问密码，请联系管理员'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // 只处理 POST 请求
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({
            success: false,
            message: '不支持的请求方法'
        }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const body = await request.json();
        const { password, action, token } = body;

        // 登录操作
        if (action === 'login') {
            if (!password) {
                return new Response(JSON.stringify({
                    success: false,
                    message: '请输入密码'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            // 验证密码
            if (password === ACCESS_PASSWORD) {
                const newToken = generateToken(password);

                return new Response(JSON.stringify({
                    success: true,
                    message: '验证成功',
                    token: newToken,
                    expiresIn: 24 * 60 * 60 // 24小时（秒）
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            } else {
                return new Response(JSON.stringify({
                    success: false,
                    message: '密码错误，请重试'
                }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        }

        // 验证 token 操作
        if (action === 'verify') {
            if (!token) {
                return new Response(JSON.stringify({
                    success: false,
                    message: '缺少 token'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            const result = verifyToken(token, ACCESS_PASSWORD);

            if (result.valid) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Token 有效'
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            } else {
                return new Response(JSON.stringify({
                    success: false,
                    message: result.reason === 'expired' ? 'Token 已过期，请重新登录' : 'Token 无效'
                }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        }

        return new Response(JSON.stringify({
            success: false,
            message: '未知操作'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: '请求处理失败: ' + error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
