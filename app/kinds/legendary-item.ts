import { Catalog } from '../catalog';
import type { Item } from '../gilded-rose';

const ITEM_NAMES = ['Sulfuras, Hand of Ragnaros'];

class LegendaryItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return ITEM_NAMES.includes(item.name);
  }

  update() {
    return this.item;
  }
}

Catalog.register(LegendaryItem);
