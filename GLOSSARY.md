# Gilded Rose

The inventory system of a small inn. It ages the inn's stock at the end of each day.

## Language

### Stock

**Item**:
A single line of stock held by the inn, with a name, a Sell In and a Quality.
_Avoid_: Product, good

**Sell In**:
The number of days left to sell an Item. It goes negative once the Sell By Date has passed.
_Avoid_: Days left, expiry

**Sell By Date**:
The day an Item should be sold by. It has passed once Sell In is below 0.
_Avoid_: Expiry date

**Quality**:
How valuable an Item is, from 0 to 50. Only a Legendary Item can be above 50.
_Avoid_: Value, price

**Daily Update**:
The end-of-day change applied to every Item's Sell In and Quality.
_Avoid_: Tick, quality update

**Day**:
The number of Daily Updates applied since the inn opened, starting at 0.
_Avoid_: Turn, date

**Inventory**:
All the Items the inn currently holds.
_Avoid_: Ledger, item list

**Innkeeper**:
Allison, the friendly person who runs the inn and shows visitors its Inventory.
_Avoid_: Vendor, NPC

**Catalog**:
The inn's record of the kinds of Item it carries.
_Avoid_: Registry, factory, decorators

### Kinds of Item

**Normal Item**:
An Item with no special rules, which loses Quality as it ages.
_Avoid_: Standard item, regular item

**Legendary Item**:
An Item that never has to be sold and whose Quality is always 80. Sulfuras is the only one.
_Avoid_: Unique item

**Event Ticket**:
An Item that gains Quality faster as its event approaches and is worth 0 once the event has passed. Backstage passes are the only one.
_Avoid_: Pass, concert ticket

**Anticipation**:
How much an Event Ticket's Quality rises each day as its event nears.
_Avoid_: Hype, demand

**Fine Aging Item**:
An Item that gains Quality as it gets older, twice as fast once its Sell By Date has passed. Aged Brie is the only one the inn carries today.
_Avoid_: Aged item, maturing item, cheese

**Conjured Item**:
An Item that loses Quality twice as fast as a Normal Item.
_Avoid_: Magic item
