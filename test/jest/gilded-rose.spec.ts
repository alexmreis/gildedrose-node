import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
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

  describe('Backstage passes', () => {
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

    it('stays at 50 quality with more than 10 days left', () => {
      expect(updatedPass(11, 50).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 2', () => {
      expect(updatedPass(10, 49).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 3', () => {
      expect(updatedPass(5, 48).quality).toBe(50);
    });
  });
});
