<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PermissionCategory } from '$lib/types';
	import { PERMISSION_TOOL_NAMES } from '$lib/types';
	import { CustomSelect } from '$lib/components/shared';
	import { X, Code, Wand2 } from 'lucide-svelte';
	import { getPermissionToolHint, getPermissionToolLabel } from '$lib/utils/permissionToolI18n';

	type Props = {
		category: PermissionCategory;
		onsubmit: (rule: string) => void;
		onclose: () => void;
	};

	let { category, onsubmit, onclose }: Props = $props();

	let selectedTool = $state('Bash');
	let specifier = $state('');
	let rawMode = $state(false);
	let rawRule = $state('');

	const currentToolHint = $derived(
		getPermissionToolHint(
			selectedTool,
			PERMISSION_TOOL_NAMES.find((t) => t.value === selectedTool)?.hint ?? ''
		)
	);

	const preview = $derived.by(() => {
		if (rawMode) return rawRule;
		if (!specifier) return selectedTool;
		return `${selectedTool}(${specifier})`;
	});

	function handleSubmit() {
		const rule = rawMode ? rawRule.trim() : preview;
		if (!rule) return;
		onsubmit(rule);
	}

	const categoryLabels: Record<PermissionCategory, () => string> = {
		allow: () => m.permission_category_allow(),
		deny: () => m.permission_category_deny(),
		ask: () => m.permission_category_ask()
	};

	const categoryColors: Record<PermissionCategory, string> = {
		deny: 'bg-red-600 hover:bg-red-700',
		ask: 'bg-amber-600 hover:bg-amber-700',
		allow: 'bg-green-600 hover:bg-green-700'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	onkeydown={(e) => e.key === 'Escape' && onclose()}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4" onclick={(e) => e.stopPropagation()}>
		<!-- Header -->
		<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{m.permission_add_rule_title({ category: categoryLabels[category]() })}
			</h3>
			<button
				onclick={onclose}
				class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- Body -->
		<div class="px-6 py-4 space-y-4">
			<!-- Mode toggle -->
			<div class="flex items-center gap-2">
				<button
					onclick={() => (rawMode = false)}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
						{!rawMode ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
				>
					<Wand2 class="w-4 h-4" />
					{m.permission_builder()}
				</button>
				<button
					onclick={() => (rawMode = true)}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
						{rawMode ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
				>
					<Code class="w-4 h-4" />
					{m.permission_raw()}
				</button>
			</div>

			{#if rawMode}
				<div>
					<label for="permission-raw-rule" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						{m.permission_rule_label()}
					</label>
					<input
						id="permission-raw-rule"
						type="text"
						bind:value={rawRule}
						placeholder={m.permission_rule_placeholder()}
						class="input w-full font-mono"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{m.permission_rule_format_hint()}
					</p>
				</div>
			{:else}
				<!-- Tool selector -->
				<div>
					<label for="permission-tool" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						{m.permission_tool_label()}
					</label>
					<CustomSelect
						id="permission-tool"
						bind:value={selectedTool}
						options={PERMISSION_TOOL_NAMES.map((t) => ({ value: t.value, label: getPermissionToolLabel(t.value, t.label) }))}
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{currentToolHint}</p>
				</div>

				<!-- Specifier -->
				<div>
					<label for="permission-specifier" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						{m.permission_specifier_label()} <span class="text-gray-400">({m.label_optional()})</span>
					</label>
					<input
						id="permission-specifier"
						type="text"
						bind:value={specifier}
						placeholder={selectedTool === 'Bash'
							? m.permission_specifier_placeholder_bash()
							: selectedTool === 'Read'
								? m.permission_specifier_placeholder_read()
								: ''}
						class="input w-full font-mono"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{m.permission_specifier_hint()}
					</p>
				</div>
			{/if}

			<!-- Preview -->
			<div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
				<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{m.permission_preview()}</p>
				<code class="text-sm font-mono text-gray-800 dark:text-gray-200">{preview || '...'}</code>
			</div>
		</div>

		<!-- Footer -->
		<div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
			<button onclick={onclose} class="btn btn-secondary">{m.action_cancel()}</button>
			<button
				onclick={handleSubmit}
				disabled={!preview}
				class="btn text-white {categoryColors[category]} disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{m.permission_add_rule()}
			</button>
		</div>
	</div>
</div>
