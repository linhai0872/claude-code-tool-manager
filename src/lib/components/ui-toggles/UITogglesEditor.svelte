<script lang="ts">
	import type { ClaudeSettings } from '$lib/types';
	import { UI_TOGGLE_FIELDS } from '$lib/types';
	import { Save } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getUiToggleDescription, getUiToggleLabel } from '$lib/utils/claudeSettingsOptionsI18n';

	type Props = {
		settings: ClaudeSettings;
		onsave: (settings: ClaudeSettings) => void;
	};

	let { settings, onsave }: Props = $props();

	type ToggleKey = (typeof UI_TOGGLE_FIELDS)[number]['key'];

	let values = $state<Record<ToggleKey, boolean | undefined>>({
		showTurnDuration: settings.showTurnDuration,
		spinnerTipsEnabled: settings.spinnerTipsEnabled,
		terminalProgressBarEnabled: settings.terminalProgressBarEnabled,
		prefersReducedMotion: settings.prefersReducedMotion,
		respectGitignore: settings.respectGitignore
	});

	$effect(() => {
		values = {
			showTurnDuration: settings.showTurnDuration,
			spinnerTipsEnabled: settings.spinnerTipsEnabled,
			terminalProgressBarEnabled: settings.terminalProgressBarEnabled,
			prefersReducedMotion: settings.prefersReducedMotion,
			respectGitignore: settings.respectGitignore
		};
	});

	function handleToggle(key: ToggleKey) {
		const current = values[key];
		values[key] = current === undefined ? true : current ? false : undefined;
	}

	function getTriStateLabel(value: boolean | undefined): string {
		if (value === undefined) return m.label_not_set();
		return value ? m.label_enabled() : m.label_disabled();
	}

	function getTriStateColor(value: boolean | undefined): string {
		if (value === undefined) return 'bg-gray-200 dark:bg-gray-600';
		return value ? 'bg-primary-600' : 'bg-red-400 dark:bg-red-600';
	}

	function getTriStatePosition(value: boolean | undefined): string {
		if (value === undefined) return 'translate-x-1';
		return value ? 'translate-x-6' : 'translate-x-3.5';
	}

	function handleSave() {
		onsave({
			...settings,
			showTurnDuration: values.showTurnDuration,
			spinnerTipsEnabled: values.spinnerTipsEnabled,
			terminalProgressBarEnabled: values.terminalProgressBarEnabled,
			prefersReducedMotion: values.prefersReducedMotion,
			respectGitignore: values.respectGitignore
		});
	}
</script>

<div class="space-y-6">
	<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
		<h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">{m.ui_toggles_title()}</h3>
		<p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
			{m.ui_toggles_desc()}
		</p>

		<div class="space-y-4">
			{#each UI_TOGGLE_FIELDS as field}
				{@const value = values[field.key]}
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
							{getUiToggleLabel(field.key)}
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							{getUiToggleDescription(field.key)}
							<span class="text-gray-400 dark:text-gray-500">({m.ui_toggles_default_state({ state: field.defaultValue ? m.label_enabled() : m.label_disabled() })})</span>
						</p>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs text-gray-500 dark:text-gray-400 min-w-[60px] text-right">
							{getTriStateLabel(value)}
						</span>
						<button
							onclick={() => handleToggle(field.key)}
							class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {getTriStateColor(value)}"
							title={m.label_tristate_cycle_hint()}
						>
							<span
								class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {getTriStatePosition(value)}"
							></span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex justify-end">
		<button onclick={handleSave} class="btn btn-primary">
			<Save class="w-4 h-4 mr-2" />
			{m.ui_toggles_save()}
		</button>
	</div>
</div>
