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

class LegendaryItem {
  constructor(private readonly item: Item) {}

  update() {}
}

class EventTicketItem {
  constructor(private readonly item: Item) {}

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

class FineAgingItem {
  constructor(private readonly item: Item) {}

  update() {
    this.item.sellIn = this.item.sellIn - 1;
    const gain = this.item.sellIn < 0 ? 2 : 1;
    this.item.quality = Math.min(50, this.item.quality + gain);
  }
}

class NormalItem {
  constructor(private readonly item: Item) {}

  update() {
    if (this.item.quality > 0) {
      this.item.quality = this.item.quality - 1
    }
    this.item.sellIn = this.item.sellIn - 1;
    if (this.item.sellIn < 0) {
      if (this.item.quality > 0) {
        this.item.quality = this.item.quality - 1
      }
    }
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name == 'Sulfuras, Hand of Ragnaros') {
        new LegendaryItem(this.items[i]).update();
        continue;
      }
      if (this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert') {
        new EventTicketItem(this.items[i]).update();
        continue;
      }
      if (this.items[i].name == 'Aged Brie') {
        new FineAgingItem(this.items[i]).update();
        continue;
      }
      if (this.items[i].quality > 0) {
        this.items[i].quality = this.items[i].quality - 1
      }
      this.items[i].sellIn = this.items[i].sellIn - 1;
      if (this.items[i].sellIn < 0) {
        if (this.items[i].quality > 0) {
          this.items[i].quality = this.items[i].quality - 1
        }
      }
    }

    return this.items;
  }
}
