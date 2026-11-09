import { useState } from 'react';
import type { Item } from '../../app/gilded-rose';
import { iconFor } from './inn';

type Inspected = { index: number; top: number };

type Props = {
  items: Item[];
  previousItems: Item[] | null;
  day: number;
  onAskAbout: (item: Item) => void;
  onAdvance: (days: number) => void;
  onStartOver: () => void;
  onClose: () => void;
};

const MAX_DAYS = 30;
const SLOTS = 16;

const isValidDays = (days: number) => Number.isInteger(days) && days >= 1 && days <= MAX_DAYS;

export function Inventory({ items, previousItems, day, onAskAbout, onAdvance, onStartOver, onClose }: Props) {
  const [inspected, setInspected] = useState<Inspected | null>(null);
  const [days, setDays] = useState('1');

  const inspect = (index: number, row: HTMLElement) => {
    const panel = row.closest('[role="dialog"]')!.getBoundingClientRect();
    setInspected({ index, top: row.getBoundingClientRect().top - panel.top });
  };
  const stopInspecting = () => setInspected(null);
  const item = inspected && items[inspected.index];
  const previous = inspected && previousItems?.[inspected.index];

  return (
    <section role="dialog" aria-label="Inventory" className="inventory">
      <header className="inventory-header">
        <h2>Inventory</h2>
        <button className="close" aria-label="Close Inventory" onClick={onClose}>
          ×
        </button>
      </header>
      <ul className="slots">
        {items.map((stocked, index) => {
          const moved = previousItems ? stocked.quality - previousItems[index].quality : 0;
          return (
            <li key={index} className="slot">
              <button
                className="item"
                aria-label={stocked.name}
                onMouseEnter={event => inspect(index, event.currentTarget)}
                onMouseLeave={stopInspecting}
                onFocus={event => inspect(index, event.currentTarget)}
                onBlur={stopInspecting}
                onClick={() => onAskAbout(stocked)}
              >
                <img src={iconFor(stocked.name)} alt="" />
                {moved !== 0 && <span className="moved">{moved > 0 ? `+${moved}` : `−${-moved}`}</span>}
              </button>
            </li>
          );
        })}
        {Array.from({ length: SLOTS - items.length }, (_, index) => (
          <li key={index} className="slot" />
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
          {previous && previous.quality !== item.quality && (
            <span className="tooltip-change">
              Quality {previous.quality} → {item.quality}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
