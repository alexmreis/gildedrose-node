# Gilded Rose

This is the Gilded Rose kata in TypeScript.

## Getting started

Install dependencies

```sh
npm install
```

## Run the unit tests from the Command-Line

```sh
npm run test:jest
```

To run all tests in watch mode

```sh
npm run test:jest:watch
```


## Run the TextTest fixture from the Command-Line

```sh
npx ts-node test/golden-master-text-test.ts
```

Or with number of days as args:
```sh
npx ts-node test/golden-master-text-test.ts 10
```

You should make sure the command shown above works when you execute it in a terminal before trying to use TextTest (see below).


## Run the TextTest approval test that comes with this project

There are instructions in the [TextTest Readme](texttests/README.md) for setting up TextTest. [config.gr](texttests/config.gr) is already set up for this project, so you can run it with:

```sh
./start_texttest.sh
```

TextTest doesn't run on the newest Python releases, so the script picks a Python that can run it. Set `PYTHON` to choose one yourself.

`texttests/ThirtyDays/stdout.gr` differs from the upstream kata on four `Conjured Mana Cake` lines. Upstream records the original code, where Conjured Items aren't implemented.


## Adding a new kind of Item

Each kind of Item lives in its own file under `app/kinds/`, and registers itself with the `Catalog`.

- **Another Item of an existing kind:** add its name to that kind's `ITEM_NAMES`. Conjured Items are the exception: any name starting with `Conjured ` is one.
- **A new kind:** add a file with a class that takes the `Item` in its constructor, has a static `handles(item)` and an `update()` that returns the `Item`, and calls `Catalog.register`. Then import the file in `app/kinds/index.ts`.

The first registered kind that handles an Item wins, and anything no kind handles is a Normal Item. Don't change the `Item` class or the `items` property, as the requirements explain.


## Project docs

- [Requirements](GildedRoseRequirements.md)
- [Contributing](CONTRIBUTING.md)
- [Glossary](GLOSSARY.md)
- [Architecture decisions](docs/adr/)


## Acceptance testing

The author has visited the Gilded Rose and taste tested the inventory as part of acceptance testing during the WoW Forever launch weekend.

![The Gilded Rose inn sign in the Stormwind Trade District](docs/images/gilded-rose-exterior.jpg)

![Browsing Innkeeper Allison's inventory at the Gilded Rose](docs/images/gilded-rose-inventory.jpg)


