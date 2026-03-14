<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { MemoryScope, AllMemoryFiles } from '$lib/types';
	import { User, FolderOpen, FileText } from 'lucide-svelte';

	type Props = {
		selectedScope: MemoryScope;
		memoryFiles: AllMemoryFiles | null;
		hasProject: boolean;
		onselect: (scope: MemoryScope) => void;
	};

	let { selectedScope, memoryFiles, hasProject, onselect }: Props = $props();

	const scopes: { key: MemoryScope; icon: typeof User }[] = [
		{ key: 'user', icon: User },
		{ key: 'project', icon: FolderOpen },
		{ key: 'local', icon: FileText }
	];

	const scopeLabels: Record<MemoryScope, () => string> = {
		user: () => m.scope_user(),
		project: () => m.scope_project(),
		local: () => m.scope_local()
	};

	const scopeDescriptions: Record<MemoryScope, () => string> = {
		user: () => m.memory_scope_user_desc(),
		project: () => m.memory_scope_project_desc(),
		local: () => m.memory_scope_local_desc()
	};

	function fileExists(scope: MemoryScope): boolean {
		if (!memoryFiles) return false;
		switch (scope) {
			case 'user':
				return memoryFiles.user.exists;
			case 'project':
				return memoryFiles.project?.exists ?? false;
			case 'local':
				return memoryFiles.local?.exists ?? false;
		}
	}
</script>

<div class="flex gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
	{#each scopes as { key, icon }}
		{@const isDisabled = key !== 'user' && !hasProject}
		{@const isActive = selectedScope === key}
		{@const exists = fileExists(key)}
		<button
			onclick={() => onselect(key)}
			disabled={isDisabled}
			class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1
				{isActive
				? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
				: isDisabled
					? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
					: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
			title={scopeDescriptions[key]()}
		>
			<svelte:component this={icon} class="w-4 h-4" />
			{scopeLabels[key]()}
			<span
				class="w-2 h-2 rounded-full {exists
					? 'bg-green-500'
					: 'bg-gray-300 dark:bg-gray-500'}"
				title={exists ? m.memory_file_exists() : m.memory_file_not_exists()}
			></span>
		</button>
	{/each}
</div>
