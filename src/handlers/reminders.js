const User = require('../models/User');

const LABELS = {
  master: 'All reminders',
  morning: '🌞 Morning greeting',
  meals: '🍽 Meal reminders',
  water: '💧 Water reminders',
  sleep: '🌙 Sleep reminder',
  motivation: '💪 Motivation',
};

function buildKeyboard(reminders) {
  const row = (k) => [
    { text: `${LABELS[k]}: ${reminders[k] ? '✅ ON' : '⛔ OFF'}`, callback_data: `toggle_${k}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [row('master'), row('morning'), row('meals'), row('water'), row('sleep'), row('motivation')],
    },
  };
}

async function remindersHandler(ctx) {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user) {
    await ctx.reply("Let's get to know each other first — send /start 🙂");
    return;
  }
  await ctx.reply(
    "Here's what I'm currently set to remind you about. Tap to turn anything on or off:",
    buildKeyboard(user.reminders)
  );
}

async function handleToggleCallback(ctx) {
  const key = ctx.callbackQuery.data.replace('toggle_', '');
  if (!LABELS[key]) return ctx.answerCbQuery();

  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user) return ctx.answerCbQuery('Please /start first');

  user.reminders[key] = !user.reminders[key];
  await user.save();

  await ctx.answerCbQuery(`${LABELS[key]}: ${user.reminders[key] ? 'ON' : 'OFF'}`);
  await ctx.editMessageReplyMarkup(buildKeyboard(user.reminders).reply_markup);
}

module.exports = { remindersHandler, handleToggleCallback };
