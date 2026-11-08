import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('should foo', () => {
    const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe('fixme');
  });

  it('keeps Sulfuras quality constant over time', () => {
    const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 5, 80);
    const gildedRose = new GildedRose([sulfuras]);

    for (let day = 0; day < 30; day++) {
      gildedRose.updateQuality();
    }

    expect(sulfuras.quality).toBe(80);
  });
});
