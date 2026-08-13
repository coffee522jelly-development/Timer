import { load } from "@tauri-apps/plugin-store";

export type Preset = {
  id: string;
  name: string;
  minutes: number;
};

const defaultPresets: Preset[] = [
  { id: "1", name: "SHORT", minutes: 15 },
  { id: "2", name: "POMODORO", minutes: 25 },
  { id: "3", name: "LONG", minutes: 30 },
];

export type AccentColor = "amber" | "green" | "blue" | "rose" | "purple";

export type TimerFont = "ui-monospace" | "VT323" | "Orbitron" | "Share Tech Mono" | "DotGothic16" | "Nova Mono" | "Audiowide" | "Chakra Petch" | "Bebas Neue" | "Fira Code";

export class PresetManager {
  presets = $state<Preset[]>([]);
  accentColor = $state<AccentColor>("green"); // Default changed to green per new logo
  timerFont = $state<TimerFont>("ui-monospace");
  private isLoaded = $state(false);

  constructor() {
    this.presets = [...defaultPresets];
    this.init();
  }

  async init() {
    try {
      const store = await load("settings.json", { autoSave: false });
      const saved = await store.get<Preset[]>("presets");
      if (saved && saved.length > 0) {
        this.presets = saved;
      }

      const savedColor = await store.get<AccentColor>("accentColor");
      if (savedColor) {
        this.accentColor = savedColor;
      }

      const savedFont = await store.get<TimerFont>("timerFont");
      if (savedFont) {
        this.timerFont = savedFont;
      }

      this.isLoaded = true;
    } catch (e) {
      console.warn("Could not load settings from store, using defaults", e);
      this.isLoaded = true;
    }
  }

  async save() {
    try {
      const store = await load("settings.json", { autoSave: false });
      await store.set("presets", $state.snapshot(this.presets));
      await store.set("accentColor", this.accentColor);
      await store.set("timerFont", this.timerFont);
      await store.save();
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }

  async setAccentColor(color: AccentColor) {
    this.accentColor = color;
    await this.save();
  }

  async setTimerFont(font: TimerFont) {
    this.timerFont = font;
    await this.save();
  }

  async addPreset(name: string, minutes: number) {
    this.presets.push({
      id: Math.random().toString(36).substring(2, 9),
      name,
      minutes,
    });
    await this.save();
  }

  async updatePreset(id: string, name: string, minutes: number) {
    const idx = this.presets.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.presets[idx].name = name;
      this.presets[idx].minutes = minutes;
      await this.save();
    }
  }

  async removePreset(id: string) {
    this.presets = this.presets.filter((p) => p.id !== id);
    await this.save();
  }
}
