# Item kinds register themselves in a Catalog beside Item

`updateQuality` used a chain of name checks to pick a decorator. Each kind now says which Items it handles and registers itself in a `Catalog`, and `updateQuality` asks the `Catalog` to identify each Item. A new kind adds a class and its registration, with no change to `updateQuality` or the other kinds.

## Considered Options

- **A factory method and registration on `Item`**: rejected. `Item` belongs to the goblin and must not change.
- **A table from Item name to kind**: rejected. It can't express anything beyond exact names, such as every Conjured Item, and it separates a kind from the knowledge of which Items are its own.
- **A `GildedRose` constructor taking Item and kind pairs**: rejected. It spreads that knowledge to every caller and can drift out of sync with the public `items` property.

## Consequences

The first registered kind that handles an Item wins, so overlapping kinds depend on registration order.

`NormalItem` isn't registered. It's the fallback for any Item no kind handles, which keeps it independent of registration order.

Kinds register when the module loads. While everything is in one file that's automatic, and `Catalog` must be declared before the first registration. Once kinds have their own files, something must import each one.
