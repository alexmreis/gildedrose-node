import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
  describe('when 30 days have passed', () => {
    it('applies aging to update quality and sellIn', () => {
      const items = [
        new Item('Sulfuras, Hand of Ragnaros', 0, 80),
        new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
        new Item('Aged Brie', 2, 0),
        new Item('+5 Dexterity Vest', 10, 20),
        new Item('Conjured Mana Cake', 3, 6),
      ];
      const gildedRose = new GildedRose(items);

      const output = Array.from({ length: 31 }, (_, day) => {
        const report = [
          `-------- day ${day} --------`,
          'name, sellIn, quality',
          ...items.map(item => `${item.name}, ${item.sellIn}, ${item.quality}`),
          '',
          '',
        ].join('\n');
        gildedRose.updateQuality();
        return report;
      }).join('');

      expect(output).toMatchSnapshot();
    });
  });

  describe('when several items are updated together', () => {
    it('applies each item its own rules', () => {
      const brie = new Item('Aged Brie', 2, 10);
      const vest = new Item('+5 Dexterity Vest', 2, 10);

      new GildedRose([brie, vest]).updateQuality();

      expect([brie.quality, vest.quality]).toEqual([11, 9]);
    });
  });
});
