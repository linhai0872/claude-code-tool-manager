<script lang="ts">
	import type { Project, ProjectSkill, ProjectSubAgent } from '$lib/types';
	import { projectsStore, notifications, skillLibrary, subagentLibrary } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { FolderOpen, MoreVertical, Trash2, RefreshCw, ExternalLink, Plug, Sparkles, Bot, Heart } from 'lucide-svelte';
	import { open } from '@tauri-apps/plugin-shell';
	import { getEditorDisplayName } from '$lib/utils/editorI18n';

	type Props = {
		project: Project;
		onRemove?: (project: Project) => void;
		onClick?: () => void;
		onFavoriteToggle?: (project: Project, favorite: boolean) => void;
	};

	let { project, onRemove, onClick, onFavoriteToggle }: Props = $props();

	let showMenu = $state(false);
	let menuAbove = $state(false);
	let menuButton: HTMLButtonElement;

	// Skills and agents for this project
	let projectSkills = $state<ProjectSkill[]>([]);
	let projectAgents = $state<ProjectSubAgent[]>([]);

	// Load skills and agents on mount
	$effect(() => {
		loadProjectData();
	});

	async function loadProjectData() {
		try {
			projectSkills = await skillLibrary.getProjectSkills(project.id);
			projectAgents = await subagentLibrary.getProjectSubAgents(project.id);
		} catch (err) {
			console.error('Failed to load project skills/agents:', err);
		}
	}

	function closeMenu() {
		showMenu = false;
	}

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();
		if (!showMenu) {
			const rect = menuButton.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			const menuHeight = 140;
			menuAbove = spaceBelow < menuHeight;
		}
		showMenu = !showMenu;
	}

	// Count enabled vs total MCPs
	let enabledMcpCount = $derived(project.assignedMcps.filter((a) => a.isEnabled).length);
	let totalMcpCount = $derived(project.assignedMcps.length);

	// Count enabled vs total Skills
	let enabledSkillCount = $derived(projectSkills.filter((s) => s.isEnabled).length);
	let totalSkillCount = $derived(projectSkills.length);

	// Count enabled vs total Agents
	let enabledAgentCount = $derived(projectAgents.filter((a) => a.isEnabled).length);
	let totalAgentCount = $derived(projectAgents.length);
</script>

<svelte:window onclick={closeMenu} />

<div
	class="card transition-all duration-200 hover:shadow-md cursor-pointer hover:border-primary-300 dark:hover:border-primary-700"
	onclick={onClick}
	role="button"
	tabindex="0"
	onkeypress={(e) => e.key === 'Enter' && onClick?.()}
>
	<div class="flex items-start gap-3">
		<div class="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
			<FolderOpen class="w-5 h-5 text-amber-600 dark:text-amber-400" />
		</div>

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2">
				<h3 class="font-medium text-gray-900 dark:text-white truncate">
					{project.name}
				</h3>
				<!-- Editor Type Badge -->
				{#if project.editorType === 'opencode'}
					<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
						<span class="w-3 h-3 rounded-sm bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">O</span>
						{getEditorDisplayName('opencode')}
					</span>
				{:else}
					<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
						<span class="w-3 h-3 rounded-sm bg-primary-500 text-white flex items-center justify-center text-[8px] font-bold">C</span>
						{getEditorDisplayName('claude_code')}
					</span>
				{/if}
				{#if project.hasMcpFile}
					<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
						.mcp.json
					</span>
				{/if}
			</div>
			<p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 font-mono">
				{project.path}
			</p>
		</div>

		<div class="flex items-center gap-1">
			{#if onFavoriteToggle}
				<button
					onclick={(e) => {
						e.stopPropagation();
						onFavoriteToggle(project, !project.isFavorite);
					}}
					class="p-1.5 rounded-lg transition-colors {project.isFavorite
						? 'text-rose-500 hover:text-rose-600'
						: 'text-gray-300 hover:text-rose-400 dark:text-gray-600 dark:hover:text-rose-400'}"
					title={project.isFavorite ? m.project_favorite_remove() : m.project_favorite_add()}
				>
					<Heart class="w-4 h-4" fill={project.isFavorite ? 'currentColor' : 'none'} />
				</button>
			{/if}
			<div class="relative">
				<button
					bind:this={menuButton}
					onclick={toggleMenu}
					class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<MoreVertical class="w-4 h-4" />
				</button>

			{#if showMenu}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10
						{menuAbove ? 'bottom-full mb-1' : 'top-full mt-1'}"
					onclick={(e) => e.stopPropagation()}
					role="menu"
				>
					<button
						onclick={() => {
							projectsStore.syncProjectConfig(project.id);
							notifications.success(m.notify_synced({ entity: m.entity_config() }));
							closeMenu();
						}}
						class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<RefreshCw class="w-4 h-4" />
						{m.project_sync_config()}
					</button>
					<button
						onclick={async () => {
							try {
								await open(project.path);
							} catch (e) {
								notifications.error(m.notify_open_failed({ entity: m.entity_folder() }));
							}
							closeMenu();
						}}
						class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<ExternalLink class="w-4 h-4" />
						{m.project_open_folder()}
					</button>
					{#if onRemove}
						<button
							onclick={() => {
								onRemove(project);
								closeMenu();
							}}
							class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
						>
							<Trash2 class="w-4 h-4" />
							{m.action_remove()}
						</button>
					{/if}
				</div>
			{/if}
			</div>
		</div>
	</div>

	<!-- Counts -->
	<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
		<!-- MCP Count -->
		<div class="flex items-center gap-1.5 text-sm">
			<Plug class="w-4 h-4 text-purple-400" />
			{#if totalMcpCount > 0}
				<span class="text-gray-600 dark:text-gray-300">
					{enabledMcpCount}/{totalMcpCount}
				</span>
			{:else}
				<span class="text-gray-400 dark:text-gray-500">0</span>
			{/if}
		</div>

		<!-- Skills Count -->
		<div class="flex items-center gap-1.5 text-sm">
			<Sparkles class="w-4 h-4 text-yellow-400" />
			{#if totalSkillCount > 0}
				<span class="text-gray-600 dark:text-gray-300">
					{enabledSkillCount}/{totalSkillCount}
				</span>
			{:else}
				<span class="text-gray-400 dark:text-gray-500">0</span>
			{/if}
		</div>

		<!-- Agents Count -->
		<div class="flex items-center gap-1.5 text-sm">
			<Bot class="w-4 h-4 text-cyan-400" />
			{#if totalAgentCount > 0}
				<span class="text-gray-600 dark:text-gray-300">
					{enabledAgentCount}/{totalAgentCount}
				</span>
			{:else}
				<span class="text-gray-400 dark:text-gray-500">0</span>
			{/if}
		</div>
	</div>
</div>
