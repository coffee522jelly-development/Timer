export class Timer {
  initialMinutes = $state(25);
  timeRemaining = $state(25 * 60);
  isRunning = $state(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onComplete: (() => void) | null = null;

  constructor(onComplete?: () => void) {
    if (onComplete) {
      this.onComplete = onComplete;
    }
  }

  get minutes() {
    return Math.floor(this.timeRemaining / 60);
  }

  get seconds() {
    return this.timeRemaining % 60;
  }

  get formattedTime() {
    const m = this.minutes.toString().padStart(3, '0');
    const s = this.seconds.toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  setMinutes(m: number) {
    if (this.isRunning) {
      this.pause();
    }
    this.initialMinutes = m;
    this.timeRemaining = m * 60;
  }

  start() {
    if (this.isRunning || this.timeRemaining <= 0) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stop() {
    this.pause();
    this.timeRemaining = this.initialMinutes * 60;
  }

  reset() {
    this.stop();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }
}
