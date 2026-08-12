<script lang="ts">
  import { Timer } from "$lib/timer.svelte";
  import RotaryKnob from "$lib/components/RotaryKnob.svelte";
  import Settings from "$lib/components/Settings.svelte";
  import { PresetManager } from "$lib/presets.svelte";
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

  const presetManager = new PresetManager();

  // Modes
  let isPresetMode = $state(true);
  let showSettings = $state(false);

  // State for normal mode
  let normalMinutes = $state(25);

  // State for preset mode
  let presetIndex = $state(1); // Default to POMODORO if it exists

  $effect(() => {
    if (!timer.isRunning) {
      if (isPresetMode) {
        if (presetManager.presets.length > 0) {
          // Clamp index if presets were deleted
          if (presetIndex >= presetManager.presets.length) {
            presetIndex = presetManager.presets.length - 1;
          }
          const activePreset = presetManager.presets[presetIndex];
          if (timer.initialMinutes !== activePreset.minutes) {
             timer.setMinutes(activePreset.minutes);
          }
        }
      } else {
        if (timer.initialMinutes !== normalMinutes) {
          timer.setMinutes(normalMinutes);
        }
      }
    }
  });

</script>

<main class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 font-sans selection:bg-amber-500/30">

  <div class="relative w-full max-w-lg bg-zinc-900 rounded-3xl p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.05)] border border-zinc-800">

    <!-- Metallic top plate -->
    <div class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-zinc-800/50 to-transparent rounded-t-3xl pointer-events-none"></div>

    <!-- Panel Header -->
    <div class="flex justify-between items-start mb-8 relative z-10">
      <div>
        <h1 class="text-xs tracking-[0.3em] font-bold text-zinc-500 uppercase">Analog Audio Timer</h1>
        <div class="h-px w-16 bg-zinc-700 mt-2"></div>
      </div>

      <!-- Settings Button -->
      <button
        aria-label="Settings"
        onclick={() => showSettings = true}
        class="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 shadow-[0_2px_5px_rgba(0,0,0,0.5)] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </button>
    </div>

    <!-- Digital Display -->
    <div class="flex justify-center mb-10">
      <div class="relative bg-zinc-950 px-10 py-5 rounded-2xl border-2 border-zinc-900 shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)]">
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-2xl pointer-events-none"></div>
        <div class="font-mono text-7xl tracking-wider text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] font-bold tabular-nums">
          {timer.formattedTime}
        </div>
      </div>
    </div>

    <!-- Controls Area -->
    <div class="flex flex-col items-center gap-12 relative z-10">

      <!-- Main Rotary Knob -->
      {#if isPresetMode && presetManager.presets.length > 0}
        <RotaryKnob
          bind:value={presetIndex}
          min={0}
          max={presetManager.presets.length - 1}
          step={1}
          displayValue={presetManager.presets[presetIndex]?.name || "N/A"}
          displayLabel="{presetManager.presets[presetIndex]?.minutes || 0} MIN PRESET"
        />
      {:else}
        <RotaryKnob
          bind:value={normalMinutes}
          min={1}
          max={120}
          step={1}
          displayValue={normalMinutes}
          displayLabel="MINUTES"
        />
      {/if}

      <!-- Bottom Button Row -->
      <div class="flex items-center justify-center gap-6 w-full">

        <!-- Mode Toggle -->
        <button
          aria-label="Toggle Preset Mode"
          onclick={() => isPresetMode = !isPresetMode}
          class="relative w-16 h-16 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)] active:from-zinc-800 active:to-zinc-950 flex flex-col items-center justify-center group transition-all duration-100"
        >
          <div class="absolute top-2 flex gap-1">
            <div class="w-1.5 h-1.5 rounded-full {isPresetMode ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'bg-zinc-800'} transition-colors duration-300"></div>
            <div class="w-1.5 h-1.5 rounded-full {!isPresetMode ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'bg-zinc-800'} transition-colors duration-300"></div>
          </div>
          <span class="mt-2 text-[10px] font-bold tracking-wider text-zinc-400 group-active:text-zinc-500 uppercase">MODE</span>
        </button>

        <!-- Play/Pause Button (Larger) -->
        <button
          aria-label="Play or Pause"
          onclick={() => timer.toggle()}
          class="relative w-20 h-20 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-500 shadow-[0_8px_15px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] active:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)] active:from-zinc-800 active:to-zinc-950 flex items-center justify-center group transition-all duration-100"
        >
          <div class="absolute top-3 w-3 h-3 rounded-full {timer.isRunning ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-zinc-800'} transition-colors duration-300"></div>
          <span class="mt-2 text-sm font-bold tracking-wider text-zinc-300 group-active:text-zinc-500">
            {timer.isRunning ? 'PAUSE' : 'PLAY'}
          </span>
        </button>

        <!-- Reset Button -->
        <button
          aria-label="Reset Timer"
          onclick={() => timer.reset()}
          class="relative w-16 h-16 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)] active:from-zinc-800 active:to-zinc-950 flex items-center justify-center group transition-all duration-100"
        >
          <span class="text-[10px] font-bold tracking-wider text-zinc-400 group-active:text-zinc-500 uppercase">RESET</span>
        </button>

      </div>
    </div>
  </div>
</main>

{#if showSettings}
  <Settings manager={presetManager} onClose={() => showSettings = false} />
{/if}
