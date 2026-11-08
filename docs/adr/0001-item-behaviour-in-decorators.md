# Item behaviour lives in decorators around Item

`GildedRose.updateQuality` was one conditional covering every kind of Item. Each kind's rules now live in their own class with an `update()` method (`LegendaryItem`, `EventTicketItem`, `FineAgingItem`, `NormalItem`) that wraps an `Item` rather than extending it. `Item` and the `items` property belong to the goblin and must not change, so our behaviour can't depend on an inheritance tree rooted in `Item`.

## Considered Options

- **Subclasses of `Item`**: rejected. Callers create plain `Item` objects and `items` holds them, so subclassing would tie the goblin's class to our hierarchy and change how Items are created.
- **A default wrapper plus a factory built up front**: rejected. It moves the rules for every kind at once, before tests cover them. Each kind moved separately behind its own tests instead, and the default came last.

## Consequences

Decorators change the wrapped `Item` in place, because callers read results from their own `Item` objects.

`updateQuality` picks one decorator per Item by exact name, once per Daily Update, and any other name gets `NormalItem`. Decorators don't wrap each other.
