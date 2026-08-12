<script lang="ts">
  import { Timer } from "$lib/timer.svelte.ts";
  import RotaryKnob from "$lib/components/RotaryKnob.svelte";
  import TimerPresets from "$lib/components/TimerPresets.svelte";
  import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

  const timer = new Timer(async () => {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        sendNotification({ title: 'Timer Complete', body: 'Your time is up!' });
      }
    } catch (e) {
      console.warn("Notification error (maybe not in Tauri env):", e);
    }
  });

  // Keep knob and timer in sync when stopped
  let knobValue = $state(25);

  $effect(() => {
    if (!timer.isRunning && knobValue !== timer.initialMinutes) {
      timer.setMinutes(knobValue);
    }
  });

  function handlePresetSelect(minutes: number) {
    knobValue = minutes;
    timer.setMinutes(minutes);
  }
</script>

<main class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 font-sans selection:bg-amber-500/30">

  <div class="relative w-full max-w-md bg-zinc-900 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.05)] border border-zinc-800">

    <!-- Metallic top plate -->
    <div class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-zinc-800/50 to-transparent rounded-t-3xl pointer-events-none"></div>

    <!-- Panel Label -->
    <div class="text-center mb-8">
      <h1 class="text-xs tracking-[0.3em] font-bold text-zinc-500 uppercase">Analog Audio Timer</h1>
      <div class="h-px w-24 bg-zinc-800 mx-auto mt-2"></div>
    </div>

    <!-- Digital Display -->
    <div class="flex justify-center mb-10">
      <div class="relative bg-zinc-950 px-8 py-4 rounded-xl border-2 border-zinc-900 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)]">
        <!-- Glass reflection -->
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-xl pointer-events-none"></div>
        <div class="font-mono text-6xl tracking-wider text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] font-bold tabular-nums">
          {timer.formattedTime}
        </div>
      </div>
    </div>

    <!-- Controls Area -->
    <div class="flex flex-col items-center gap-10 relative z-10">

      <!-- Main Rotary Knob -->
      <RotaryKnob bind:value={knobValue} min={1} max={90} step={1} />

      <!-- Preset Buttons -->
      <TimerPresets onSelect={handlePresetSelect} />

      <!-- Transport Controls -->
      <div class="flex gap-6 mt-2">
        <!-- Start/Pause Button -->
        <button
          onclick={() => timer.toggle()}
          class="relative w-16 h-16 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)] active:from-zinc-800 active:to-zinc-950 flex items-center justify-center group transition-all duration-100"
        >
          <div class="absolute top-2 w-2 h-2 rounded-full {timer.isRunning ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-zinc-800'} transition-colors duration-300"></div>
          <span class="mt-2 text-xs font-bold tracking-wider text-zinc-400 group-active:text-zinc-500">
            {timer.isRunning ? 'PAUSE' : 'PLAY'}
          </span>
        </button>

        <!-- Reset Button -->
        <button
          onclick={() => timer.reset()}
          class="relative w-16 h-16 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)] active:from-zinc-800 active:to-zinc-950 flex items-center justify-center group transition-all duration-100"
        >
          <span class="text-xs font-bold tracking-wider text-zinc-400 group-active:text-zinc-500">RESET</span>
        </button>
      </div>

    </div>
  </div>
</main>
