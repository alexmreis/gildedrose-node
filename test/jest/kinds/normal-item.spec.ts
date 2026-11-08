import { Item, GildedRose } from '@/gilded-rose';

describe('Normal Items', () => {
  describe('update', () => {
    function updatedVest(sellIn: number, quality: number) {
      const vest = new Item('+5 Dexterity Vest', sellIn, quality);

      new GildedRose([vest]).updateQuality();

      return vest;
    }

    it('lowers sellIn by 1', () => {
      expect(updatedVest(5, 10).sellIn).toBe(4);
    });

    it('lowers sellIn below 0 once the Sell By Date has passed', () => {
      expect(updatedVest(0, 10).sellIn).toBe(-1);
    });

    it('loses 1 quality before its Sell By Date', () => {
      expect(updatedVest(5, 10).quality).toBe(9);
    });

    it('loses 1 quality with 1 day left', () => {
      expect(updatedVest(1, 10).quality).toBe(9);
    });

    it('loses 2 quality once the Sell By Date has passed', () => {
      expect(updatedVest(0, 10).quality).toBe(8);
    });

    it('keeps losing 2 quality after the Sell By Date', () => {
      expect(updatedVest(-1, 10).quality).toBe(8);
    });

    it('loses its last point of quality before its Sell By Date', () => {
      expect(updatedVest(5, 1).quality).toBe(0);
    });

    it('bottoms out quality at 0 before its Sell By Date', () => {
      expect(updatedVest(5, 0).quality).toBe(0);
    });

    it('bottoms out quality at 0 after its Sell By Date', () => {
      expect(updatedVest(-1, 0).quality).toBe(0);
    });

    it('bottoms out quality at 0 when losing 2', () => {
      expect(updatedVest(-1, 1).quality).toBe(0);
    });

    it('returns the same Normal Item', () => {
      const vest = new Item('+5 Dexterity Vest', 5, 10);

      expect(new GildedRose([vest]).updateQuality()[0]).toBe(vest);
    });
  });
});
