// Small helpers for working with "HH:mm" time strings and timezones.
// All reminder scheduling in this bot is done in 24h "HH:mm" strings,
// compared against the current time in Asia/Phnom_Penh.

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutes(hhmm, delta) {
  return toHHMM(toMinutes(hhmm) + delta);
}

// Accepts "7:5", "07:05", "23:59", etc. Returns normalized "HH:mm" or null if invalid.
function normalizeTime(input) {
  const match = String(input).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Current "HH:mm" in a given IANA timezone, regardless of the server's own timezone.
function nowHHMM(timeZone = 'Asia/Phnom_Penh') {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());
}

module.exports = { toMinutes, toHHMM, addMinutes, normalizeTime, nowHHMM };
