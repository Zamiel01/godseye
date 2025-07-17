# Gods Eye - Data Breach Checker

A secure web application that checks if passwords have been compromised in known data breaches using the DeHashed API.

## Features

- Client-side password hashing for privacy
- Secure API key management via Vercel environment variables
- Real-time Telegram notifications for monitoring
- Responsive design with modern UI
- Protection recommendations for compromised passwords

## Security Architecture

- **API Keys**: Stored securely in Vercel environment variables
- **Frontend**: Never exposes API keys to the browser
- **Backend**: Vercel serverless functions handle all external API calls
- **Privacy**: Passwords are hashed client-side before transmission

## Deployment Instructions

### 1. Deploy to Vercel

1. Fork or clone this repository
2. Connect your repository to Vercel
3. Deploy the project

### 2. Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

```
DEHASHED_API_KEY=your_dehashed_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

#### Getting API Keys:

**DeHashed API Key:**
1. Sign up at [DeHashed.com](https://dehashed.com)
2. Subscribe to their API service
3. Get your API key from the dashboard

**Telegram Bot Token:**
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token

**Telegram Chat ID:**
1. Add your bot to a chat or group
2. Send a message to the bot
3. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your chat ID in the response

### 3. Redeploy

After adding environment variables, redeploy your application for changes to take effect.

## API Endpoints

### POST /api/proxy

Handles all external API calls securely.

**Actions:**
- `checkPassword`: Check if a password hash exists in breaches
- `sendTelegram`: Send notifications via Telegram

**Request Format:**
```json
{
  "action": "checkPassword",
  "data": {
    "sha256_hashed_password": "hashed_password_here"
  }
}
```

## Local Development

1. Clone the repository
2. Create a `.env.local` file with your environment variables:
   ```
   DEHASHED_API_KEY=your_key_here
   TELEGRAM_BOT_TOKEN=your_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```
3. Install Vercel CLI: `npm i -g vercel`
4. Run locally: `vercel dev`

## File Structure

```
├── api/
│   └── proxy.js          # Vercel serverless function
├── index.html            # Main application
├── vercel.json           # Vercel configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Security Features

- **No API keys in frontend code**
- **Client-side password hashing**
- **CORS protection**
- **Input validation**
- **Error handling**
- **Rate limiting via Vercel**

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: DeHashed API, Telegram Bot API
- **Deployment**: Vercel
- **Security**: SHA-256 hashing, Environment variables

## License

This project is for educational purposes. Please ensure you comply with all API terms of service and applicable laws.