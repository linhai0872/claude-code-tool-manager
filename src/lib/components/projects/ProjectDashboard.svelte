<script lang="ts">
	import type { Project } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { projectsStore, notifications } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { invoke } from '@tauri-apps/api/core';
	import { FolderOpen, ArrowLeft, ChevronDown, RefreshCw, ExternalLink, Wrench, Settings } from 'lucide-svelte';
	import { getEditorDisplayName } from '$lib/utils/editorI18n';
	import ProjectToolsPanel from './ProjectToolsPanel.svelte';
	import ProjectSettingsPanel from './ProjectSettingsPanel.svelte';

	type Props = {
		project: Project;
	};

	let { project: projectProp }: Props = $props();

	let showEditorDropdown = $state(false);
	let updatingEditor = $state(false);

	// Get current project from store (reactive to updates)
	let project = $derived(
		projectsStore.getProjectById(projectProp.id) ?? projectProp
	);

	// Tab and section from URL query params
	let activeTab = $derived<'tools' | 'settings'>(
		($page.url.searchParams.get('tab') as 'tools' | 'settings') ?? 'tools'
	);
	let activeSection = $derived(
		$page.url.searchParams.get('section') ?? 'models'
	);

	// Total tools count
	let toolsCount = $derived(project.assignedMcps.length);

	function switchTab(tab: 'tools' | 'settings', section?: string) {
		let url = `/projects/${project.id}?tab=${tab}`;
		if (tab === 'settings' && section) {
			url += `&section=${section}`;
		}
		goto(url, { replaceState: true });
	}

	function handleSectionChange(section: string) {
		goto(`/projects/${project.id}?tab=settings&section=${section}`, { replaceState: true });
	}

	async function handleChangeEditorType(editorType: 'claude_code' | 'opencode') {
		if (editorType === project.editorType) {
			showEditorDropdown = false;
			return;
		}
		updatingEditor = true;
		try {
			await invoke('update_project_editor_type', { projectId: project.id, editorType });
			await projectsStore.loadProjects();
			notifications.success(m.notify_switched_editor({ name: getEditorDisplayName(editorType) }));
		} catch (err) {
			notifications.error(m.notify_switch_editor_failed());
			console.error(err);
		} finally {
			updatingEditor = false;
			showEditorDropdown = false;
		}
	}

	async function handleSyncConfig() {
		try {
			await projectsStore.syncProjectConfig(project.id);
			notifications.success(m.notify_synced({ entity: m.entity_config() }));
		} catch (err) {
			notifications.error(m.notify_sync_failed({ entity: m.entity_config() }));
			console.error(err);
		}
	}

	async function handleOpenFolder() {
		try {
			await invoke('open_folder', { path: project.path });
		} catch (err) {
			notifications.error(m.notify_open_failed({ entity: m.entity_folder() }));
			console.error(err);
		}
	}

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex flex-col h-full">
	<!-- Header -->
	<div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
		<div class="flex items-center gap-4 px-6 py-4">
			<!-- Back button -->
			<button
				onclick={() => goto('/projects')}
				class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
				title={m.project_back_to_projects()}
			>
				<ArrowLeft class="w-5 h-5" />
			</button>

			<!-- Project icon -->
			<div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
				<FolderOpen class="w-5 h-5 text-amber-600 dark:text-amber-400" />
			</div>

			<!-- Project info -->
			<div class="flex-1 min-w-0">
				<div class="flex items-center gap-2">
					<h1 class="text-xl font-semibold text-gray-900 dark:text-white truncate">{project.name}</h1>
					<!-- Editor Type Dropdown -->
					<div class="relative">
						<button
							onclick={(e) => { e.stopPropagation(); showEditorDropdown = !showEditorDropdown; }}
							disabled={updatingEditor}
							class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors {project.editorType === 'opencode'
								? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/70'
								: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/70'}"
						>
							<span class="w-3 h-3 rounded-sm flex items-center justify-center text-[8px] font-bold text-white {project.editorType === 'opencode' ? 'bg-emerald-500' : 'bg-primary-500'}">
								{project.editorType === 'opencode' ? 'O' : 'C'}
							</span>
							{getEditorDisplayName(project.editorType)}
							<ChevronDown class="w-3 h-3" />
						</button>
						{#if showEditorDropdown}
							<div class="absolute left-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
								<button
									onclick={() => handleChangeEditorType('claude_code')}
									class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 {project.editorType === 'claude_code' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}"
								>
									<span class="w-4 h-4 rounded-sm bg-primary-500 text-white flex items-center justify-center text-[9px] font-bold">C</span>
									{getEditorDisplayName('claude_code')}
								</button>
								<button
									onclick={() => handleChangeEditorType('opencode')}
									class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 {project.editorType === 'opencode' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}"
								>
									<span class="w-4 h-4 rounded-sm bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">O</span>
									{getEditorDisplayName('opencode')}
								</button>
							</div>
						{/if}
					</div>
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400 font-mono truncate">{project.path}</p>
			</div>

			<!-- Action buttons -->
			<div class="flex items-center gap-2 flex-shrink-0">
				<button
					onclick={handleOpenFolder}
					class="btn btn-ghost text-sm"
					title={m.project_open_project_folder()}
				>
					<ExternalLink class="w-4 h-4" />
					<span class="hidden sm:inline ml-1.5">{m.project_open_folder()}</span>
				</button>
				<button
					onclick={handleSyncConfig}
					class="btn btn-ghost text-sm"
					title={m.project_sync_config_files()}
				>
					<RefreshCw class="w-4 h-4" />
					<span class="hidden sm:inline ml-1.5">{m.project_sync_config()}</span>
				</button>
			</div>
		</div>

		<!-- Top-level tabs -->
		<div class="flex px-6 border-t border-gray-200 dark:border-gray-700 mt-1">
			<button
				onclick={() => switchTab('tools')}
				class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'tools' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				<Wrench class="w-4 h-4" />
				{m.project_tab_tools()}
				{#if toolsCount > 0}
					<span class="ml-1 px-1.5 py-0.5 text-xs rounded-full {activeTab === 'tools' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}">
						{toolsCount}
					</span>
				{/if}
			</button>
			<button
				onclick={() => switchTab('settings')}
				class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'settings' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				<Settings class="w-4 h-4" />
				{m.project_tab_settings()}
			</button>
		</div>
	</div>

	<!-- Tab content -->
	<div class="flex-1 overflow-hidden flex flex-col">
		{#if activeTab === 'tools'}
			<ProjectToolsPanel {project} />
		{:else}
			<ProjectSettingsPanel {project} {activeSection} onSectionChange={handleSectionChange} />
		{/if}
	</div>
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if showEditorDropdown}
	<div
		class="fixed inset-0 z-10"
		onclick={() => showEditorDropdown = false}
	></div>
{/if}
