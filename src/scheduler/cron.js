const cron = require('node-cron');
const User = require('../models/User');
const { nowHHMM } = require('../utils/time');
const msgs = require('../utils/messages');

function startScheduler(bot) {
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        await tick(bot);
      } catch (err) {
        console.error('Scheduler tick error:', err);
      }
    },
    { timezone: 'Asia/Phnom_Penh' }
  );
  console.log('⏰ Reminder scheduler started (Asia/Phnom_Penh)');
}

async function tick(bot) {
  const current = nowHHMM('Asia/Phnom_Penh');

  // Only users who have completed /schedule and haven't turned everything off
  const users = await User.find({ scheduleSet: true, 'reminders.master': true });

  for (const user of users) {
    const send = (text) =>
      bot.telegram
        .sendMessage(user.chatId, text)
        .catch((err) => console.error(`Failed to message ${user.telegramId}:`, err.message));

    if (user.reminders.morning && user.schedule.wakeUp === current) {
      send(msgs.morningGreeting(user.firstName));
    }
    if (user.reminders.meals && user.schedule.breakfast === current) {
      send(msgs.randomFrom(msgs.BREAKFAST));
    }
    if (user.reminders.meals && user.schedule.lunch === current) {
      send(msgs.randomFrom(msgs.LUNCH));
    }
    if (user.reminders.meals && user.schedule.dinner === current) {
      send(msgs.randomFrom(msgs.DINNER));
    }
    if (user.reminders.water && user.derived.waterTimes.includes(current)) {
      send(msgs.randomFrom(msgs.WATER));
    }
    if (user.reminders.sleep && user.derived.sleepReminder === current) {
      send(msgs.randomFrom(msgs.SLEEP));
    }
    if (user.reminders.motivation && user.derived.motivationTimes.includes(current)) {
      send(msgs.randomFrom(msgs.MOTIVATION));
    }
  }
}

module.exports = { startScheduler };
