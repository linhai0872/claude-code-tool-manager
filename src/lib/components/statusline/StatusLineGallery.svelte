<script lang="ts">
	import { statuslineLibrary } from '$lib/stores';
	import StatusLineGalleryCard from './StatusLineGalleryCard.svelte';
	import type { StatusLineGalleryEntry } from '$lib/types';
	import { RefreshCw, Package } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		onInstall?: (entry: StatusLineGalleryEntry) => void;
	};

	let { onInstall }: Props = $props();

	let installingName = $state<string | null>(null);

	// Check if an entry is already installed by package name
	function isInstalled(entry: StatusLineGalleryEntry): boolean {
		return statuslineLibrary.statuslines.some(
			(s) => s.packageName === entry.packageName || s.name === entry.name
		);
	}

	async function handleInstall(entry: StatusLineGalleryEntry) {
		installingName = entry.name;
		try {
			await onInstall?.(entry);
		} finally {
			installingName = null;
		}
	}

	async function refresh() {
		await statuslineLibrary.loadGallery();
	}
</script>

<div>
	<div class="flex items-center justify-between mb-4">
		<p class="text-sm text-gray-500 dark:text-gray-400">
			{m.statusline_gallery_desc()}
		</p>
		<button onclick={refresh} class="btn btn-secondary text-sm" disabled={statuslineLibrary.isGalleryLoading}>
			<RefreshCw class="w-4 h-4 mr-1.5 {statuslineLibrary.isGalleryLoading ? 'animate-spin' : ''}" />
			{m.action_refresh()}
		</button>
	</div>

	{#if statuslineLibrary.gallery.length === 0}
		<div class="text-center py-12">
			<Package class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
			<p class="text-gray-500 dark:text-gray-400">{m.statusline_no_gallery_entries()}</p>
			<p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
				{m.statusline_gallery_refresh_hint()}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each statuslineLibrary.gallery as entry (entry.name)}
				<StatusLineGalleryCard
					{entry}
					isInstalled={isInstalled(entry)}
					isInstalling={installingName === entry.name}
					onInstall={handleInstall}
				/>
			{/each}
		</div>
	{/if}
</div>
