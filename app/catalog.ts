import type { Item } from './gilded-rose';
import { NormalItem } from './kinds/normal-item';

export const ItemKind = {
  MAX_QUALITY: 50,
  MIN_QUALITY: 0,
} as const;

export type ItemKind = {
  new (item: Item): { update(): Item };
  handles(item: Item): boolean;
};

export class Catalog {
  private static kinds: ItemKind[] = [];

  static register(kind: ItemKind) {
    Catalog.kinds.push(kind);
  }

  // Wraps the item in a decorator of the correct ItemKind.
  static identify(item: Item) {
    const Kind = Catalog.kinds.find(kind => kind.handles(item)) ?? NormalItem;
    return new Kind(item);
  }
}
