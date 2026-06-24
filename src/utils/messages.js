// All the things SpendCare Bot says. Kept warm and varied on purpose -
// a few options per category so it doesn't feel like a robot repeating itself.

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function morningGreeting(name) {
  const n = name || 'friend';
  return randomFrom([
    `🌞 Good Morning, ${n}!\nI hope you slept well.\nDon't forget to drink water, eat breakfast, and start your day with a smile. 😊`,
    `🌞 Rise and shine, ${n}!\nA brand new day is here. Take a deep breath, have some water, and get ready for a great day ahead. ❤️`,
    `🌞 Morning, ${n}!\nHope you woke up feeling rested. Today is full of small wins waiting for you. 🤍`,
  ]);
}

const BREAKFAST = [
  '🍳 Time for breakfast! Your body needs energy to start the day.',
  '🍳 Good morning meal time! A warm breakfast will set the tone for a wonderful day.',
  "🍳 Don't skip breakfast — your body and mind will thank you. 🤍",
];

const LUNCH = [
  "🍛 It's lunchtime! Take a break and enjoy your meal.",
  "🍛 Time to pause and refuel. Enjoy your lunch, you've earned the break!",
  '🍛 Lunch break! Step away for a bit and nourish yourself. 😊',
];

const DINNER = [
  "🍜 Dinner time! Don't forget to eat and relax after a long day.",
  '🍜 You made it through the day — now treat yourself to a good dinner and some rest.',
  "🍜 Time for dinner. Eat well, you've worked hard today. ❤️",
];

const WATER = [
  '💧 Water check!\nHave you had enough water today? Stay hydrated.',
  "💧 Quick reminder to drink some water — your body will thank you. 😊",
  '💧 Hydration check! A glass of water right now would be perfect.',
];

const SLEEP = [
  "🌙 It's getting late.\nTry to sleep early tonight so your body can recover and recharge.",
  "🌙 Winding down time. Put the phone away soon and get some good rest. 🤍",
  '🌙 Your body needs sleep to heal and recharge. Try to head to bed soon. 😴',
];

const MOTIVATION = [
  '💪 You are doing great today.',
  '🌟 Small progress is still progress.',
  '❤️ Take care of yourself. You matter.',
  "🌈 Every day is a fresh chance to grow. You've got this.",
  '🤍 Be proud of how far you have come.',
  "✨ You don't have to be perfect, just be you.",
];

module.exports = {
  randomFrom,
  morningGreeting,
  BREAKFAST,
  LUNCH,
  DINNER,
  WATER,
  SLEEP,
  MOTIVATION,
};
