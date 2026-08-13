<script lang="ts">
  import type { PresetManager, Preset } from "$lib/presets.svelte";

  let { manager, onClose } = $props<{
    manager: PresetManager;
    onClose: () => void;
  }>();

  let editingId = $state<string | null>(null);
  let editName = $state("");
  let editMinutes = $state(1);

  function startEdit(preset: Preset) {
    editingId = preset.id;
    editName = preset.name;
    editMinutes = preset.minutes;
  }

  function startAdd() {
    editingId = "new";
    editName = "NEW";
    editMinutes = 25;
  }

  async function saveEdit() {
    if (editingId === "new") {
      await manager.addPreset(editName, editMinutes);
    } else if (editingId) {
      await manager.updatePreset(editingId, editName, editMinutes);
    }
    editingId = null;
  }

  function cancelEdit() {
    editingId = null;
  }
</script>

<div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
  <div class="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
    <div class="flex justify-between items-center p-6 border-b border-zinc-800">
      <h2 class="text-lg font-bold text-zinc-300 tracking-widest uppercase">Settings</h2>
      <button aria-label="Close settings" onclick={onClose} class="text-zinc-500 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-8">

      <!-- Color Theme Setup -->
      <section>
        <h3 class="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Accent Color</h3>
        <div class="flex gap-4">
          <button aria-label="Amber" onclick={() => manager.setAccentColor("amber")} class="w-8 h-8 rounded-full bg-amber-500 {manager.accentColor === 'amber' ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-amber-500' : 'opacity-50 hover:opacity-100'} transition-all"></button>
          <button aria-label="Green" onclick={() => manager.setAccentColor("green")} class="w-8 h-8 rounded-full bg-emerald-500 {manager.accentColor === 'green' ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-emerald-500' : 'opacity-50 hover:opacity-100'} transition-all"></button>
          <button aria-label="Blue" onclick={() => manager.setAccentColor("blue")} class="w-8 h-8 rounded-full bg-blue-500 {manager.accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-blue-500' : 'opacity-50 hover:opacity-100'} transition-all"></button>
          <button aria-label="Rose" onclick={() => manager.setAccentColor("rose")} class="w-8 h-8 rounded-full bg-rose-500 {manager.accentColor === 'rose' ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-rose-500' : 'opacity-50 hover:opacity-100'} transition-all"></button>
          <button aria-label="Purple" onclick={() => manager.setAccentColor("purple")} class="w-8 h-8 rounded-full bg-purple-500 {manager.accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-purple-500' : 'opacity-50 hover:opacity-100'} transition-all"></button>
        </div>
      </section>

      <!-- Font Setup -->
      <section>
        <h3 class="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Timer Font</h3>
        <select
          value={manager.timerFont}
          onchange={(e) => manager.setTimerFont(e.currentTarget.value as any)}
          class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-3 text-zinc-300 focus:outline-none focus:border-[var(--color-accent-custom)] transition-colors"
          style="font-family: {manager.timerFont}, monospace;"
        >
          <option value="ui-monospace">System Monospace</option>
          <option value="VT323">VT323</option>
          <option value="Orbitron">Orbitron</option>
          <option value="Share Tech Mono">Share Tech Mono</option>
          <option value="DotGothic16">DotGothic16</option>
          <option value="Nova Mono">Nova Mono</option>
          <option value="Audiowide">Audiowide</option>
          <option value="Chakra Petch">Chakra Petch</option>
          <option value="Bebas Neue">Bebas Neue</option>
          <option value="Fira Code">Fira Code</option>
        </select>
      </section>

      <!-- Presets Setup -->
      <section>
        <h3 class="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Presets Setup</h3>
      {#if editingId}
        <div class="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <div>
            <label class="block text-xs font-bold text-zinc-500 mb-1" for="editName"><span class="sr-only">NAME</span>NAME</label>
            <input id="editName"
              bind:value={editName}
              class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-[var(--color-accent-custom)] transition-colors"
              placeholder="e.g. POMODORO"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-zinc-500 mb-1" for="editMinutes"><span class="sr-only">MINUTES</span>MINUTES</label>
            <input id="editName"
              type="number"
              bind:value={editMinutes}
              min="1" max="999"
              class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-[var(--color-accent-custom)] transition-colors"
            />
          </div>
          <div class="flex gap-2 pt-2">
            <button onclick={saveEdit} class="flex-1 bg-[var(--color-accent-custom)] opacity-90 hover:opacity-100 text-black font-bold py-2 rounded-lg transition-colors">
              SAVE
            </button>
            <button onclick={cancelEdit} class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded-lg transition-colors">
              CANCEL
            </button>
          </div>
        </div>
      {:else}
        <div class="space-y-3">
          {#each manager.presets as preset}
            <div class="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-xl">
              <div>
                <div class="font-bold text-zinc-300 tracking-wider">{preset.name}</div>
                <div class="text-sm font-mono text-[var(--color-accent-custom)]">{preset.minutes} MIN</div>
              </div>
              <div class="flex gap-2">
                <button aria-label="Edit preset" onclick={() => startEdit(preset)} class="p-2 text-zinc-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                </button>
                <button aria-label="Delete preset" onclick={() => manager.removePreset(preset.id)} class="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          {/each}

          <button
            onclick={startAdd}
            class="w-full border-2 border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 font-bold tracking-widest py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            ADD PRESET
          </button>
        </div>
      {/if}
      </section>
    </div>
  </div>
</div>
