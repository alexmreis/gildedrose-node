import { Item, GildedRose } from '@/gilded-rose';

describe('Legendary Items', () => {
  describe('update', () => {
    it('keeps Sulfuras quality constant over time', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 5, 80);
      const gildedRose = new GildedRose([sulfuras]);

      for (let day = 0; day < 30; day++) {
        gildedRose.updateQuality();
      }

      expect(sulfuras.quality).toBe(80);
    });

    it('keeps Sulfuras quality constant past its sell date', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', -1, 80);
      const gildedRose = new GildedRose([sulfuras]);

      gildedRose.updateQuality();

      expect(sulfuras.quality).toBe(80);
    });

    it('keeps Sulfuras sellIn constant after an update', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 5, 80);
      const gildedRose = new GildedRose([sulfuras]);

      gildedRose.updateQuality();

      expect(sulfuras.sellIn).toBe(5);
    });

    it('keeps Sulfuras sellIn constant over multiple updates', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 5, 80);
      const gildedRose = new GildedRose([sulfuras]);

      for (let day = 0; day < 30; day++) {
        gildedRose.updateQuality();
      }

      expect(sulfuras.sellIn).toBe(5);
    });

    it('returns the same Legendary Item', () => {
      const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 5, 80);

      expect(new GildedRose([sulfuras]).updateQuality()[0]).toBe(sulfuras);
    });
  });
});
