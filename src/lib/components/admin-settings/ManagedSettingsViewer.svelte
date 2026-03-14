<script lang="ts">
	import type { ManagedSettingsInfo, ClaudeSettings } from '$lib/types';
	import { MANAGED_SETTINGS_FIELDS } from '$lib/types';
	import { Lock, CheckCircle, XCircle, FileWarning, Shield } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import {
		getManagedSettingsFieldDescription,
		getManagedSettingsFieldLabel
	} from '$lib/utils/managedSettingsI18n';

	type Props = {
		info: ManagedSettingsInfo;
	};

	let { info }: Props = $props();

	// Standard (non-managed-only) fields to display when set
	const STANDARD_FIELDS: { key: keyof ClaudeSettings; label: string }[] = [
		{ key: 'model', label: m.label_model() },
		{ key: 'availableModels', label: m.managed_field_available_models() },
		{ key: 'outputStyle', label: m.managed_field_output_style() },
		{ key: 'language', label: m.label_language() },
		{ key: 'alwaysThinkingEnabled', label: m.managed_field_always_thinking_enabled() },
		{ key: 'sandbox', label: m.settings_sandbox_general_title() },
		{ key: 'enabledPlugins', label: m.managed_field_enabled_plugins() },
		{ key: 'extraKnownMarketplaces', label: m.managed_field_extra_known_marketplaces() },
		{ key: 'env', label: m.label_env_variables() },
		{ key: 'showTurnDuration', label: m.managed_field_show_turn_duration() },
		{ key: 'spinnerTipsEnabled', label: m.managed_field_spinner_tips_enabled() },
		{ key: 'terminalProgressBarEnabled', label: m.managed_field_terminal_progress_bar() },
		{ key: 'prefersReducedMotion', label: m.managed_field_prefers_reduced_motion() },
		{ key: 'respectGitignore', label: m.managed_field_respect_gitignore() },
		{ key: 'cleanupPeriodDays', label: m.managed_field_cleanup_period_days() },
		{ key: 'autoUpdatesChannel', label: m.managed_field_auto_updates_channel() },
		{ key: 'teammateMode', label: m.managed_field_teammate_mode() },
		{ key: 'enableAllProjectMcpServers', label: m.managed_field_enable_all_project_mcps() }
	];

	function hasValue(val: unknown): boolean {
		if (val === undefined || val === null) return false;
		if (Array.isArray(val)) return val.length > 0;
		if (typeof val === 'object') return Object.keys(val).length > 0;
		return true;
	}

	function formatValue(val: unknown): string {
		if (typeof val === 'boolean') return val ? m.label_yes() : m.label_no();
		if (typeof val === 'number') return String(val);
		if (typeof val === 'string') return val;
		if (typeof val === 'object') return JSON.stringify(val, null, 2);
		return String(val);
	}

	const managedOnlyKeys = MANAGED_SETTINGS_FIELDS.map((f) => f.key);

	function getActiveStandardFields(s: ClaudeSettings) {
		return STANDARD_FIELDS.filter(
			(f) => !managedOnlyKeys.includes(f.key as (typeof managedOnlyKeys)[number]) && hasValue(s[f.key])
		);
	}
</script>

<!-- File status banner -->
<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
	<div class="flex items-center gap-3">
		<Shield class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
		<div class="flex-1 min-w-0">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">{m.managed_settings_file()}</h3>
			<p class="text-xs text-gray-500 dark:text-gray-400 font-mono truncate mt-0.5">
				{info.filePath}
			</p>
		</div>
		{#if info.exists}
			<span
				class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
			>
				<CheckCircle class="w-3.5 h-3.5" />
				{m.managed_found()}
			</span>
		{:else}
			<span
				class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
			>
				<XCircle class="w-3.5 h-3.5" />
				{m.managed_not_found()}
			</span>
		{/if}
	</div>
</div>

{#if !info.exists}
	<!-- Empty state for non-enterprise users -->
	<div
		class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
	>
		<FileWarning class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
			{m.managed_no_settings_found()}
		</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
			{m.managed_deployed_desc()}
		</p>
		<p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
			{m.managed_expected_location()}: <code class="font-mono">{info.filePath}</code>
		</p>
	</div>
{:else if info.settings}
	{@const s = info.settings}
	{@const activeStandard = getActiveStandardFields(s)}

	<div class="space-y-6">
		<!-- Managed-only section -->
		<div
			class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
		>
			<div class="flex items-center gap-2 mb-4">
				<Lock class="w-4 h-4 text-amber-500" />
				<h3 class="text-base font-semibold text-gray-900 dark:text-white">
					{m.managed_only_policies()}
				</h3>
			</div>
			<p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
				{m.managed_only_desc()}
			</p>

			<div class="divide-y divide-gray-100 dark:divide-gray-700">
				{#each MANAGED_SETTINGS_FIELDS as field}
					{@const val = s[field.key]}
					<div class="py-3 flex items-start gap-3">
						<Lock class="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium text-gray-900 dark:text-white">
									{getManagedSettingsFieldLabel(field.key, field.label)}
								</span>
								{#if !hasValue(val)}
									<span
										class="text-xs text-gray-400 dark:text-gray-500 italic"
									>
										{m.label_not_set()}
									</span>
								{/if}
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								{getManagedSettingsFieldDescription(field.key, field.description)}
							</p>
							{#if hasValue(val)}
								<div class="mt-2">
									{#if field.type === 'boolean'}
										<span
											class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
												{val ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}"
										>
											{val ? m.label_yes() : m.label_no()}
										</span>
									{:else if field.type === 'stringArray' && Array.isArray(val)}
										<div class="flex flex-wrap gap-1.5">
											{#each val as item}
												<span
													class="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
												>
													{item}
												</span>
											{/each}
										</div>
									{:else}
										<span
											class="text-sm font-mono text-gray-700 dark:text-gray-300"
										>
											{formatValue(val)}
										</span>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Standard settings being managed -->
		{#if activeStandard.length > 0}
			<div
				class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
			>
				<h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
					{m.managed_standard_settings()}
				</h3>
				<p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
					{m.managed_standard_desc()}
				</p>

				<div class="divide-y divide-gray-100 dark:divide-gray-700">
					{#each activeStandard as field}
						{@const val = s[field.key]}
						<div class="py-3">
							<div class="flex items-center gap-2 mb-1">
								<span class="text-sm font-medium text-gray-900 dark:text-white">
									{field.label}
								</span>
							</div>
							<div class="mt-1">
								{#if typeof val === 'boolean'}
									<span
										class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
											{val ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}"
									>
										{val ? m.label_yes() : m.label_no()}
									</span>
								{:else if Array.isArray(val)}
									<div class="flex flex-wrap gap-1.5">
										{#each val as item}
											<span
												class="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
											>
												{item}
											</span>
										{/each}
									</div>
								{:else if typeof val === 'object' && val !== null}
									<pre
										class="text-xs font-mono bg-gray-50 dark:bg-gray-900 rounded p-2 overflow-x-auto text-gray-700 dark:text-gray-300"
									>{JSON.stringify(val, null, 2)}</pre>
								{:else}
									<span class="text-sm font-mono text-gray-700 dark:text-gray-300">
										{formatValue(val)}
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
