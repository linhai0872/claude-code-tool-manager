<script lang="ts">
	import type { Mcp } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';
	import { mcpLibrary } from '$lib/stores';
	import McpCard from './McpCard.svelte';
	import { SearchBar } from '$lib/components/shared';
	import { Plug, Globe, Server, Package } from 'lucide-svelte';
	import { invoke } from '@tauri-apps/api/core';

	type Props = {
		onEdit?: (mcp: Mcp) => void;
		onDelete?: (mcp: Mcp) => void;
		onDuplicate?: (mcp: Mcp) => void;
		onTest?: (mcp: Mcp) => void;
		showGatewayToggle?: boolean;
		gatewayMcpIds?: Set<number>;
		onGatewayToggle?: (mcp: Mcp, enabled: boolean) => void;
	};

	let { onEdit, onDelete, onDuplicate, onTest, showGatewayToggle = false, gatewayMcpIds = new Set(), onGatewayToggle }: Props = $props();

	async function handleFavoriteToggle(mcp: Mcp, favorite: boolean) {
		try {
			await invoke('toggle_mcp_favorite', { id: mcp.id, favorite });
			mcpLibrary.updateMcp({ ...mcp, isFavorite: favorite });
		} catch (error) {
			console.error('Failed to toggle favorite:', error);
		}
	}

	const typeFilters: { value: 'all' | 'stdio' | 'sse' | 'http'; label: string; icon: typeof Package }[] = [
		{ value: 'all', label: m.mcp_filter_all(), icon: Package },
		{ value: 'stdio', label: m.mcp_type_stdio(), icon: Plug },
		{ value: 'sse', label: m.mcp_type_sse(), icon: Globe },
		{ value: 'http', label: m.mcp_type_http(), icon: Server }
	];
</script>

<div class="space-y-4">
	<!-- Filters -->
	<div class="flex items-center gap-4">
		<div class="flex-1 max-w-sm">
			<SearchBar
				bind:value={mcpLibrary.searchQuery}
				placeholder={m.placeholder_search_mcps()}
			/>
		</div>

		<div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
			{#each typeFilters as filter}
				<button
					onclick={() => mcpLibrary.setTypeFilter(filter.value)}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
						{mcpLibrary.selectedType === filter.value
							? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
							: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
				>
					<svelte:component this={filter.icon} class="w-3.5 h-3.5" />
					{filter.label}
					<span class="text-xs text-gray-400">
						{filter.value === 'all' ? mcpLibrary.mcpCount.total : mcpLibrary.mcpCount[filter.value]}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- MCP Grid -->
	{#if mcpLibrary.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
		</div>
	{:else if mcpLibrary.filteredMcps.length === 0}
		<div class="text-center py-12">
			<Package class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
			{#if mcpLibrary.searchQuery || mcpLibrary.selectedType !== 'all'}
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m.mcp_no_matching()}</h3>
				<p class="text-gray-500 dark:text-gray-400 mt-1">
					{m.mcp_adjust_filters()}
				</p>
			{:else}
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m.mcp_empty_library()}</h3>
				<p class="text-gray-500 dark:text-gray-400 mt-1">
					{m.mcp_empty_library_hint()}
				</p>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each mcpLibrary.filteredMcps as mcp (mcp.id)}
				<McpCard
					{mcp}
					{onEdit}
					{onDelete}
					{onDuplicate}
					{onTest}
					{showGatewayToggle}
					isInGateway={gatewayMcpIds.has(mcp.id)}
					{onGatewayToggle}
					onFavoriteToggle={handleFavoriteToggle}
				/>
			{/each}
		</div>
	{/if}
</div>
