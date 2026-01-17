# Portfolio Chat Server

Anonymous Discord-like chat server for your portfolio.

## Features

- 🎭 **Anonymous usernames** - Auto-generated fun names like "MysteriousPanda420"
- 🎨 **Random avatars** - DiceBear avatars with random styles
- 🌈 **Random colors** - Each user gets a unique color
- 🌍 **Location flags** - Shows country flag based on IP
- ⚡ **Real-time messaging** - Socket.IO powered
- 🛡️ **Rate limiting** - Prevents spam (5 msgs per 10 seconds)
- 📜 **Message history** - Keeps last 100 messages

## Free Deployment on Render.com

1. **Push this server folder to GitHub** (or your entire repo)

2. **Go to [Render.com](https://render.com)** and sign up (free)

3. **Create a New Web Service:**
   - Connect your GitHub repo
   - Set **Root Directory** to `server`
   - Set **Build Command** to `npm install`
   - Set **Start Command** to `npm start`
   - Choose **Free** plan

4. **Add Environment Variable:**
   - `ALLOWED_ORIGINS` = `https://yourdomain.com,http://localhost:3000`

5. **Deploy!** You'll get a URL like `https://your-app.onrender.com`

6. **Update your frontend .env:**
   ```
   NEXT_PUBLIC_WS_URL=https://your-app.onrender.com
   ```

## Local Development

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:3001`

## API Endpoints

- `GET /` - Server status (users count, message count)
- `GET /health` - Health check

## Socket Events

### Client → Server
- `msg-send` - Send a message
- `update-user` - Update profile (name, avatar, color)
- `cursor-move` - Send cursor position
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server → Client
- `session` - Session ID for reconnection
- `msgs-receive-init` - Initial message history
- `msg-receive` - New message
- `users` - Updated user list
- `warning` - Rate limit or error warning
- `user-typing` - Someone is typing
- `user-stop-typing` - Someone stopped typing

## Free Tier Limitations

Render.com free tier:
- Spins down after 15 min of inactivity
- Spins back up on first request (~30 sec cold start)
- 750 hours/month free (plenty for a portfolio)

This is perfect for a portfolio chat - it's free and works great!
