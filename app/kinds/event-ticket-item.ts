import { Catalog } from '../catalog';
import type { Item } from '../gilded-rose';

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
