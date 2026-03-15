<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { claudeSettingsLibrary, projectsStore, notifications } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';
	import type { ClaudeSettings, ClaudeSettingsScope } from '$lib/types';
	import { CustomSelect } from '$lib/components/shared';
	import { RefreshCw, FolderOpen, User, FileText } from 'lucide-svelte';
	import {
		getClaudeSettingsScopeDescription,
		getClaudeSettingsScopeLabel
	} from '$lib/utils/claudeSettingsScopeI18n';

	type Props = {
		getSettingCount: (scope: ClaudeSettingsScope) => number;
		children: Snippet<[{ settings: ClaudeSettings; save: (settings: ClaudeSettings, successMsg: string, errorMsg: string) => Promise<void> }]>;
	};

	let { getSettingCount, children }: Props = $props();

	onMount(async () => {
		await projectsStore.loadProjects();
		await claudeSettingsLibrary.load();
	});

	function handleProjectChange(val: string) {
		claudeSettingsLibrary.setProjectPath(val || null);
		claudeSettingsLibrary.load();
	}

	async function handleRefresh() {
		await claudeSettingsLibrary.load();
		notifications.success(m.notify_refreshed({ entity: m.entity_settings() }));
	}

	async function save(settings: ClaudeSettings, successMsg: string, errorMsg: string) {
		try {
			await claudeSettingsLibrary.save(settings);
			notifications.success(successMsg);
		} catch (err) {
			notifications.error(errorMsg);
		}
	}

	const scopes: { key: ClaudeSettingsScope; icon: typeof User }[] = [
		{ key: 'user', icon: User },
		{ key: 'project', icon: FolderOpen },
		{ key: 'local', icon: FileText }
	];
</script>

<div class="flex flex-wrap items-center gap-4 mb-6">
	<div class="flex items-center gap-2">
		<FolderOpen class="w-4 h-4 text-gray-500 dark:text-gray-400" />
		<CustomSelect
			class="min-w-40"
			value={claudeSettingsLibrary.projectPath ?? ''}
			onchange={handleProjectChange}
			options={[
				{ value: '', label: m.project_none_selected() },
				...projectsStore.projects.map((p) => ({ value: p.path, label: p.name }))
			]}
		/>
	</div>

	<div class="flex-1 min-w-[300px]">
		<div class="flex gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
			{#each scopes as { key, icon }}
				{@const isDisabled = key !== 'user' && !claudeSettingsLibrary.projectPath}
				{@const isActive = claudeSettingsLibrary.selectedScope === key}
				{@const count = getSettingCount(key)}
				<button
					onclick={() => claudeSettingsLibrary.setScope(key)}
					disabled={isDisabled}
					class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1
						{isActive
						? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
						: isDisabled
							? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
							: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
					title={getClaudeSettingsScopeDescription(key)}
				>
					<svelte:component this={icon} class="w-4 h-4" />
					{getClaudeSettingsScopeLabel(key)}
					{#if count > 0}
						<span
							class="ml-1 px-1.5 py-0.5 text-xs rounded-full
								{isActive
							? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
							: 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}"
						>
							{count}
						</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex items-center gap-2">
		<button
			onclick={handleRefresh}
			class="btn btn-ghost"
			title={m.project_refresh_settings()}
		>
			<RefreshCw class="w-4 h-4" />
		</button>
	</div>
</div>

{#if claudeSettingsLibrary.isLoading}
	<div class="flex items-center justify-center py-20">
		<div
			class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
		></div>
	</div>
{:else if claudeSettingsLibrary.error}
	<div
		class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
	>
		{claudeSettingsLibrary.error}
	</div>
{:else if claudeSettingsLibrary.currentScopeSettings}
	{@render children({ settings: claudeSettingsLibrary.currentScopeSettings, save })}
{:else}
	<div class="text-center py-20 text-gray-400 dark:text-gray-500">
		<p>{m.settings_select_scope()}</p>
	</div>
{/if}
