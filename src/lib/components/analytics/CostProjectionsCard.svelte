<script lang="ts">
	import type { DailyModelTokens } from '$lib/types/usage';
	import { formatCost } from '$lib/types/usage';
	import { TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		dailyCosts: DailyModelTokens[];
		totalCostUSD: number;
	};

	let { dailyCosts, totalCostUSD }: Props = $props();

	function dayTotal(d: DailyModelTokens): number {
		return Object.values(d.tokensByModel).reduce((a, b) => a + b, 0);
	}

	const activeDays = $derived(dailyCosts.filter((d) => dayTotal(d) > 0));

	const dailyAvg = $derived(
		activeDays.length > 0
			? activeDays.reduce((s, d) => s + dayTotal(d), 0) / activeDays.length
			: 0
	);

	const projectedWeekly = $derived(dailyAvg * 7);
	const projectedMonthly = $derived(dailyAvg * 30);

	const trend = $derived.by(() => {
		if (activeDays.length < 2) return 'flat' as const;
		const sorted = [...activeDays].sort((a, b) => b.date.localeCompare(a.date));
		const recent = sorted.slice(0, 7);
		const prior = sorted.slice(7, 14);
		if (prior.length === 0) return 'flat' as const;
		const recentAvg = recent.reduce((s, d) => s + dayTotal(d), 0) / recent.length;
		const priorAvg = prior.reduce((s, d) => s + dayTotal(d), 0) / prior.length;
		if (recentAvg > priorAvg * 1.1) return 'up' as const;
		if (recentAvg < priorAvg * 0.9) return 'down' as const;
		return 'flat' as const;
	});
</script>

<div
	class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
>
	<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{m.analytics_cost_projections()}</h3>

	{#if totalCostUSD === 0}
		<div class="flex items-center justify-center py-8 text-gray-400 dark:text-gray-500">
			{m.empty_no_cost_data()}
		</div>
	{:else}
		<div class="grid grid-cols-3 gap-4">
			<div class="text-center">
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.analytics_daily_avg()}</p>
				<p class="text-lg font-bold text-gray-900 dark:text-white">{formatCost(dailyAvg)}</p>
			</div>
			<div class="text-center">
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.analytics_weekly_est()}</p>
				<p class="text-lg font-bold text-gray-900 dark:text-white">{formatCost(projectedWeekly)}</p>
			</div>
			<div class="text-center">
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.analytics_monthly_est()}</p>
				<p class="text-lg font-bold text-gray-900 dark:text-white">{formatCost(projectedMonthly)}</p>
			</div>
		</div>

		<div class="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
			{#if trend === 'up'}
				<TrendingUp class="w-4 h-4 text-red-500" />
				<span class="text-xs text-red-500 font-medium">{m.analytics_spending_trending_up()}</span>
			{:else if trend === 'down'}
				<TrendingDown class="w-4 h-4 text-green-500" />
				<span class="text-xs text-green-500 font-medium">{m.analytics_spending_trending_down()}</span>
			{:else}
				<Minus class="w-4 h-4 text-gray-400" />
				<span class="text-xs text-gray-400 font-medium">{m.analytics_spending_stable()}</span>
			{/if}
		</div>
	{/if}
</div>
