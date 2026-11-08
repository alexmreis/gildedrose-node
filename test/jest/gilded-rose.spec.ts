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
  });
});
