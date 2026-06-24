module.exports = async function helpHandler(ctx) {
  await ctx.reply(`🤍 Here's how I can take care of you:

/schedule - Set or update your daily schedule (wake-up, meals, sleep)
/mood - Tell me how you're feeling today
/reminders - Turn reminder types on or off
/status - See your saved schedule and reminder settings
/help - Show this list again

Once your schedule is set, I'll quietly check in with breakfast, lunch, dinner, water, sleep, and motivation reminders throughout your day — no need to do anything else. 🌿`);
};
