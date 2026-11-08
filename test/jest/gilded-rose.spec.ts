import { Catalog, Item, GildedRose } from '@/gilded-rose';

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

    it('maxes out quality at 50 with more than 10 days left', () => {
      expect(updatedPass(11, 50).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 2', () => {
      expect(updatedPass(10, 49).quality).toBe(50);
    });

    it('caps quality at 50 when gaining 3', () => {
      expect(updatedPass(5, 48).quality).toBe(50);
    });
  });

  describe('Fine Aging Items', () => {
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
  });

  describe('Normal Items', () => {
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
  });

  describe('Catalog', () => {
    function kindSetting(name: string, quality: number) {
      return class {
        constructor(private readonly item: Item) {}

        static handles(item: Item) {
          return item.name == name;
        }

        update() {
          this.item.quality = quality;
        }
      };
    }

    it('updates items through a newly registered kind', () => {
      Catalog.register(kindSetting('Test Relic', 99));
      const relic = new Item('Test Relic', 5, 10);

      new GildedRose([relic]).updateQuality();

      expect(relic.quality).toBe(99);
    });

    it('uses the first registered kind that handles an item', () => {
      Catalog.register(kindSetting('Contested Relic', 1));
      Catalog.register(kindSetting('Contested Relic', 2));
      const relic = new Item('Contested Relic', 5, 10);

      new GildedRose([relic]).updateQuality();

      expect(relic.quality).toBe(1);
    });
  });
});
