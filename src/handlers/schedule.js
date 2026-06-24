const User = require('../models/User');
const { normalizeTime } = require('../utils/time');
const { computeDerived } = require('../utils/scheduleCalc');

// In-memory state for users currently mid-way through the /schedule conversation.
// Keyed by telegramId -> { step, data }
const sessions = new Map();

const STEPS = [
  { key: 'wakeUp', prompt: '🌞 What time do you usually wake up? (e.g. 07:00)' },
  { key: 'breakfast', prompt: '🍳 What time do you usually have breakfast?' },
  { key: 'lunch', prompt: '🍛 What time do you usually have lunch?' },
  { key: 'dinner', prompt: '🍜 What time do you usually have dinner?' },
  { key: 'sleep', prompt: '🌙 What time do you usually go to sleep?' },
];

function cancelKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: '✖️ Cancel', callback_data: 'schedule_cancel' }]],
    },
  };
}

async function scheduleHandler(ctx) {
  sessions.set(ctx.from.id, { step: 0, data: {} });
  await ctx.reply(
    "Let's set up your daily schedule together. 💛\nJust send me times in 24-hour HH:MM format, like 07:30.\n\n" +
      STEPS[0].prompt,
    cancelKeyboard()
  );
}

// Called from the generic text middleware. Returns true if this message
// was consumed as part of an active /schedule conversation.
async function handleScheduleText(ctx) {
  const session = sessions.get(ctx.from.id);
  if (!session) return false;

  const text = ctx.message.text;
  const normalized = normalizeTime(text);
  if (!normalized) {
    await ctx.reply("Hmm, I couldn't read that. Please send a time like 07:30 🙂", cancelKeyboard());
    return true;
  }

  const currentKey = STEPS[session.step].key;
  session.data[currentKey] = normalized;
  session.step += 1;

  if (session.step < STEPS.length) {
    await ctx.reply(STEPS[session.step].prompt, cancelKeyboard());
    return true;
  }

  const derived = computeDerived(session.data);
  await User.findOneAndUpdate(
    { telegramId: ctx.from.id },
    {
      chatId: ctx.chat.id,
      firstName: ctx.from.first_name || 'friend',
      schedule: session.data,
      derived,
      scheduleSet: true,
    },
    { upsert: true }
  );
  sessions.delete(ctx.from.id);

  await ctx.reply(`✅ All set, ${ctx.from.first_name || 'friend'}! Here's your schedule:

🌞 Wake-up: ${session.data.wakeUp}
🍳 Breakfast: ${session.data.breakfast}
🍛 Lunch: ${session.data.lunch}
🍜 Dinner: ${session.data.dinner}
🌙 Sleep: ${session.data.sleep}

💧 I'll also check in on water roughly every 3 hours during your day, and send a gentle motivation boost twice a day. You can fine-tune what's on or off anytime with /reminders.

I've got you. 🤍`);
  return true;
}

async function handleScheduleCancel(ctx) {
  sessions.delete(ctx.from.id);
  await ctx.answerCbQuery('Cancelled');
  await ctx.editMessageText("No problem, we can set this up later. Just send /schedule whenever you're ready. 🤍");
}

module.exports = { scheduleHandler, handleScheduleText, handleScheduleCancel, sessions };
