const assert = require('assert');
const { normalizeTime } = require('../src/utils/time');

const validCases = [
    ['7', '07:00'],
    ['7am', '07:00'],
    ['7 am', '07:00'],
    ['7PM', '19:00'],
    ['7:30 PM', '19:30'],
    ['12am', '00:00'],
    ['12 pm', '12:00'],
    ['00:00', '00:00'],
    ['23:59', '23:59'],
    ['9:5', '09:05'],
    ['09:05', '09:05'],
];

const invalidCases = ['25:00', '13am', '0pm', '7:60', 'abc', ''];

for (const [input, expected] of validCases) {
    const actual = normalizeTime(input);
    assert.strictEqual(
        actual,
        expected,
        `Expected normalizeTime(${JSON.stringify(input)}) to be ${expected}, got ${actual}`
    );
}

for (const input of invalidCases) {
    const actual = normalizeTime(input);
    assert.strictEqual(
        actual,
        null,
        `Expected normalizeTime(${JSON.stringify(input)}) to be null, got ${actual}`
    );
}

console.log('All normalizeTime() tests passed.');
