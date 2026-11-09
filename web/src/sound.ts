export interface Sound {
  startMusic(): void;
  setMuted(muted: boolean): void;
  speak(lineId: string): void;
}
