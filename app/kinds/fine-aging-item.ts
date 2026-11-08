import { Catalog } from '../catalog';
import type { Item } from '../gilded-rose';

class FineAgingItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return item.name == 'Aged Brie';
  }

  update() {
    this.item.sellIn = this.item.sellIn - 1;
    const gain = this.item.sellIn < 0 ? 2 : 1;
    this.item.quality = Math.min(50, this.item.quality + gain);
    return this.item;
  }
}

Catalog.register(FineAgingItem);
