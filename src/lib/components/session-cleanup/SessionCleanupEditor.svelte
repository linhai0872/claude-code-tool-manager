<script lang="ts">
	import type { ClaudeSettings } from '$lib/types';
	import { AUTO_UPDATES_CHANNELS, TEAMMATE_MODES } from '$lib/types';
	import { Save } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getAutoUpdatesChannelLabel, getTeammateModeLabel } from '$lib/utils/claudeSettingsOptionsI18n';

	type Props = {
		settings: ClaudeSettings;
		onsave: (settings: ClaudeSettings) => void;
	};

	let { settings, onsave }: Props = $props();

	let cleanupPeriodDays = $state<string>(
		settings.cleanupPeriodDays !== undefined ? String(settings.cleanupPeriodDays) : ''
	);
	let autoUpdatesChannel = $state(settings.autoUpdatesChannel ?? '');
	let teammateMode = $state(settings.teammateMode ?? '');
	let plansDirectory = $state(settings.plansDirectory ?? '');

	$effect(() => {
		cleanupPeriodDays =
			settings.cleanupPeriodDays !== undefined ? String(settings.cleanupPeriodDays) : '';
		autoUpdatesChannel = settings.autoUpdatesChannel ?? '';
		teammateMode = settings.teammateMode ?? '';
		plansDirectory = settings.plansDirectory ?? '';
	});

	function handleSave() {
		const days = cleanupPeriodDays.trim();
		const parsedDays = days !== '' ? parseInt(days, 10) : undefined;

		onsave({
			...settings,
			cleanupPeriodDays: parsedDays !== undefined && !isNaN(parsedDays) ? parsedDays : undefined,
			autoUpdatesChannel: autoUpdatesChannel || undefined,
			teammateMode: teammateMode || undefined,
			plansDirectory: plansDirectory.trim() || undefined
		});
	}
</script>

<div class="space-y-6">
	<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
		<h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">{m.settings_session_title()}</h3>
		<p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
			{m.settings_session_desc()}
		</p>

		<div class="space-y-4">
			<div>
				<label for="cleanup-days" class="text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.settings_session_cleanup_label()}
				</label>
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
					{m.settings_session_cleanup_desc()}
				</p>
				<input
					id="cleanup-days"
					type="number"
					bind:value={cleanupPeriodDays}
					placeholder={m.placeholder_cleanup_days()}
					min="1"
					class="input w-full"
				/>
			</div>

			<div>
				<label for="updates-channel" class="text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.settings_session_updates_label()}
				</label>
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
					{m.settings_session_updates_desc()}
				</p>
				<select id="updates-channel" bind:value={autoUpdatesChannel} class="input w-full">
					{#each AUTO_UPDATES_CHANNELS as channel}
						<option value={channel.value}>{getAutoUpdatesChannelLabel(channel.value)}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="teammate-mode" class="text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.settings_session_teammate_label()}
				</label>
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
					{m.settings_session_teammate_desc()}
				</p>
				<select id="teammate-mode" bind:value={teammateMode} class="input w-full">
					{#each TEAMMATE_MODES as mode}
						<option value={mode.value}>{getTeammateModeLabel(mode.value)}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="plans-dir" class="text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.settings_session_plans_label()}
				</label>
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
					{m.settings_session_plans_desc()}
				</p>
				<input
					id="plans-dir"
					type="text"
					bind:value={plansDirectory}
					placeholder={m.placeholder_plans_directory()}
					class="input w-full"
				/>
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		<button onclick={handleSave} class="btn btn-primary">
			<Save class="w-4 h-4 mr-2" />
			{m.settings_session_save_btn()}
		</button>
	</div>
</div>
