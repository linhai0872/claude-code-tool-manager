<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { PERMISSION_DEFAULT_MODES } from '$lib/types';

	type Props = {
		value: string | undefined;
		onchange: (mode: string | null) => void;
	};

	let { value, onchange }: Props = $props();

	const modeLabels: Record<string, () => string> = {
		'': () => m.permission_mode_not_set(),
		default: () => m.permission_mode_default(),
		allowEdits: () => m.permission_mode_allow_edits(),
		bypassPermissions: () => m.permission_mode_bypass()
	};

	const modeDescriptions: Record<string, () => string> = {
		'': () => m.permission_mode_not_set_desc(),
		default: () => m.permission_mode_default_desc(),
		allowEdits: () => m.permission_mode_allow_edits_desc(),
		bypassPermissions: () => m.permission_mode_bypass_desc()
	};

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		onchange(target.value || null);
	}
</script>

<div class="flex items-center gap-3">
	<label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
		{m.permission_default_mode()}
	</label>
	<select value={value ?? ''} onchange={handleChange} class="input text-sm flex-1 max-w-xs">
		{#each PERMISSION_DEFAULT_MODES as mode}
			<option value={mode.value}>{modeLabels[mode.value]?.() ?? mode.label}</option>
		{/each}
	</select>
	{#if value}
		<span class="text-xs text-gray-500 dark:text-gray-400">
			{modeDescriptions[value]?.() ?? ''}
		</span>
	{/if}
</div>
