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
  let isPresetMode = $state(false);
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

<main class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 font-sans selection:bg-amber-500/30 theme-{presetManager.accentColor}">

  <div class="relative w-full max-w-lg bg-zinc-900 rounded-3xl p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.05)] border border-zinc-800">

    <!-- Metallic top plate -->
    <div class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-zinc-800/50 to-transparent rounded-t-3xl pointer-events-none"></div>

    <!-- Corner Screws -->
    <div class="absolute top-5 left-5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)] border border-zinc-900 flex items-center justify-center pointer-events-none"><div class="w-2 h-0.5 bg-zinc-900/50 rotate-45"></div></div>
    <div class="absolute top-5 right-5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)] border border-zinc-900 flex items-center justify-center pointer-events-none"><div class="w-2 h-0.5 bg-zinc-900/50 -rotate-12"></div></div>
    <div class="absolute bottom-5 left-5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)] border border-zinc-900 flex items-center justify-center pointer-events-none"><div class="w-2 h-0.5 bg-zinc-900/50 rotate-12"></div></div>
    <div class="absolute bottom-5 right-5 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)] border border-zinc-900 flex items-center justify-center pointer-events-none"><div class="w-2 h-0.5 bg-zinc-900/50 -rotate-45"></div></div>

    <!-- Panel Header -->
    <div class="flex justify-between items-start mb-8 relative z-10">
      <div>
        <h1 class="text-xs tracking-[0.3em] font-bold text-zinc-500 uppercase">STEEP TIMER</h1>
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

    <!-- Digital Display (VFD Style) -->
    <div class="flex justify-center mb-10">
      <div class="relative w-full max-w-sm bg-zinc-950 px-8 py-6 rounded-2xl border-[3px] border-zinc-900 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_8px_25px_rgba(0,0,0,0.9),inset_0_-2px_10px_rgba(255,255,255,0.05)] overflow-hidden">
        <!-- VFD Scanline effect -->
        <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 mix-blend-overlay opacity-30"></div>
        <!-- Inner glass reflection -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20 rounded-xl"></div>

        <div class="relative z-10 flex flex-col items-center justify-center gap-3">
          <!-- Text Info Row (Preset or Manual info) -->
          <div class="w-full flex justify-between items-center px-2">
            <span class="font-mono text-sm tracking-[0.2em] font-bold text-[var(--color-accent-custom)]/80 drop-shadow-[0_0_4px_var(--color-accent-custom-glow)]">
              {#if isPresetMode && presetManager.presets.length > 0}
                {presetManager.presets[presetIndex]?.name || "N/A"}
              {:else}
                MANUAL
              {/if}
            </span>
            <div class="flex gap-2">
              <span class="font-mono text-[10px] tracking-widest {timer.isRunning ? 'text-[var(--color-accent-custom)] drop-shadow-[0_0_4px_var(--color-accent-custom-glow)]' : 'text-zinc-700'} transition-colors duration-300">► PLAY</span>
            </div>
          </div>

          <!-- Timer Row -->
          <div class="text-7xl tracking-wider text-[var(--color-accent-custom)] drop-shadow-[0_0_8px_var(--color-accent-custom-glow)] tabular-nums" style="font-family: '{presetManager.timerFont}', monospace;">
            {timer.formattedTime}
          </div>

          <!-- Bottom Info Row -->
          <div class="w-full flex justify-end px-2">
             <span class="font-mono text-xs tracking-widest text-[var(--color-accent-custom)]/60">
              {#if isPresetMode && presetManager.presets.length > 0}
                {presetManager.presets[presetIndex]?.minutes || 0} MIN PRESET
              {:else}
                {normalMinutes} MINUTES
              {/if}
             </span>
          </div>
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
          disabled={timer.isRunning}
        />
      {:else}
        <RotaryKnob
          bind:value={normalMinutes}
          min={0}
          max={120}
          step={1}
          disabled={timer.isRunning}
          visualValue={timer.isRunning ? timer.timeRemaining / 60 : undefined}
        />
      {/if}

      <!-- Bottom Button Row -->
      <div class="flex items-end justify-center gap-6 w-full pb-4">

        <!-- Mode Toggle -->
        <div class="flex flex-col items-center gap-3">
          <span class="text-[11px] font-bold tracking-wider text-zinc-400 uppercase {timer.isRunning ? 'opacity-50' : ''}">MODE</span>
          <button
            aria-label="Toggle Preset Mode"
            onclick={() => isPresetMode = !isPresetMode}
            disabled={timer.isRunning}
            class="relative w-20 h-14 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-900 border-x border-t border-zinc-600 border-b-[8px] border-b-zinc-950 shadow-[0_8px_15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] active:border-b-0 active:translate-y-[8px] active:shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:pointer-events-none transition-all duration-75"
          >
          </button>
        </div>

        <!-- Theme Toggle -->
        <div class="flex flex-col items-center gap-3">
          <span class="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">THEME</span>
          <button
            aria-label="Toggle Dark/Light Mode"
            onclick={() => {
              const html = document.documentElement;
              if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
              } else {
                html.classList.remove('light');
                html.classList.add('dark');
              }
            }}
            class="relative w-20 h-14 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-900 border-x border-t border-zinc-600 border-b-[8px] border-b-zinc-950 shadow-[0_8px_15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] active:border-b-0 active:translate-y-[8px] active:shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-75"
          >
          </button>
        </div>

        <!-- Play/Pause Button -->
        <div class="flex flex-col items-center gap-3">
          <span class="text-[11px] font-bold tracking-wider text-zinc-300 uppercase">
            {timer.isRunning ? 'PAUSE' : 'PLAY'}
          </span>
          <button
            aria-label="Play or Pause"
            onclick={() => timer.toggle()}
            class="relative w-20 h-14 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-900 border-x border-t border-zinc-500 border-b-[8px] border-b-zinc-950 shadow-[0_8px_15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] active:border-b-0 active:translate-y-[8px] active:shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-75"
          >
          </button>
        </div>

        <!-- Reset Button -->
        <div class="flex flex-col items-center gap-3">
          <span class="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">RESET</span>
          <button
            aria-label="Reset Timer"
            onclick={() => timer.reset()}
            class="relative w-20 h-14 rounded-md bg-gradient-to-b from-zinc-700 to-zinc-900 border-x border-t border-zinc-600 border-b-[8px] border-b-zinc-950 shadow-[0_8px_15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] active:border-b-0 active:translate-y-[8px] active:shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-75"
          >
          </button>
        </div>

      </div>
    </div>
  </div>
</main>

{#if showSettings}
  <Settings manager={presetManager} onClose={() => showSettings = false} />
{/if}
