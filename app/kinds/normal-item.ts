import type { Item } from '../gilded-rose';

export class NormalItem {
  constructor(private readonly item: Item) {}

  update() {
    this.item.sellIn = this.item.sellIn - 1;
    const loss = this.item.sellIn < 0 ? 2 : 1;
    this.item.quality = Math.max(0, this.item.quality - loss);
  }
}
