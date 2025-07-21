const BOT_TOKEN = "8098501021:AAGbAdK3olQzWW4iqHsdB26ps8lAaQDFXNg";
const CHAT_ID = "7233135247";

export async function sendTelegramNotification(message: string) {
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

        if (!response.ok) {
            throw new Error('Failed to send Telegram notification');
        }

        return true;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return false;
    }
}
