/**
 * EdgeOne Login Function
 * 
 * This file is for Tencent Cloud EdgeOne Functions.
 * It provides the same functionality as api/login.js but for the Edge Runtime.
 * 
 * Deployment:
 * 1. Create a new Edge Function in EdgeOne console.
 * 2. Paste this code.
 * 3. Set Environment Variable: EDITOR_PASSWORD
 * 4. Add a Rule: Path equals "/api/login" -> Trigger this Function.
 */

async function handleRequest(request) {
    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                "Access-Control-Max-Age": "86400",
            },
        });
    }

    // 2. Only allow POST
    if (request.method !== "POST") {
        return new Response(JSON.stringify({
            success: false,
            message: "Method not allowed"
        }), {
            status: 405,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        });
    }

    try {
        const body = await request.json();
        const { password } = body;

        // 3. Get Password from Environment Variables
        // In EdgeOne, env is a global object
        const correctPassword = (typeof env !== 'undefined' && (env.EDITOR_PASSWORD || env.LOGIN_PASSWORD))
            || "MISSING_PASSWORD_CONFIG";

        if (correctPassword === "MISSING_PASSWORD_CONFIG") {
            return new Response(JSON.stringify({
                success: false,
                message: "Server configuration error: EDITOR_PASSWORD not set."
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
        }

        // 4. Validate
        if (password === correctPassword) {
            // Simple Base64 token
            const token = btoa(unescape(encodeURIComponent(correctPassword)));
            return new Response(JSON.stringify({
                success: true,
                token: token
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: "密码错误"
            }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: "Invalid request body"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        });
    }
}

// EdgeOne uses the fetch event listener pattern
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
