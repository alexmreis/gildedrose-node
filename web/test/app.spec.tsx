/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import type { Sound } from '../src/sound';

const fakeSound = (): jest.Mocked<Sound> => ({ startMusic: jest.fn(), setMuted: jest.fn(), speak: jest.fn() });

const enterTheInn = async (sound = fakeSound()) => {
  const user = userEvent.setup();
  render(<App sound={sound} random={() => 0} />);
  await user.click(screen.getByRole('button', { name: 'Enter the inn' }));
  return { user, sound };
};

describe('entering the inn', () => {
  it('starts the music and greets the visitor with one greeting', async () => {
    const { sound } = await enterTheInn();

    expect(sound.startMusic).toHaveBeenCalledTimes(1);
    expect(sound.speak).toHaveBeenCalledTimes(1);
    expect(sound.speak).toHaveBeenCalledWith('greeting-1');
    expect(screen.getByRole('status')).toHaveTextContent(/^Hello\.$/);
  });

  it('picks the greeting at random', async () => {
    const sound = fakeSound();
    const user = userEvent.setup();
    render(<App sound={sound} random={() => 0.99} />);

    await user.click(screen.getByRole('button', { name: 'Enter the inn' }));

    expect(sound.speak).toHaveBeenCalledWith('greeting-6');
    expect(screen.getByRole('status')).toHaveTextContent(/^Can I help you\?$/);
  });

  it('plays nothing until the visitor enters', () => {
    const sound = fakeSound();

    render(<App sound={sound} random={() => 0} />);

    expect(sound.startMusic).not.toHaveBeenCalled();
    expect(sound.speak).not.toHaveBeenCalled();
  });
});

const talkToAllison = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: 'Talk to Innkeeper Allison' }));

const inventory = () => screen.queryByRole('dialog', { name: 'Inventory' });

describe('talking to Allison', () => {
  it('shows her name only while she is hovered', async () => {
    const { user } = await enterTheInn();
    const allison = screen.getByRole('button', { name: 'Talk to Innkeeper Allison' });
    expect(screen.queryByText('Innkeeper Allison')).not.toBeInTheDocument();

    await user.hover(allison);
    expect(screen.getByText('Innkeeper Allison')).toBeInTheDocument();

    await user.unhover(allison);
    expect(screen.queryByText('Innkeeper Allison')).not.toBeInTheDocument();
  });

  it('shows her name while she has keyboard focus', async () => {
    const { user } = await enterTheInn();

    await user.tab();

    expect(screen.getByRole('button', { name: 'Talk to Innkeeper Allison' })).toHaveFocus();
    expect(screen.getByText('Innkeeper Allison')).toBeInTheDocument();
  });

  it('keeps the Inventory closed until she is clicked', async () => {
    await enterTheInn();

    expect(inventory()).not.toBeInTheDocument();
  });

  it('opens the Inventory and speaks when she is clicked', async () => {
    const { user, sound } = await enterTheInn();

    await talkToAllison(user);

    expect(inventory()).toBeInTheDocument();
    expect(sound.speak).toHaveBeenLastCalledWith('click-1');
    expect(screen.getByRole('status')).toHaveTextContent('Welcome in, love. Mind the step, and the cheese.');
  });

  it('speaks a different line on the next click and leaves the Inventory open', async () => {
    const { user, sound } = await enterTheInn();

    await talkToAllison(user);
    await talkToAllison(user);

    expect(sound.speak).toHaveBeenLastCalledWith('click-2');
    expect(inventory()).toBeInTheDocument();
  });

  it('lists the nine Items of the starting Inventory', async () => {
    const { user } = await enterTheInn();

    await talkToAllison(user);

    const names = screen.getAllByRole('button', { name: /Vest|Brie|Elixir|Sulfuras|Backstage|Conjured/ });
    expect(names.map(row => row.getAttribute('aria-label'))).toEqual([
      '+5 Dexterity Vest',
      'Aged Brie',
      'Elixir of the Mongoose',
      'Sulfuras, Hand of Ragnaros',
      'Sulfuras, Hand of Ragnaros',
      'Backstage passes to a TAFKAL80ETC concert',
      'Backstage passes to a TAFKAL80ETC concert',
      'Backstage passes to a TAFKAL80ETC concert',
      'Conjured Mana Cake',
    ]);
  });

  it('closes the Inventory with Escape while a slot has focus', async () => {
    const { user } = await enterTheInn();
    await talkToAllison(user);
    act(() => rowsNamed(/Brie/)[0].focus());

    await user.keyboard('{Escape}');

    expect(inventory()).not.toBeInTheDocument();
  });

  it('closes the Inventory with Escape after clicking the tavern', async () => {
    const { user } = await enterTheInn();
    await talkToAllison(user);

    await user.click(screen.getByRole('main'));
    await user.keyboard('{Escape}');

    expect(inventory()).not.toBeInTheDocument();
  });

  it('arranges the Items in a bag of sixteen slots', async () => {
    const { user } = await enterTheInn();

    await talkToAllison(user);

    expect(within(inventory()!).getAllByRole('listitem')).toHaveLength(16);
  });

  it('shows an icon for each Item', async () => {
    const { user } = await enterTheInn();

    await talkToAllison(user);

    expect(rowsNamed(/Brie/)[0].querySelector('img')).toHaveAttribute('src', '/images/items/brie.png');
    expect(rowsNamed(/Sulfuras/)[1].querySelector('img')).toHaveAttribute('src', '/images/items/maul.png');
  });

  it('closes the Inventory with the close button', async () => {
    const { user } = await enterTheInn();
    await talkToAllison(user);

    await user.click(screen.getByRole('button', { name: 'Close Inventory' }));

    expect(inventory()).not.toBeInTheDocument();
  });

  it('closes the Inventory with Escape', async () => {
    const { user } = await enterTheInn();
    await talkToAllison(user);

    await user.keyboard('{Escape}');

    expect(inventory()).not.toBeInTheDocument();
  });
});

