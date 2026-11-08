import { Catalog, ItemKind } from '../catalog';
import type { Item } from '../gilded-rose';

const ITEM_NAMES = ['Backstage passes to a TAFKAL80ETC concert'];

class EventTicketItem {
  constructor(private readonly item: Item) {}

  static handles(item: Item) {
    return ITEM_NAMES.includes(item.name);
  }

  update() {
    const sellIn = this.item.sellIn;
    this.item.sellIn = sellIn - 1;

    if (sellIn <= 0) {
      this.item.quality = ItemKind.MIN_QUALITY;
      return this.item;
    }

    this.item.quality = Math.min(ItemKind.MAX_QUALITY, this.item.quality + this.anticipation(sellIn));
    return this.item;
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
