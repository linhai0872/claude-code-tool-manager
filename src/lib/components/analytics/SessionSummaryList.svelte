<script lang="ts">
	import { ChevronDown, ChevronRight } from 'lucide-svelte';
	import type { SessionFacet } from '$lib/types';
	import { OUTCOME_COLORS } from '$lib/types/insights';
	import {
		getOutcomeLabel,
		getHelpfulnessLabel,
		getSessionTypeLabel
	} from '$lib/utils/insightsI18n';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		facets: SessionFacet[];
	};

	let { facets }: Props = $props();

	let expandedIds = $state<Set<string>>(new Set());

	function toggle(id: string) {
		const next = new Set(expandedIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedIds = next;
	}

	function outcomeColor(outcome: string): string {
		return OUTCOME_COLORS[outcome] || '#9ca3af';
	}

	function truncateId(id: string): string {
		if (id.length <= 12) return id;
		return id.slice(0, 8) + '...';
	}
</script>

<div
	class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
>
	<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
		{m.analytics_session_summaries()}
		<span class="text-xs font-normal text-gray-400 dark:text-gray-500 ml-2">
			{m.analytics_sessions_count({ count: facets.length })}
		</span>
	</h3>

	{#if facets.length === 0}
		<div class="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500">
			{m.empty_no_session_data()}
		</div>
	{:else}
		<div class="space-y-1.5 max-h-[500px] overflow-y-auto">
			{#each facets as facet (facet.sessionId)}
				{@const isExpanded = expandedIds.has(facet.sessionId)}
				<div
					class="border border-gray-100 dark:border-gray-700/50 rounded-lg overflow-hidden"
				>
					<button
						onclick={() => toggle(facet.sessionId)}
						class="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
					>
						{#if isExpanded}
							<ChevronDown class="w-4 h-4 text-gray-400 shrink-0" />
						{:else}
							<ChevronRight class="w-4 h-4 text-gray-400 shrink-0" />
						{/if}

						<div
							class="w-2 h-2 rounded-full shrink-0"
							style="background: {outcomeColor(facet.outcome)}"
						></div>

						<span class="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
							{facet.briefSummary || facet.underlyingGoal || m.analytics_untitled_session()}
						</span>

						<span
							class="text-[10px] font-mono text-gray-400 dark:text-gray-500 shrink-0"
						>
							{truncateId(facet.sessionId)}
						</span>
					</button>

					{#if isExpanded}
						<div
							class="px-3 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700/50 space-y-2"
						>
							{#if facet.underlyingGoal}
								<div>
									<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
										{m.label_goal()}
									</span>
									<p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
										{facet.underlyingGoal}
									</p>
								</div>
							{/if}

							{#if facet.briefSummary}
								<div>
									<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
										{m.label_summary()}
									</span>
									<p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
										{facet.briefSummary}
									</p>
								</div>
							{/if}

							<div class="flex flex-wrap gap-2 mt-2">
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
									style="background: {outcomeColor(facet.outcome)}20; color: {outcomeColor(facet.outcome)}"
								>
									{getOutcomeLabel(facet.outcome)}
								</span>

								{#if facet.claudeHelpfulness}
									<span
										class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
									>
										{getHelpfulnessLabel(facet.claudeHelpfulness)}
									</span>
								{/if}

								{#if facet.sessionType}
									<span
										class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
									>
										{getSessionTypeLabel(facet.sessionType)}
									</span>
								{/if}

								{#if facet.primarySuccess}
									<span
										class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium {facet.primarySuccess === 'true' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}"
									>
										{facet.primarySuccess === 'true' ? m.label_success() : m.label_not_successful()}
									</span>
								{/if}
							</div>

							{#if facet.frictionDetail}
								<div>
									<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
										{m.label_friction()}
									</span>
									<p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
										{facet.frictionDetail}
									</p>
								</div>
							{/if}

							{#if Object.keys(facet.goalCategories).length > 0}
								<div>
									<span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
										{m.label_categories()}
									</span>
									<div class="flex flex-wrap gap-1 mt-0.5">
										{#each Object.entries(facet.goalCategories) as [cat, count]}
											<span
												class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
											>
												{cat}: {count}
											</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
