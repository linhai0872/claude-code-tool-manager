<script lang="ts">
	import type { ClaudeSettings } from '$lib/types';
	import { Save, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		settings: ClaudeSettings;
		onsave: (settings: ClaudeSettings) => void;
	};

	let { settings, onsave }: Props = $props();

	const DEFAULT_COMMIT = 'Co-Authored-By: Claude <noreply@anthropic.com>';
	const DEFAULT_PR = 'Generated with [Claude Code](https://claude.ai/code)';

	let commitText = $state(settings.attributionCommit ?? '');
	let prText = $state(settings.attributionPr ?? '');
	let commitHasValue = $state(settings.attributionCommit !== undefined);
	let prHasValue = $state(settings.attributionPr !== undefined);

	// Reset local state when settings prop changes
	$effect(() => {
		commitText = settings.attributionCommit ?? '';
		prText = settings.attributionPr ?? '';
		commitHasValue = settings.attributionCommit !== undefined;
		prHasValue = settings.attributionPr !== undefined;
	});

	function handleSave() {
		onsave({
			...settings,
			attributionCommit: commitHasValue ? commitText : undefined,
			attributionPr: prHasValue ? prText : undefined
		});
	}

	function clearCommit() {
		commitHasValue = true;
		commitText = '';
	}

	function clearPr() {
		prHasValue = true;
		prText = '';
	}

	function unsetCommit() {
		commitHasValue = false;
		commitText = '';
	}

	function unsetPr() {
		prHasValue = false;
		prText = '';
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
	<h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">{m.settings_attribution_title()}</h3>
	<p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
		{m.settings_attribution_desc()}
	</p>

	<div class="space-y-4">
		<!-- Commit Attribution -->
		<div>
			<div class="flex items-center justify-between mb-1">
				<label
					for="commit-attribution"
					class="text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					{m.settings_attribution_commit_label()}
				</label>
				<div class="flex gap-1">
					{#if commitHasValue}
						<button
							onclick={unsetCommit}
							class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							title={m.settings_attribution_unset_hint()}
						>
							<X class="w-3.5 h-3.5" />
						</button>
					{:else}
						<button
							onclick={clearCommit}
							class="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
						>
							{m.settings_attribution_set_empty()}
						</button>
					{/if}
				</div>
			</div>
			{#if commitHasValue}
				<textarea
					id="commit-attribution"
					bind:value={commitText}
					placeholder={m.settings_attribution_commit_placeholder()}
					rows={2}
					class="input text-sm w-full resize-y"
				></textarea>
				{#if commitText === ''}
					<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
						{m.settings_attribution_commit_hidden()}
					</p>
				{/if}
			{:else}
				<p class="text-xs text-gray-500 dark:text-gray-400 italic">
					{m.settings_attribution_not_set({ defaultValue: DEFAULT_COMMIT })}
				</p>
			{/if}
		</div>

		<!-- PR Attribution -->
		<div>
			<div class="flex items-center justify-between mb-1">
				<label
					for="pr-attribution"
					class="text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					{m.settings_attribution_pr_label()}
				</label>
				<div class="flex gap-1">
					{#if prHasValue}
						<button
							onclick={unsetPr}
							class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							title={m.settings_attribution_unset_hint()}
						>
							<X class="w-3.5 h-3.5" />
						</button>
					{:else}
						<button
							onclick={clearPr}
							class="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
						>
							{m.settings_attribution_set_empty()}
						</button>
					{/if}
				</div>
			</div>
			{#if prHasValue}
				<textarea
					id="pr-attribution"
					bind:value={prText}
					placeholder={m.settings_attribution_pr_placeholder()}
					rows={2}
					class="input text-sm w-full resize-y"
				></textarea>
				{#if prText === ''}
					<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
						{m.settings_attribution_pr_hidden()}
					</p>
				{/if}
			{:else}
				<p class="text-xs text-gray-500 dark:text-gray-400 italic">
					{m.settings_attribution_not_set({ defaultValue: DEFAULT_PR })}
				</p>
			{/if}
		</div>

		<!-- Preview -->
		{#if commitHasValue || prHasValue}
			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{m.settings_attribution_preview()}</h4>
				<div class="space-y-2">
					{#if commitHasValue}
						<div class="bg-gray-50 dark:bg-gray-900/50 rounded p-3">
							<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.settings_attribution_commit_footer()}</p>
							<pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{commitText || m.settings_attribution_hidden_text()}</pre>
						</div>
					{/if}
					{#if prHasValue}
						<div class="bg-gray-50 dark:bg-gray-900/50 rounded p-3">
							<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.settings_attribution_pr_footer()}</p>
							<pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{prText || m.settings_attribution_hidden_text()}</pre>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-5 flex justify-end">
		<button onclick={handleSave} class="btn btn-primary">
			<Save class="w-4 h-4 mr-2" />
			{m.settings_attribution_save_btn()}
		</button>
	</div>
</div>
