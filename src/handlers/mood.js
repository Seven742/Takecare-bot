const User = require('../models/User');

const MOOD_OPTIONS = [
  { key: 'happy', label: '😊 Happy' },
  { key: 'okay', label: '😐 Okay' },
  { key: 'sad', label: '😔 Sad' },
  { key: 'tired', label: '😴 Tired' },
];

const RESPONSES = {
  happy: "That's wonderful! Keep shining. ✨ I love hearing that.",
  okay: 'Thanks for checking in. Steady days are good days too. 🤍',
  sad: "I'm here for you. Tomorrow is a new day, and you don't have to carry today alone. 💙",
  tired: "Don't forget to rest and take care of yourself. You've earned it. 😴",
};

async function moodHandler(ctx) {
  await ctx.reply('How are you feeling right now? 🤍', {
    reply_markup: {
      inline_keyboard: [MOOD_OPTIONS.map((o) => ({ text: o.label, callback_data: `mood_${o.key}` }))],
    },
  });
}

async function handleMoodCallback(ctx) {
  const mood = ctx.callbackQuery.data.replace('mood_', '');
  const today = new Date().toISOString().slice(0, 10);

  await User.findOneAndUpdate(
    { telegramId: ctx.from.id },
    {
      chatId: ctx.chat.id,
      firstName: ctx.from.first_name || 'friend',
      $push: { moodLog: { mood, date: today } },
    },
    { upsert: true }
  );

  await ctx.answerCbQuery();
  const option = MOOD_OPTIONS.find((o) => o.key === mood);
  await ctx.editMessageText(`${option.label}\n\n${RESPONSES[mood]}`);
}

module.exports = { moodHandler, handleMoodCallback };
