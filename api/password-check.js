export default async function handler(req, res) {
  const apiKey = process.env.DEHASHED_API_KEY;
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sha256_hashed_password } = req.body;

  try {
    // Check password via DeHashed
    const dehashedRes = await fetch('https://api.dehashed.com/v2/search-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeHashed-Api-Key': apiKey
      },
      body: JSON.stringify({ sha256_hashed_password })
    });

    const data = await dehashedRes.json();

    // Send Telegram alert
    const telegramMsg = `🔐 Password Check:\n\nResult:\n${JSON.stringify(data, null, 2)}`;
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: telegramMsg })
    });

    res.status(200).json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
