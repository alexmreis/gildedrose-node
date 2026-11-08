# Item behaviour lives in decorators around Item

`GildedRose.updateQuality` was one conditional covering every kind of Item. We're moving each kind's rules into its own class with an `update()` method (`LegendaryItem`, `EventTicketItem`) that wraps an `Item` rather than extending it. `Item` and the `items` property belong to the goblin and must not change, so our behaviour can't depend on an inheritance tree rooted in `Item`.

## Considered Options

- **Subclasses of `Item`**: rejected. Callers create plain `Item` objects and `items` holds them, so subclassing would tie the goblin's class to our hierarchy and change how Items are created.
- **A default wrapper plus a factory for every Item**: rejected for now. It moves the rules for kinds we haven't reached yet, before tests cover them.

## Consequences

Decorators change the wrapped `Item` in place, because callers read results from their own `Item` objects.

`updateQuality` picks one decorator per Item by exact name, once per Daily Update. Decorators don't wrap each other, and kinds not yet moved stay in `updateQuality`.
