import { NormalItem } from './kinds/normal-item';

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

type ItemKind = {
  new (item: Item): { update(): void };
  handles(item: Item): boolean;
};

export class Catalog {
  private static kinds: ItemKind[] = [];

  static register(kind: ItemKind) {
    Catalog.kinds.push(kind);
  }

  static identify(item: Item) {
    const Kind = Catalog.kinds.find(kind => kind.handles(item)) ?? NormalItem;
    return new Kind(item);
  }
}

class LegendaryItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return item.name == 'Sulfuras, Hand of Ragnaros';
  }

  update() {}
}

Catalog.register(LegendaryItem);

class EventTicketItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return item.name == 'Backstage passes to a TAFKAL80ETC concert';
  }

  update() {
    const sellIn = this.item.sellIn;
    this.item.sellIn = sellIn - 1;

    if (sellIn <= 0) {
      this.item.quality = 0;
      return;
    }

    this.item.quality = Math.min(50, this.item.quality + this.anticipation(sellIn));
  }

  private anticipation(sellIn: number) {
    if (sellIn < 6) {
      return 3;
    }
    if (sellIn < 11) {
      return 2;
    }
    return 1;
  }
}

Catalog.register(EventTicketItem);

class FineAgingItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return item.name == 'Aged Brie';
  }

  update() {
    this.item.sellIn = this.item.sellIn - 1;
    const gain = this.item.sellIn < 0 ? 2 : 1;
    this.item.quality = Math.min(50, this.item.quality + gain);
  }
}

Catalog.register(FineAgingItem);

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      Catalog.identify(this.items[i]).update();
    }

    return this.items;
  }
}
