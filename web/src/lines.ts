import script from './lines.json';

export type Moment = keyof typeof script;
export type Line = { id: string; text: string };

export function chooseLine(moment: Moment, previousId: string | undefined, random: () => number): Line {
  const options = script[moment].filter(line => line.id !== previousId);
  return options[Math.floor(random() * options.length)];
}
