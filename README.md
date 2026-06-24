# 🤍 SpendCare Bot

A caring personal-assistant Telegram bot that helps users build healthy daily
habits — meals, water, sleep, motivation, and mood check-ins — based on a
schedule each user sets for themselves.

## Features

- **Daily greeting** at the user's wake-up time
- **Breakfast / lunch / dinner reminders** at the times they set
- **Water reminders** automatically spaced every ~3 hours between waking and sleeping
- **Sleep reminder** 30 minutes before their bedtime
- **Motivation messages** twice a day (midday and evening), randomly picked
- **Mood check-in** (`/mood`) with inline buttons and caring responses
- **Per-category reminder toggles** (`/reminders`) — turn any category on/off
- Everything is per-user and stored in MongoDB, so it scales to many users

All of the timed reminders (water, sleep, motivation) are **derived
automatically** from the 5 base times a user enters with `/schedule` — they
never have to configure those separately.

## Commands

| Command      | Description                                      |
|--------------|---------------------------------------------------|
| `/start`     | Welcome message, registers the user               |
| `/help`      | Show available commands                           |
| `/schedule`  | Step-by-step setup of wake-up / meal / sleep times |
| `/mood`      | Mood check-in with buttons                         |
| `/reminders` | Toggle reminder categories on/off                  |
| `/status`    | Show saved schedule and current reminder settings  |

## Project structure

```
spendcare-bot/
├── index.js                  # Entry point: DB, bot launch, cron, health server
├── ecosystem.config.js       # PM2 process config
├── Procfile                  # For Render/Railway
├── src/
│   ├── bot.js                # Telegraf wiring (commands, actions, middleware)
│   ├── config/db.js          # MongoDB connection
│   ├── models/User.js        # User schema (schedule, derived times, toggles, moods)
│   ├── scheduler/cron.js     # Per-minute job that sends due reminders
│   ├── handlers/             # One file per command
│   └── utils/
│       ├── time.js           # HH:mm parsing/formatting, timezone-aware "now"
│       ├── scheduleCalc.js   # Derives water/sleep/motivation times
│       └── messages.js       # All the friendly message templates
```

## Setup

1. **Create the bot** with [@BotFather](https://t.me/BotFather) and grab the token.
2. **Create a MongoDB Atlas cluster** (or use an existing one) and grab the connection string.
3. Copy `.env.example` to `.env` and fill in both values:

   ```
   BOT_TOKEN=123456:your-telegram-bot-token
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/spendcare
   ```

   ⚠️ Never commit `.env` — it's already in `.gitignore`. If a token or URI
   is ever pasted somewhere public (including in a chat), rotate it
   immediately from BotFather / Atlas.

4. Install dependencies:

   ```bash
   npm install
   ```

5. Run it:

   ```bash
   npm start
   ```

## How reminders work

A single cron job runs **every minute** (in the `Asia/Phnom_Penh` timezone)
and checks each user's saved times against the current time. This means
adding, changing, or removing a user's schedule takes effect immediately —
there's no need to restart anything or manage individual scheduled jobs per
user. It also scales cleanly to many users since it's one lightweight DB
query per minute.

## Deployment

### Render or Railway
Both platforms detect `npm start` automatically (or use the included
`Procfile`). Set `BOT_TOKEN` and `MONGODB_URI` as environment variables in
the dashboard. The bot opens a tiny HTTP server on `$PORT` purely so the
platform's health check has something to ping — it doesn't serve a real
website.

### VPS with PM2
```bash
npm install -g pm2   # if not already installed
npm install
pm2 start ecosystem.config.js
pm2 save
```

## Notes

- Bot uses **long polling** (`bot.launch()`), so no public webhook URL is needed.
- All times are entered and displayed in **24-hour `HH:mm`** format.
- Mood history is stored per user in `moodLog` if you want to build trends/analytics later.
