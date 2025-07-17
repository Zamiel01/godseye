# Deployment Guide for Gods Eye

## Quick Deployment Steps

### 1. Prepare Your Repository
```bash
# If not already done, initialize git repository
git init
git add .
git commit -m "Initial commit with Vercel security setup"
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Deploy

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `DEHASHED_API_KEY` | Your DeHashed API key | Production, Preview, Development |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token | Production, Preview, Development |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | Production, Preview, Development |

### 4. Get Your API Keys

#### DeHashed API Key
1. Visit [DeHashed.com](https://dehashed.com)
2. Create an account and subscribe to API access
3. Navigate to your dashboard
4. Copy your API key

#### Telegram Bot Setup
1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token provided

#### Get Telegram Chat ID
1. Add your bot to a chat or group
2. Send a test message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find the `chat.id` value in the JSON response

### 5. Test Your Deployment

1. Visit your deployed URL
2. Try checking a password
3. Verify you receive Telegram notifications
4. Check Vercel function logs for any errors

### 6. Domain Configuration (Optional)

To use a custom domain:
1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Configure DNS records as instructed

## Environment Variables Reference

```bash
# Required for password checking functionality
DEHASHED_API_KEY=your_dehashed_api_key_here

# Required for Telegram notifications
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

## Troubleshooting

### Common Issues

**1. API Key Not Working**
- Verify the key is correctly set in Vercel environment variables
- Check if the key has proper permissions
- Ensure no extra spaces in the environment variable value

**2. Telegram Notifications Not Working**
- Verify bot token is correct
- Ensure chat ID is accurate (including negative sign for groups)
- Check if bot has permission to send messages

**3. CORS Errors**
- The API route handles CORS automatically
- If issues persist, check browser console for specific errors

**4. Function Timeout**
- Default timeout is 30 seconds (configured in vercel.json)
- Check Vercel function logs for performance issues

### Checking Logs

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Functions** tab
4. Click on `/api/proxy` to view logs

## Security Checklist

- ✅ API keys stored in environment variables
- ✅ No sensitive data in frontend code
- ✅ Client-side password hashing
- ✅ CORS protection enabled
- ✅ Input validation implemented
- ✅ Error handling in place
- ✅ .gitignore configured for sensitive files

## Performance Optimization

- Function cold starts: ~100-300ms
- API response time: ~500-2000ms (depends on external APIs)
- Client-side hashing: ~1-5ms
- Total response time: Usually under 3 seconds

## Monitoring

Monitor your application through:
- Vercel Analytics (built-in)
- Vercel Function logs
- Telegram notifications for usage tracking
- Browser developer tools for client-side issues

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel function logs
3. Verify all environment variables are set correctly
4. Test API keys independently if needed