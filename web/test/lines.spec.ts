import { existsSync } from 'fs';
import { join } from 'path';
import script from '../src/lines.json';
import { chooseLine } from '../src/lines';

describe('choosing what Allison says', () => {
  it('picks from the lines for the moment', () => {
    expect(chooseLine('click', undefined, () => 0).id).toBe('click-1');
    expect(chooseLine('click', undefined, () => 0.99).id).toBe('click-4');
    expect(chooseLine('worthless', undefined, () => 0.99).id).toBe('worthless-3');
  });

  it('never repeats the previous line', () => {
    expect(chooseLine('click', 'click-1', () => 0).id).toBe('click-2');
    expect(chooseLine('click', 'click-4', () => 0.99).id).toBe('click-3');
  });

  it('can use any line when the previous one came from another moment', () => {
    expect(chooseLine('advance', 'click-1', () => 0).id).toBe('advance-1');
  });
});

describe("Allison's script", () => {
  it.each(Object.values(script).flat())('has a voice clip for $id', ({ id }) => {
    expect(existsSync(join(__dirname, '..', 'public', 'audio', `${id}.wav`))).toBe(true);
  });
});
