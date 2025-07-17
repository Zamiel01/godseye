export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, data } = req.body;

    try {
        switch (action) {
            case 'checkPassword':
                return await handlePasswordCheck(req, res, data);
            case 'sendTelegram':
                return await handleTelegramNotification(req, res, data);
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handlePasswordCheck(req, res, data) {
    const { sha256_hashed_password } = data;

    if (!sha256_hashed_password) {
        return res.status(400).json({ error: 'Missing hashed password' });
    }

    const API_KEY = process.env.DEHASHED_API_KEY;
    const API_URL = 'https://api.dehashed.com/v2/search-password';

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DeHashed-Api-Key': API_KEY
            },
            body: JSON.stringify({
                sha256_hashed_password
            })
        });

        const responseData = await response.json();

        if (response.ok) {
            return res.status(200).json(responseData);
        } else {
            return res.status(response.status).json(responseData);
        }
    } catch (error) {
        console.error('DeHashed API Error:', error);
        return res.status(500).json({ error: 'Failed to check password' });
    }
}

async function handleTelegramNotification(req, res, data) {
    const { message } = data;

    if (!message) {
        return res.status(400).json({ error: 'Missing message' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: 'Telegram configuration not found' });
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const responseData = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error('Telegram API Error:', responseData);
            return res.status(response.status).json({ error: 'Failed to send notification' });
        }
    } catch (error) {
        console.error('Telegram Notification Error:', error);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}