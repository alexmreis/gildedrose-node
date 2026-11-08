# Gilded Rose

The [Gilded Rose refactoring kata](https://github.com/emilybache/GildedRose-Refactoring-Kata) in TypeScript: the original `updateQuality` refactored into one class per kind of Item, with Conjured Items added. See the [requirements](GildedRoseRequirements.md).

## Prerequisites

- Node.js and npm. CI runs on Node 24.
- Python, for TextTest only. Python 3.9 works, and 3.15 doesn't.

## Install

```sh
npm ci
```

## Compile and run

```sh
npm run compile
node dist/test/golden-master-text-test.js 30
```

The compiled JavaScript goes in `dist/`. The kata has no application of its own, so this runs its fixture, which prints the inventory for the given number of days. To run it without compiling:

```sh
npx ts-node test/golden-master-text-test.ts 30
```

## Test

```sh
npm test
npm run test:jest:watch
npm run test:coverage
```

Coverage reports go in `coverage/`. Pull requests run lint, tests and coverage in CI, attach the report to the run, and post the results as a comment.

To run the kata's TextTest approval test:

```sh
./start_texttest.sh
```

[`config.gr`](texttests/config.gr) is already set up for this project, and the script picks a Python that can run TextTest. Set `PYTHON` to choose one yourself. [`stdout.gr`](texttests/ThirtyDays/stdout.gr) differs from the upstream kata on four `Conjured Mana Cake` lines, because upstream records the original code, where Conjured Items aren't implemented.

## Lint and format

```sh
npm run lint
npm run format
```

A pre-commit hook also lints and formats your staged files.

## Refactoring approach

Behaviour was pinned first with approval tests. Each kind of Item then moved out of `updateQuality` in small commits, with focused tests written before its code moved. Mutation testing with Stryker, run outside this repo, checked that those tests could fail. The commit history shows each step. Conjured Items came last, test-first.

This was built with Claude Code as an AI pair, and its commits carry a `Co-Authored-By` trailer. [`CLAUDE.md`](CLAUDE.md) and [`docs/agents/`](docs/agents/) are its configuration.

## Design and trade-offs

- **Classes that wrap `Item`:** the requirements forbid changing `Item` or `items`, so each kind is a decorator rather than a subclass. See [ADR 0001](docs/adr/0001-item-behaviour-in-decorators.md).
- **A self-registering `Catalog`:** each kind says which Items it handles and registers itself, so a new kind doesn't touch `updateQuality` or the other kinds. The cost is module-load side effects, shared state, and a first-match rule that depends on import order. A plain list in one file would also work for five kinds. See [ADR 0002](docs/adr/0002-item-kinds-register-in-a-catalog.md).
- **Conjured Items stand alone:** any name starting with `Conjured ` loses Quality twice as fast as a Normal Item, including a `Conjured Aged Brie`. The requirements only describe the normal case.
- **Differences from the original code:** `updateQuality` returns a new array holding the same `Item` objects, rather than `items` itself. A Fine Aging Item or Event Ticket already above 50 is capped at 50, and a Normal Item already below 0 is raised to 0, states the requirements rule out.

## Adding a new kind of Item

- **Another Item of an existing kind:** add its name to that kind's `ITEM_NAMES` in `app/kinds/`. Any name starting with `Conjured ` is already a Conjured Item.
- **A new kind:** add a file to `app/kinds/` with a class that takes the `Item` in its constructor, has a static `handles(item)` and an `update()` that returns the `Item`, and calls `Catalog.register`. Then import the file in `app/kinds/index.ts`.

The first registered kind that handles an Item wins, and anything no kind handles is a Normal Item.

## Project docs

- [Contributing](CONTRIBUTING.md)
- [Glossary](GLOSSARY.md)
- [Architecture decisions](docs/adr/)

## Acceptance testing

The author has visited the Gilded Rose and taste tested the inventory as part of acceptance testing during the WoW Forever launch weekend.

![The Gilded Rose inn sign in the Stormwind Trade District](docs/images/gilded-rose-exterior.jpg)

![Browsing Innkeeper Allison's inventory at the Gilded Rose](docs/images/gilded-rose-inventory.jpg)
