import { Catalog } from '../catalog';
import type { Item } from '../gilded-rose';

class LegendaryItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return item.name == 'Sulfuras, Hand of Ragnaros';
  }

  update() {}
}

Catalog.register(LegendaryItem);
