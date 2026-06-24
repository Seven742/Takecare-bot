const { Telegraf } = require('telegraf');

const startHandler = require('./handlers/start');
const helpHandler = require('./handlers/help');
const { scheduleHandler, handleScheduleText, handleScheduleCancel } = require('./handlers/schedule');
const { moodHandler, handleMoodCallback } = require('./handlers/mood');
const { remindersHandler, handleToggleCallback } = require('./handlers/reminders');
const statusHandler = require('./handlers/status');

function createBot(token) {
  const bot = new Telegraf(token);

  bot.command('start', startHandler);
  bot.command('help', helpHandler);
  bot.command('schedule', scheduleHandler);
  bot.command('mood', moodHandler);
  bot.command('reminders', remindersHandler);
  bot.command('status', statusHandler);

  bot.action('schedule_cancel', handleScheduleCancel);
  bot.action(/^mood_(happy|okay|sad|tired)$/, handleMoodCallback);
  bot.action(/^toggle_(master|morning|meals|water|sleep|motivation)$/, handleToggleCallback);

  // Plain text messages: only relevant when the user is mid-way through
  // the /schedule conversation (commands are matched above and never
  // reach this middleware).
  bot.on('text', async (ctx, next) => {
    const handled = await handleScheduleText(ctx);
    if (!handled) return next();
  });

  bot.catch((err, ctx) => {
    console.error(`Bot error for update type "${ctx.updateType}":`, err);
  });

  return bot;
}

module.exports = { createBot };
