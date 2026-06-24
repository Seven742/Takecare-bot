const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema(
  {
    mood: { type: String, enum: ['happy', 'okay', 'sad', 'tired'], required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, unique: true, index: true },
    chatId: { type: Number, required: true },
    firstName: { type: String, default: '' },
    timezone: { type: String, default: 'Asia/Phnom_Penh' },

    // The 5 base times the user sets via /schedule
    schedule: {
      wakeUp: { type: String, default: '07:00' },
      breakfast: { type: String, default: '07:30' },
      lunch: { type: String, default: '12:00' },
      dinner: { type: String, default: '19:00' },
      sleep: { type: String, default: '22:00' },
    },

    // Automatically computed from `schedule` (see utils/scheduleCalc.js)
    derived: {
      waterTimes: { type: [String], default: [] },
      sleepReminder: { type: String, default: '21:30' },
      motivationTimes: { type: [String], default: [] },
    },

    reminders: {
      master: { type: Boolean, default: true },
      morning: { type: Boolean, default: true },
      meals: { type: Boolean, default: true },
      water: { type: Boolean, default: true },
      sleep: { type: Boolean, default: true },
      motivation: { type: Boolean, default: true },
    },

    moodLog: { type: [moodEntrySchema], default: [] },
    scheduleSet: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
