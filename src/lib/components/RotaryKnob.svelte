<script lang="ts">
  import { onMount } from "svelte";

  let {
    value = $bindable(0),
    min = 0,
    max = 60,
    step = 1,
    size = 240, // Doubled from 120
    disabled = false,
    visualValue = undefined
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

  let effectiveValue = $derived(visualValue !== undefined ? visualValue : value);
  let currentAngle = $derived(((effectiveValue - min) / (max - min || 1)) * 270 - 135);

  function getAngle(x: number, y: number, rect: DOMRect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }

  function handlePointerDown(e: PointerEvent) {
    if (disabled) return;
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
    if (disabled) return;
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
    class="relative rounded-full cursor-pointer touch-none flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.6),inset_0_4px_10px_rgba(255,255,255,0.15),inset_0_-8px_15px_rgba(0,0,0,0.6)] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 border-[2px] border-zinc-600/60 ring-1 ring-black/50"
    style="width: {size}px; height: {size}px;"
  >
    <!-- Metallic texture overlay for heavy feel -->
    <div class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-400/20 via-zinc-800/40 to-black/80 opacity-90 pointer-events-none mix-blend-overlay"></div>

    <!-- Outer grip ring (Knurling effect) -->
    <div class="absolute inset-[4px] rounded-full border border-zinc-950 shadow-[inset_0_0_25px_rgba(0,0,0,1)] [background:repeating-conic-gradient(from_0deg,#18181b_0deg_1deg,#09090b_1deg_2deg)] opacity-95 pointer-events-none"></div>

    <!-- Outer metallic bezel highlight -->
    <div class="absolute inset-[4px] rounded-full border border-t-zinc-500/40 border-b-black/80 border-x-transparent pointer-events-none"></div>

    <!-- Inner heavy metallic cap -->
    <div class="absolute inset-[20%] rounded-full bg-gradient-to-br from-zinc-600 via-zinc-800 to-zinc-950 shadow-[0_8px_25px_rgba(0,0,0,0.9),inset_0_3px_8px_rgba(255,255,255,0.2),inset_0_-4px_10px_rgba(0,0,0,0.7)] flex items-center justify-center pointer-events-none border-[1.5px] border-zinc-800">
        <!-- Spindle / Center dot - Dark metal indent -->
        <div class="w-1/4 h-1/4 rounded-full bg-gradient-to-b from-zinc-950 to-black shadow-[inset_0_4px_8px_rgba(0,0,0,1),0_1px_2px_rgba(255,255,255,0.1)] border border-zinc-900"></div>
    </div>

    <!-- Indicator line -->
    <div
      class="absolute w-full h-full pointer-events-none transition-transform duration-75 ease-out"
      style="transform: rotate({currentAngle}deg);"
    >
      <div class="absolute top-[9%] left-1/2 -translate-x-1/2 w-[4px] h-[18%] bg-[var(--color-accent-custom)] rounded-full shadow-[0_0_8px_var(--color-accent-custom-glow)] z-10"></div>
      <div class="absolute top-[9%] left-1/2 -translate-x-1/2 w-[4px] h-[18%] bg-[var(--color-accent-custom)] rounded-full blur-[2px] opacity-70 z-0"></div>
    </div>
  </div>
</div>
