import { Catalog } from '@/catalog';
import { Item, GildedRose } from '@/gilded-rose';

describe('Catalog', () => {
  function fakeKind({ handles, setsQualityTo }: { handles: string; setsQualityTo: number }) {
    return class {
      constructor(private readonly item: Item) {}

      static handles(item: Item) {
        return item.name == handles;
      }

      update() {
        this.item.quality = setsQualityTo;
        return this.item;
      }
    };
  }

  it('updates items through a newly registered kind', () => {
    Catalog.register(fakeKind({ handles: 'Test Relic', setsQualityTo: 99 }));
    const relic = new Item('Test Relic', 5, 10);

    new GildedRose([relic]).updateQuality();

    expect(relic.quality).toBe(99);
  });

  it('uses the first registered kind that handles an item', () => {
    Catalog.register(fakeKind({ handles: 'Contested Relic', setsQualityTo: 1 }));
    Catalog.register(fakeKind({ handles: 'Contested Relic', setsQualityTo: 2 }));
    const relic = new Item('Contested Relic', 5, 10);

    new GildedRose([relic]).updateQuality();

    expect(relic.quality).toBe(1);
  });
});
