<script lang="ts">
	import type { SubAgent } from '$lib/types';
	import { subagentLibrary } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';
	import SubAgentCard from './SubAgentCard.svelte';
	import { SearchBar } from '$lib/components/shared';
	import { Bot } from 'lucide-svelte';
	import { invoke } from '@tauri-apps/api/core';

	type Props = {
		onEdit?: (subagent: SubAgent) => void;
		onDelete?: (subagent: SubAgent) => void;
	};

	let { onEdit, onDelete }: Props = $props();

	async function handleFavoriteToggle(subagent: SubAgent, favorite: boolean) {
		try {
			await invoke('toggle_subagent_favorite', { id: subagent.id, favorite });
			subagentLibrary.updateSubAgent({ ...subagent, isFavorite: favorite });
		} catch (error) {
			console.error('Failed to toggle favorite:', error);
		}
	}
</script>

<div class="space-y-4">
	<!-- Filters -->
	<div class="flex items-center gap-4">
		<div class="flex-1 max-w-sm">
			<SearchBar
				bind:value={subagentLibrary.searchQuery}
				placeholder={m.placeholder_search_subagents()}
			/>
		</div>

		<div class="text-sm text-gray-500 dark:text-gray-400">
			{m.subagent_count({ count: subagentLibrary.subagents.length })}
		</div>
	</div>

	<!-- SubAgent Grid -->
	{#if subagentLibrary.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
		</div>
	{:else if subagentLibrary.filteredSubAgents.length === 0}
		<div class="text-center py-12">
			<Bot class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
			{#if subagentLibrary.searchQuery}
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m.empty_no_matching_subagents()}</h3>
				<p class="text-gray-500 dark:text-gray-400 mt-1">
					{m.empty_try_adjusting_search()}
				</p>
			{:else}
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m.empty_no_subagents_in_library()}</h3>
				<p class="text-gray-500 dark:text-gray-400 mt-1">
					{m.empty_add_first_subagent()}
				</p>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each subagentLibrary.filteredSubAgents as subagent (subagent.id)}
				<SubAgentCard
					{subagent}
					{onEdit}
					{onDelete}
					onFavoriteToggle={handleFavoriteToggle}
				/>
			{/each}
		</div>
	{/if}
</div>
