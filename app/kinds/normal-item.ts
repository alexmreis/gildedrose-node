import { ItemKind } from '../catalog';
import type { Item } from '../gilded-rose';

export class NormalItem {
  constructor(private readonly item: Item) {}

  update() {
    this.item.sellIn = this.item.sellIn - 1;
    const loss = this.item.sellIn < 0 ? 2 : 1;
    this.item.quality = Math.max(ItemKind.MIN_QUALITY, this.item.quality - loss);
    return this.item;
  }
}
