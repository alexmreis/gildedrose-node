import { Catalog } from '../catalog';
import type { Item } from '../gilded-rose';

class ConjuredItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return item.name.startsWith('Conjured ');
  }

  update() {
    this.item.sellIn = this.item.sellIn - 1;
    const loss = this.item.sellIn < 0 ? 4 : 2;
    this.item.quality = Math.max(0, this.item.quality - loss);
    return this.item;
  }
}

Catalog.register(ConjuredItem);
