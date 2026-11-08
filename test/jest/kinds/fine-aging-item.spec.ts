import { Item, GildedRose } from '@/gilded-rose';

describe('Fine Aging Items', () => {
  describe('update', () => {
    function updatedBrie(sellIn: number, quality: number) {
      const brie = new Item('Aged Brie', sellIn, quality);

      new GildedRose([brie]).updateQuality();

      return brie;
    }

    it('lowers sellIn by 1', () => {
      expect(updatedBrie(2, 0).sellIn).toBe(1);
    });

    it('lowers sellIn below 0 once the Sell By Date has passed', () => {
      expect(updatedBrie(0, 0).sellIn).toBe(-1);
    });

    it('gains 1 quality before its Sell By Date', () => {
      expect(updatedBrie(2, 0).quality).toBe(1);
    });

    it('gains 1 quality with 1 day left', () => {
      expect(updatedBrie(1, 0).quality).toBe(1);
    });

    it('gains 2 quality once the Sell By Date has passed', () => {
      expect(updatedBrie(0, 0).quality).toBe(2);
    });

    it('keeps gaining 2 quality after the Sell By Date', () => {
      expect(updatedBrie(-1, 0).quality).toBe(2);
    });

    it('maxes out quality at 50 before its Sell By Date', () => {
      expect(updatedBrie(2, 50).quality).toBe(50);
    });

    it('maxes out quality at 50 after its Sell By Date', () => {
      expect(updatedBrie(-1, 50).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 2', () => {
      expect(updatedBrie(-1, 49).quality).toBe(50);
    });

    it('returns the same Fine Aging Item', () => {
      const brie = new Item('Aged Brie', 2, 0);

      expect(new GildedRose([brie]).updateQuality()[0]).toBe(brie);
    });
  });
});
