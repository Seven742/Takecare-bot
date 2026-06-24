const User = require('../models/User');

module.exports = async function startHandler(ctx) {
  const telegramId = ctx.from.id;
  const chatId = ctx.chat.id;
  const firstName = ctx.from.first_name || 'friend';

  let user = await User.findOne({ telegramId });
  if (!user) {
    user = await User.create({ telegramId, chatId, firstName });
  } else {
    user.chatId = chatId;
    user.firstName = firstName;
    await user.save();
  }

  const welcome = `👋 Hello! I'm SpendCare Bot.
I'm here to take care of you every day, ${firstName}. 🤍

I can remind you to:
✅ Eat your meals
✅ Drink water
✅ Sleep on time
✅ Stay motivated
✅ Check in on your mood

Let's build healthy habits together! ❤️

To get started, set up your daily schedule with /schedule — that way I'll know exactly when to check in on you.

Type /help anytime to see everything I can do.`;

  await ctx.reply(welcome);
};
