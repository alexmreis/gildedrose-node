import { existsSync } from 'fs';
import { join } from 'path';
import { iconFor, startingStock, subjectOf } from '../src/inn';
import script from '../src/lines.json';

describe('item icons', () => {
  it.each(startingStock().map(item => item.name))('has an icon file for %s', name => {
    expect(existsSync(join(__dirname, '..', 'public', iconFor(name)))).toBe(true);
  });
});

describe('item remarks', () => {
  it.each(startingStock().map(item => item.name))('has at least three remarks for %s', name => {
    expect(script[subjectOf(name)].length).toBeGreaterThanOrEqual(3);
  });
});
