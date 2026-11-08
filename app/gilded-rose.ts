import { Catalog } from './catalog';
import './kinds';

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
