import { useState, type KeyboardEvent } from 'react';
import type { Item } from '../../app/gilded-rose';
import { advanceDays, eventTicketBecameWorthless, startingStock, subjectOf } from './inn';
import { Inventory } from './Inventory';
import { chooseLine, type Line, type Moment } from './lines';
import type { Sound } from './sound';

export function App({ sound, random = Math.random }: { sound: Sound; random?: () => number }) {
  const [line, setLine] = useState<Line | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [items, setItems] = useState(startingStock);
  const [previousItems, setPreviousItems] = useState<Item[] | null>(null);
  const [day, setDay] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showingName, setShowingName] = useState(false);

  const say = (moment: Moment) => {
    const spoken = chooseLine(moment, line?.id, random);
    setLine(spoken);
    sound.speak(spoken.id);
  };

  const enter = () => {
    sound.startMusic();
    say('greeting');
  };

  const talkToAllison = () => {
    setInventoryOpen(true);
    say('click');
  };

  const advance = (days: number) => {
    const aged = advanceDays(items, days);
    setPreviousItems(items);
    setItems(aged);
    setDay(day + days);
    say(eventTicketBecameWorthless(items, aged) ? 'worthless' : 'advance');
  };

  const startOver = () => {
    setItems(startingStock());
    setPreviousItems(null);
    setDay(0);
  };

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setInventoryOpen(false);
  };

  const toggleMuted = () => {
    sound.setMuted(!muted);
    setMuted(!muted);
  };

  if (!line) {
    return (
      <main className="inn">
        <div className="stage" />
        <div className="entry">
          <h1>The Gilded Rose</h1>
          <button className="enter" onClick={enter}>
            Enter the inn
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="inn" tabIndex={-1} onKeyDown={closeOnEscape}>
      <div className="stage">
        <button
          className="allison"
          aria-label="Talk to Innkeeper Allison"
          onClick={talkToAllison}
          onMouseEnter={() => setShowingName(true)}
          onMouseLeave={() => setShowingName(false)}
          onFocus={() => setShowingName(true)}
          onBlur={() => setShowingName(false)}
        />
        {showingName && <span className="nameplate">Innkeeper Allison</span>}
        <p role="status" className="bubble">
          {line.text}
        </p>
      </div>
      <button className="mute" onClick={toggleMuted}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
      {inventoryOpen && (
        <Inventory
          items={items}
          previousItems={previousItems}
          day={day}
          onAskAbout={item => say(subjectOf(item.name))}
          onAdvance={advance}
          onStartOver={startOver}
          onClose={() => setInventoryOpen(false)}
        />
      )}
    </main>
  );
}
