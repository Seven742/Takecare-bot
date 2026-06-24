require('dotenv').config();
const http = require('http');
const { connectDB } = require('./src/config/db');
const { createBot } = require('./src/bot');
const { startScheduler } = require('./src/scheduler/cron');

const { BOT_TOKEN, MONGODB_URI, PORT } = process.env;

if (!BOT_TOKEN) {
  console.error('❌ Missing BOT_TOKEN in .env');
  process.exit(1);
}
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI in .env');
  process.exit(1);
}

(async () => {
  await connectDB(MONGODB_URI);

  const bot = createBot(BOT_TOKEN);
  startScheduler(bot);

  await bot.launch();
  console.log('🤖 SpendCare Bot is running...');

  // Render/Railway web services expect something listening on a port.
  // This also doubles as a simple uptime check.
  const port = PORT || 3000;
  http
    .createServer((req, res) => res.end('SpendCare Bot is alive 🤍'))
    .listen(port, () => console.log(`🌐 Health check server listening on port ${port}`));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
})();
