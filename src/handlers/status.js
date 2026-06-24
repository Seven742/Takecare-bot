const User = require('../models/User');

module.exports = async function statusHandler(ctx) {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user || !user.scheduleSet) {
    await ctx.reply("You haven't set up your schedule yet. Send /schedule and I'll get to know your day 🤍");
    return;
  }

  const r = user.reminders;
  const onOff = (v) => (v ? '✅' : '⛔');

  const today = new Date().toISOString().slice(0, 10);
  const lastMood = user.moodLog.length ? user.moodLog[user.moodLog.length - 1] : null;
  const moodLine = lastMood && lastMood.date === today ? `\n\n📝 Today's mood: ${lastMood.mood}` : '';

  await ctx.reply(`📅 Your daily schedule, ${user.firstName || 'friend'}:

🌞 Wake-up: ${user.schedule.wakeUp}
🍳 Breakfast: ${user.schedule.breakfast}
🍛 Lunch: ${user.schedule.lunch}
🍜 Dinner: ${user.schedule.dinner}
🌙 Sleep: ${user.schedule.sleep}

💧 Water check-ins: ${user.derived.waterTimes.join(', ') || '—'}
💪 Motivation boosts: ${user.derived.motivationTimes.join(', ') || '—'}

Reminders:
${onOff(r.master)} All reminders
${onOff(r.morning)} Morning greeting
${onOff(r.meals)} Meals
${onOff(r.water)} Water
${onOff(r.sleep)} Sleep
${onOff(r.motivation)} Motivation${moodLine}

Want to change anything? Use /schedule or /reminders.`);
};
