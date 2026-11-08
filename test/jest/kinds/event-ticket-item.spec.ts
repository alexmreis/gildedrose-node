import { Item, GildedRose } from '@/gilded-rose';

describe('Backstage passes', () => {
  describe('update', () => {
    function updatedPass(sellIn: number, quality: number) {
      const pass = new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality);

      new GildedRose([pass]).updateQuality();

      return pass;
    }

    it('lowers sellIn by 1', () => {
      expect(updatedPass(15, 20).sellIn).toBe(14);
    });

    it('lowers sellIn below 0 once the concert has passed', () => {
      expect(updatedPass(0, 20).sellIn).toBe(-1);
    });

    it('gains 1 quality with more than 10 days left', () => {
      expect(updatedPass(11, 20).quality).toBe(21);
    });

    it('gains 2 quality with 10 days left', () => {
      expect(updatedPass(10, 20).quality).toBe(22);
    });

    it('gains 2 quality with 6 days left', () => {
      expect(updatedPass(6, 20).quality).toBe(22);
    });

    it('gains 3 quality with 5 days left', () => {
      expect(updatedPass(5, 20).quality).toBe(23);
    });

    it('gains 3 quality with 1 day left', () => {
      expect(updatedPass(1, 20).quality).toBe(23);
    });

    it('drops quality to 0 once the concert has passed', () => {
      expect(updatedPass(0, 20).quality).toBe(0);
    });

    it('stays at 0 quality after the concert', () => {
      expect(updatedPass(-1, 0).quality).toBe(0);
    });

    it('maxes out quality at 50 with more than 10 days left', () => {
      expect(updatedPass(11, 50).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 2', () => {
      expect(updatedPass(10, 49).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 3', () => {
      expect(updatedPass(5, 48).quality).toBe(50);
    });

    it('returns the same Event Ticket before the concert', () => {
      const pass = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20);

      expect(new GildedRose([pass]).updateQuality()[0]).toBe(pass);
    });

    it('returns the same Event Ticket after the concert', () => {
      const pass = new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20);

      expect(new GildedRose([pass]).updateQuality()[0]).toBe(pass);
    });
  });
});
