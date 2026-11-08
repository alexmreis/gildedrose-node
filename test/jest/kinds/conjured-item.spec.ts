import { Item, GildedRose } from '@/gilded-rose';

describe('Conjured Items', () => {
  describe('update', () => {
    function updated(sellIn: number, quality: number) {
      const cake = new Item('Conjured Mana Cake', sellIn, quality);

      new GildedRose([cake]).updateQuality();

      return cake;
    }

    it('loses 2 quality before its Sell By Date', () => {
      expect(updated(5, 10).quality).toBe(8);
    });

    it('lowers sellIn by 1', () => {
      expect(updated(5, 10).sellIn).toBe(4);
    });

    it('loses 4 quality once the Sell By Date has passed', () => {
      expect(updated(0, 10).quality).toBe(6);
    });

    it('bottoms out quality at 0 before its Sell By Date', () => {
      expect(updated(5, 1).quality).toBe(0);
    });

    it('loses 2 quality with Sell In at 1', () => {
      expect(updated(1, 10).quality).toBe(8);
    });

    it('bottoms out quality at 0 when losing 4', () => {
      expect(updated(-1, 1).quality).toBe(0);
    });

    it('loses 2 quality for a Conjured Aged Brie', () => {
      const brie = new Item('Conjured Aged Brie', 2, 10);

      new GildedRose([brie]).updateQuality();

      expect(brie.quality).toBe(8);
    });

    it('loses 2 quality for a Conjured Sulfuras', () => {
      const sulfuras = new Item('Conjured Sulfuras, Hand of Ragnaros', 5, 80);

      new GildedRose([sulfuras]).updateQuality();

      expect(sulfuras.quality).toBe(78);
    });

    it('returns the same Conjured Item', () => {
      const cake = new Item('Conjured Mana Cake', 5, 10);

      expect(new GildedRose([cake]).updateQuality()[0]).toBe(cake);
    });
  });
});
