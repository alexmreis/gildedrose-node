import type { Sound } from './sound';

const MUSIC_VOLUME = 0.3;

export class BrowserSound implements Sound {
  private readonly music = new Audio('/audio/music.wav');
  private voice: HTMLAudioElement | null = null;
  private muted = false;

  constructor() {
    this.music.loop = true;
    this.music.volume = MUSIC_VOLUME;
  }

  startMusic() {
    void this.music.play();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.music.muted = muted;
    if (this.voice) this.voice.muted = muted;
  }

  speak(lineId: string) {
    this.voice?.pause();
    this.voice = new Audio(`/audio/${lineId}.wav`);
    this.voice.muted = this.muted;
    void this.voice.play();
  }
}
