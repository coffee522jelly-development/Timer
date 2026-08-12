<script lang="ts">
  let { onSelect } = $props<{
    onSelect: (minutes: number) => void;
  }>();

  const presets = [
    { label: "15m", value: 15, name: "SHORT" },
    { label: "25m", value: 25, name: "POMODORO" },
    { label: "30m", value: 30, name: "LONG" },
  ];
</script>

<div class="flex gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 shadow-inner">
  {#each presets as preset}
    <button
      type="button"
      onclick={() => onSelect(preset.value)}
      class="group relative flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-all duration-100 ease-in-out active:scale-95 bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)] active:from-zinc-800 active:to-zinc-950"
    >
      <span class="text-xs font-bold text-zinc-400 group-hover:text-zinc-300 group-active:text-zinc-500 tracking-wider mb-1">{preset.name}</span>
      <span class="font-mono font-medium text-amber-500/90 group-hover:text-amber-400 group-active:text-amber-600 drop-shadow-[0_0_2px_rgba(245,158,11,0.3)]">{preset.label}</span>

      <!-- Indicator light simulation -->
      <div class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-900 shadow-inner"></div>
    </button>
  {/each}
</div>