const rowsNamed = (name: RegExp) => screen.getAllByRole('button', { name });

const openInventory = async (sound = fakeSound()) => {
  const { user } = await enterTheInn(sound);
  await talkToAllison(user);
  return { user, sound };
};

describe('inspecting an Item', () => {
  it('shows its name, Sell In and Quality on hover', async () => {
    const { user } = await openInventory();

    await user.hover(rowsNamed(/Vest/)[0]);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('+5 Dexterity Vest');
    expect(tooltip).toHaveTextContent('Sell In 10');
    expect(tooltip).toHaveTextContent('Quality 20');
  });

  it('hides the details when the pointer leaves', async () => {
    const { user } = await openInventory();
    const row = rowsNamed(/Vest/)[0];

    await user.hover(row);
    await user.unhover(row);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('tells apart Items that share a name', async () => {
    const { user } = await openInventory();

    await user.hover(rowsNamed(/Sulfuras/)[1]);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Sell In -1');
  });

  it('shows the details on keyboard focus', async () => {
    await openInventory();

    act(() => rowsNamed(/Brie/)[0].focus());

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Aged Brie');
  });

  it('shows the details on tap', async () => {
    const { user } = await openInventory();

    await user.pointer({ keys: '[TouchA]', target: rowsNamed(/Elixir/)[0] });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Elixir of the Mongoose');
  });
});

const advanceDays = async (user: ReturnType<typeof userEvent.setup>, days: string) => {
  const input = screen.getByRole('spinbutton', { name: 'Days to advance' });
  await user.clear(input);
  await user.type(input, days);
  await user.click(screen.getByRole('button', { name: 'Advance' }));
};

const expectDetails = async (user: ReturnType<typeof userEvent.setup>, row: HTMLElement, ...details: string[]) => {
  await user.hover(row);
  details.forEach(detail => expect(screen.getByRole('tooltip')).toHaveTextContent(detail));
  await user.unhover(row);
};

describe('asking Allison about an Item', () => {
  it('has her remark on the Item when its slot is clicked', async () => {
    const { user, sound } = await openInventory();

    await user.click(rowsNamed(/Brie/)[0]);

    expect(sound.speak).toHaveBeenLastCalledWith('brie-1');
    expect(screen.getByRole('status')).toHaveTextContent('The only thing in this inn improving with age.');
  });

  it('gives a different remark on the next click', async () => {
    const { user, sound } = await openInventory();

    await user.click(rowsNamed(/Brie/)[0]);
    await user.click(rowsNamed(/Brie/)[0]);

    expect(sound.speak).toHaveBeenLastCalledWith('brie-2');
  });

  it('has remarks that match each kind of Item', async () => {
    const { user, sound } = await openInventory();

    await user.click(rowsNamed(/Sulfuras/)[1]);
    expect(sound.speak).toHaveBeenLastCalledWith('maul-1');

    await user.click(rowsNamed(/Backstage/)[2]);
    expect(sound.speak).toHaveBeenLastCalledWith('ticket-1');
  });

  it('stays quiet when an Item is only hovered', async () => {
    const { user, sound } = await openInventory();
    sound.speak.mockClear();

    await user.hover(rowsNamed(/Brie/)[0]);

    expect(sound.speak).not.toHaveBeenCalled();
  });
});

describe('advancing days', () => {
  it('starts at Day 0', async () => {
    await openInventory();

    expect(screen.getByText('Day 0')).toBeInTheDocument();
  });

  it('applies that many Daily Updates to the Items', async () => {
    const { user } = await openInventory();

    await advanceDays(user, '3');

    expect(screen.getByText('Day 3')).toBeInTheDocument();
    await expectDetails(user, rowsNamed(/Vest/)[0], 'Sell In 7', 'Quality 17');
    await expectDetails(user, rowsNamed(/Conjured/)[0], 'Sell In 0', 'Quality 0');
  });

  it('adds to the Day count across advances', async () => {
    const { user } = await openInventory();

    await advanceDays(user, '3');
    await advanceDays(user, '2');

    expect(screen.getByText('Day 5')).toBeInTheDocument();
    await expectDetails(user, rowsNamed(/Vest/)[0], 'Sell In 5', 'Quality 15');
  });

  it('shows how each Item changed in the latest advance', async () => {
    const { user } = await openInventory();

    await advanceDays(user, '3');
    await advanceDays(user, '2');

    await user.hover(rowsNamed(/Vest/)[0]);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Quality 17 → 15');
    expect(screen.getByRole('tooltip')).not.toHaveTextContent('Quality 20 → 17');
  });

  it('shows no change for an Item whose Quality held', async () => {
    const { user } = await openInventory();

    await advanceDays(user, '3');

    await user.hover(rowsNamed(/Sulfuras/)[0]);
    expect(screen.getByRole('tooltip')).not.toHaveTextContent('→');
    expect(within(rowsNamed(/Sulfuras/)[0]).queryByText(/^[+−]/)).not.toBeInTheDocument();
  });

  it('marks each slot with how far its Quality moved', async () => {
    const { user } = await openInventory();

    await advanceDays(user, '3');

    expect(within(rowsNamed(/Vest/)[0]).getByText('−3')).toBeInTheDocument();
    expect(within(rowsNamed(/Brie/)[0]).getByText('+4')).toBeInTheDocument();
  });

  it('has Allison remark on the advance', async () => {
    const { user, sound } = await openInventory();

    await advanceDays(user, '1');

    expect(sound.speak).toHaveBeenLastCalledWith('advance-1');
  });

  it.each(['0', '31', '1.5'])('refuses to advance by %s days', async days => {
    const { user } = await openInventory();
    const input = screen.getByRole('spinbutton', { name: 'Days to advance' });

    await user.clear(input);
    await user.type(input, days);

    expect(screen.getByRole('button', { name: 'Advance' })).toBeDisabled();
  });

  it('accepts the 30 day maximum', async () => {
    const { user } = await openInventory();

    await advanceDays(user, '30');

    expect(screen.getByText('Day 30')).toBeInTheDocument();
  });

  it('has Allison mourn an Event Ticket that became worthless', async () => {
    const { user, sound } = await openInventory();

    await advanceDays(user, '6');

    expect(sound.speak).toHaveBeenLastCalledWith('worthless-1');
    expect(screen.getByRole('status')).toHaveTextContent('Those passes are kindling now.');
  });

  it('stays with the usual remark on the last day an Event Ticket is worth anything', async () => {
    const { user, sound } = await openInventory();

    await advanceDays(user, '5');

    expect(sound.speak).toHaveBeenLastCalledWith('advance-1');
  });

  it('does not mourn Event Tickets that were already worthless', async () => {
    const { user, sound } = await openInventory();

    await advanceDays(user, '16');
    await advanceDays(user, '1');

    expect(sound.speak).toHaveBeenLastCalledWith('advance-1');
  });
});

describe('starting over', () => {
  it('returns to Day 0 with the original Items and leaves the Inventory open', async () => {
    const { user } = await openInventory();
    await advanceDays(user, '3');

    await user.click(screen.getByRole('button', { name: 'Start over' }));

    expect(screen.getByText('Day 0')).toBeInTheDocument();
    expect(within(rowsNamed(/Vest/)[0]).queryByText('−3')).not.toBeInTheDocument();
    expect(inventory()).toBeInTheDocument();
    await expectDetails(user, rowsNamed(/Vest/)[0], 'Sell In 10', 'Quality 20');
  });
});

describe('muting', () => {
  it('mutes and unmutes the sound', async () => {
    const { user, sound } = await enterTheInn();

    await user.click(screen.getByRole('button', { name: 'Mute' }));
    expect(sound.setMuted).toHaveBeenLastCalledWith(true);

    await user.click(screen.getByRole('button', { name: 'Unmute' }));
    expect(sound.setMuted).toHaveBeenLastCalledWith(false);
  });
});

describe('leaving an Item by keyboard', () => {
  it('hides the details when focus moves away', async () => {
    await openInventory();
    const row = rowsNamed(/Brie/)[0];
    act(() => row.focus());

    act(() => row.blur());

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
