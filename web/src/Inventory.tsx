import { useState } from 'react';
import type { Item } from '../../app/gilded-rose';

type Inspected = { index: number; top: number };

type Props = {
  items: Item[];
  previousItems: Item[] | null;
  day: number;
  onAdvance: (days: number) => void;
  onStartOver: () => void;
  onClose: () => void;
};

const MAX_DAYS = 30;

const isValidDays = (days: number) => Number.isInteger(days) && days >= 1 && days <= MAX_DAYS;

export function Inventory({ items, previousItems, day, onAdvance, onStartOver, onClose }: Props) {
  const [inspected, setInspected] = useState<Inspected | null>(null);
  const [days, setDays] = useState('1');

  const inspect = (index: number, row: HTMLElement) => {
    const panel = row.closest('[role="dialog"]')!.getBoundingClientRect();
    setInspected({ index, top: row.getBoundingClientRect().top - panel.top });
  };
  const stopInspecting = () => setInspected(null);
  const item = inspected && items[inspected.index];

  return (
    <section role="dialog" aria-label="Inventory" className="inventory">
      <header className="inventory-header">
        <h2>Inventory</h2>
        <button className="close" aria-label="Close Inventory" onClick={onClose}>
          ×
        </button>
      </header>
      <ul className="items">
        {items.map((stocked, index) => (
          <li key={index}>
            <button
              className="item"
              onMouseEnter={event => inspect(index, event.currentTarget)}
              onMouseLeave={stopInspecting}
              onFocus={event => inspect(index, event.currentTarget)}
              onBlur={stopInspecting}
            >
              {stocked.name}
            </button>
            {previousItems && previousItems[index].quality !== stocked.quality && (
              <span className="change">
                Quality {previousItems[index].quality} → {stocked.quality}
              </span>
            )}
          </li>
        ))}
      </ul>
      <footer className="controls">
        <p className="day">Day {day}</p>
        <label>
          Days to advance
          <input type="number" min={1} max={MAX_DAYS} value={days} onChange={event => setDays(event.target.value)} />
        </label>
        <button disabled={!isValidDays(Number(days))} onClick={() => onAdvance(Number(days))}>
          Advance
        </button>
        <button onClick={onStartOver}>Start over</button>
      </footer>
      {item && (
        <div role="tooltip" className="tooltip" style={{ top: inspected.top }}>
          <strong>{item.name}</strong>
          <span>Sell In {item.sellIn}</span>
          <span>Quality {item.quality}</span>
        </div>
      )}
    </section>
  );
}
