import type { Item } from './gilded-rose';
import { NormalItem } from './kinds/normal-item';

type ItemKind = {
  new (item: Item): { update(): void };
  handles(item: Item): boolean;
};

export class Catalog {
  private static kinds: ItemKind[] = [];

  static register(kind: ItemKind) {
    Catalog.kinds.push(kind);
  }

  static identify(item: Item) {
    const Kind = Catalog.kinds.find(kind => kind.handles(item)) ?? NormalItem;
    return new Kind(item);
  }
}
