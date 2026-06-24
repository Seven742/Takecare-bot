const { toMinutes, addMinutes } = require('./time');

// Given the 5 base times a user sets (/schedule), automatically work out:
//  - waterTimes: roughly every 3 hours, starting 1h after waking and
//    stopping 1h before sleep, so the user isn't pinged right as they
//    wake up or right before bed.
//  - sleepReminder: 30 minutes before their stated sleep time.
//  - motivationTimes: a midday boost (between breakfast & lunch) and an
//    evening boost (between lunch & dinner).
function computeDerived(schedule) {
  const { wakeUp, breakfast, lunch, dinner, sleep } = schedule;

  const waterTimes = [];
  let cursorMin = toMinutes(wakeUp) + 60; // start 1h after waking
  let endMin = toMinutes(sleep) - 60; // stop 1h before sleep
  if (endMin <= toMinutes(wakeUp)) endMin += 1440; // sleep time wraps past midnight

  while (cursorMin < endMin) {
    waterTimes.push(addMinutes('00:00', cursorMin % 1440));
    cursorMin += 180; // every 3 hours
  }

  const sleepReminder = addMinutes(sleep, -30);

  const midpoint = (a, b) => {
    let ma = toMinutes(a);
    let mb = toMinutes(b);
    if (mb < ma) mb += 1440;
    return addMinutes('00:00', Math.round((ma + mb) / 2) % 1440);
  };
  const motivationTimes = [midpoint(breakfast, lunch), midpoint(lunch, dinner)];

  return { waterTimes, sleepReminder, motivationTimes };
}

module.exports = { computeDerived };
