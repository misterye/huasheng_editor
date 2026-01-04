export default async function handler(req, res) {
    // 增加简单的 CORS 处理，如果需要的话
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { password } = req.body;
    const correctPassword = process.env.EDITOR_PASSWORD || process.env.LOGIN_PASSWORD;

    if (!correctPassword) {
        return res.status(500).json({
            success: false,
            message: 'Server configuration error: EDITOR_PASSWORD not set in environment variables.'
        });
    }

    if (password === correctPassword) {
        // 这里可以返回一个更好的 token，但为了简单，直接返回成功
        return res.status(200).json({
            success: true,
            token: Buffer.from(correctPassword).toString('base64') // 简单的伪 token
        });
    } else {
        return res.status(401).json({ success: false, message: '密码错误' });
    }
}
