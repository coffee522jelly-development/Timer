<script lang="ts">
  import { onMount } from "svelte";

  let {
    value = $bindable(0),
    min = 0,
    max = 60,
    step = 1,
    size = 240, // Doubled from 120
    displayValue = undefined,
    displayLabel = "MIN"
  } = $props();

  let knobElement: HTMLDivElement;
  let isDragging = $state(false);
  let previousAngle = 0;
  let currentValueExact = $state(value);

  // Sync internal exact value when prop changes externally (e.g. mode toggle)
  $effect(() => {
    if (!isDragging && value !== Math.round(currentValueExact / step) * step) {
      currentValueExact = value;
    }
  });

  let currentAngle = $derived(((value - min) / (max - min || 1)) * 270 - 135);

  function getAngle(x: number, y: number, rect: DOMRect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }

  function handlePointerDown(e: PointerEvent) {
    isDragging = true;
    knobElement.setPointerCapture(e.pointerId);
    const rect = knobElement.getBoundingClientRect();
    previousAngle = getAngle(e.clientX, e.clientY, rect);
    currentValueExact = value;
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    const rect = knobElement.getBoundingClientRect();
    let angle = getAngle(e.clientX, e.clientY, rect);

    // Calculate difference from last position
    let diff = angle - previousAngle;

    // Normalize diff to avoid jumps when crossing 180 / -180 boundary
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    // Adjust sensitivity
    const angleRange = 270;
    const valueRange = max - min;
    const valueDiff = (diff / angleRange) * valueRange;

    currentValueExact += valueDiff;

    if (currentValueExact < min) currentValueExact = min;
    if (currentValueExact > max) currentValueExact = max;

    let newValue = Math.round(currentValueExact / step) * step;
    value = newValue;

    previousAngle = angle;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;
    knobElement.releasePointerCapture(e.pointerId);
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    let newValue = value + (e.deltaY > 0 ? -step : step);
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    value = newValue;
    currentValueExact = newValue;
  }
</script>

<div class="flex flex-col items-center select-none" style="width: {size}px;">
  <!-- Premium Retro Knob -->
  <div
    bind:this={knobElement}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    onwheel={handleWheel}
    role="slider"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    tabindex="0"
    class="relative rounded-full cursor-pointer touch-none flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.6),inset_0_4px_10px_rgba(255,255,255,0.08),inset_0_-4px_10px_rgba(0,0,0,0.4)] bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/50"
    style="width: {size}px; height: {size}px;"
  >
    <!-- Metallic texture overlay -->
    <div class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700/30 via-transparent to-transparent opacity-60 pointer-events-none"></div>

    <!-- Outer grip ring -->
    <div class="absolute inset-[3px] rounded-full border border-zinc-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] [background:repeating-conic-gradient(from_0deg,#27272a_0deg_1deg,#18181b_1deg_2deg)] opacity-80 pointer-events-none"></div>

    <!-- Inner metallic cap -->
    <div class="absolute inset-[18%] rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 shadow-[0_4px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center pointer-events-none">
        <!-- Spindle / Center dot -->
        <div class="w-1/5 h-1/5 rounded-full bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] border border-zinc-700/30"></div>
    </div>

    <!-- Indicator line -->
    <div
      class="absolute w-full h-full pointer-events-none transition-transform duration-75 ease-out"
      style="transform: rotate({currentAngle}deg);"
    >
      <div class="absolute top-[9%] left-1/2 -translate-x-1/2 w-[4px] h-[18%] bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.7)] z-10"></div>
      <div class="absolute top-[9%] left-1/2 -translate-x-1/2 w-[4px] h-[18%] bg-amber-400 rounded-full blur-[2px] opacity-70 z-0"></div>
    </div>
  </div>

  <div class="mt-6 flex flex-col items-center">
    <div class="font-mono text-3xl font-medium tracking-widest text-zinc-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
      {displayValue ?? value}
    </div>
    <div class="text-xs font-bold tracking-widest text-zinc-500 mt-1 uppercase">
      {displayLabel}
    </div>
  </div>
</div>
