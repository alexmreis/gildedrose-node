import { GildedRose, Item } from '../../app/gilded-rose';

export const startingStock = () => [
  new Item('+5 Dexterity Vest', 10, 20),
  new Item('Aged Brie', 2, 0),
  new Item('Elixir of the Mongoose', 5, 7),
  new Item('Sulfuras, Hand of Ragnaros', 0, 80),
  new Item('Sulfuras, Hand of Ragnaros', -1, 80),
  new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
  new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
  new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),
  new Item('Conjured Mana Cake', 3, 6),
];

export function advanceDays(items: Item[], days: number) {
  const aged = items.map(item => new Item(item.name, item.sellIn, item.quality));
  const rose = new GildedRose(aged);
  for (let day = 0; day < days; day++) {
    rose.updateQuality();
  }
  return aged;
}

export function eventTicketBecameWorthless(before: Item[], after: Item[]) {
  return after.some(
    (item, index) =>
      item.name === 'Backstage passes to a TAFKAL80ETC concert' && item.quality === 0 && before[index].quality > 0,
  );
}

export type ItemSubject = 'vest' | 'brie' | 'elixir' | 'maul' | 'ticket' | 'cake';

const SUBJECTS: Record<string, ItemSubject> = {
  '+5 Dexterity Vest': 'vest',
  'Aged Brie': 'brie',
  'Elixir of the Mongoose': 'elixir',
  'Sulfuras, Hand of Ragnaros': 'maul',
  'Backstage passes to a TAFKAL80ETC concert': 'ticket',
  'Conjured Mana Cake': 'cake',
};

export const subjectOf = (name: string) => SUBJECTS[name];

export const iconFor = (name: string) => `/images/items/${subjectOf(name)}.png`;
