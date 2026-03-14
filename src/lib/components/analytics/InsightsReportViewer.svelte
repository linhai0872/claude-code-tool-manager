<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import { ExternalLink, RefreshCw } from 'lucide-svelte';
	import { notifications } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		htmlContent: string;
		filePath: string;
		onRefresh?: () => void;
		isRefreshing?: boolean;
	};

	let { htmlContent, filePath, onRefresh, isRefreshing = false }: Props = $props();

	async function openInBrowser() {
		try {
			await invoke('open_config_file', { path: filePath });
		} catch (err) {
			notifications.error(m.notify_open_failed({ entity: m.entity_file() }));
			console.error('Failed to open report:', err);
		}
	}
</script>

<div
	class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
>
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white">{m.analytics_insights_report()}</h3>
		<div class="flex items-center gap-2">
			{#if onRefresh}
				<button
					onclick={onRefresh}
					disabled={isRefreshing}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					title={m.analytics_refresh_insights()}
				>
					<RefreshCw class="w-3.5 h-3.5 {isRefreshing ? 'animate-spin' : ''}" />
					{isRefreshing ? m.analytics_refreshing() : m.action_refresh()}
				</button>
			{/if}
			<button
				onclick={openInBrowser}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
			>
				<ExternalLink class="w-3.5 h-3.5" />
				{m.action_open_in_browser()}
			</button>
		</div>
	</div>

	<div class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
		<iframe
			srcdoc={htmlContent}
			title={m.analytics_insights_report_title()}
			class="w-full bg-white"
			style="height: 600px; border: none;"
			sandbox="allow-scripts allow-same-origin"
		></iframe>
	</div>
</div>
