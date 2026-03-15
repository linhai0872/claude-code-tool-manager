<script lang="ts">
	import type { MarketplaceDefinition, MarketplaceSource, MarketplaceSourceType } from '$lib/types';
	import { MARKETPLACE_SOURCE_TYPES } from '$lib/types';
	import { CustomSelect } from '$lib/components/shared';
	import { Save, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getMarketplaceSourceTypeLabel } from '$lib/utils/claudeSettingsOptionsI18n';

	type Props = {
		name?: string;
		definition?: MarketplaceDefinition;
		onsave: (name: string, definition: MarketplaceDefinition) => void;
		oncancel: () => void;
	};

	let { name: initialName, definition, onsave, oncancel }: Props = $props();

	let name = $state(initialName ?? '');
	let sourceType = $state<MarketplaceSourceType>(definition?.source?.source ?? 'github');
	let installLocation = $state(definition?.installLocation ?? '');

	// Source-specific fields
	let repo = $state('');
	let gitUrl = $state('');
	let url = $state('');
	let npmPackage = $state('');
	let filePath = $state('');
	let dirPath = $state('');
	let hostPattern = $state('');
	let ref = $state('');
	let path = $state('');

	// Initialize from existing definition
	$effect(() => {
		if (definition?.source) {
			const src = definition.source;
			sourceType = src.source;
			if (src.source === 'github') {
				repo = src.repo;
				ref = src.ref ?? '';
				path = src.path ?? '';
			} else if (src.source === 'git') {
				gitUrl = src.url;
				ref = src.ref ?? '';
				path = src.path ?? '';
			} else if (src.source === 'url') {
				url = src.url;
			} else if (src.source === 'npm') {
				npmPackage = src.package;
			} else if (src.source === 'file') {
				filePath = src.path;
			} else if (src.source === 'directory') {
				dirPath = src.path;
			} else if (src.source === 'hostPattern') {
				hostPattern = src.hostPattern;
			}
		}
	});

	function buildSource(): MarketplaceSource {
		switch (sourceType) {
			case 'github':
				return { source: 'github', repo, ...(ref ? { ref } : {}), ...(path ? { path } : {}) };
			case 'git':
				return { source: 'git', url: gitUrl, ...(ref ? { ref } : {}), ...(path ? { path } : {}) };
			case 'url':
				return { source: 'url', url };
			case 'npm':
				return { source: 'npm', package: npmPackage };
			case 'file':
				return { source: 'file', path: filePath };
			case 'directory':
				return { source: 'directory', path: dirPath };
			case 'hostPattern':
				return { source: 'hostPattern', hostPattern };
		}
	}

	function handleSave() {
		if (!name.trim()) return;
		const def: MarketplaceDefinition = {
			source: buildSource(),
			...(installLocation ? { installLocation } : {})
		};
		onsave(name.trim(), def);
	}

	function isValid(): boolean {
		if (!name.trim()) return false;
		switch (sourceType) {
			case 'github': return !!repo.trim();
			case 'git': return !!gitUrl.trim();
			case 'url': return !!url.trim();
			case 'npm': return !!npmPackage.trim();
			case 'file': return !!filePath.trim();
			case 'directory': return !!dirPath.trim();
			case 'hostPattern': return !!hostPattern.trim();
		}
	}
</script>

<div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
	<div>
		<label for="marketplace-name" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.settings_marketplace_name_label()}</label>
		<input
			id="marketplace-name"
			type="text"
			bind:value={name}
			placeholder={m.marketplace_source_name_placeholder()}
			class="input text-sm w-full mt-1"
			disabled={!!initialName}
		/>
	</div>

	<div>
		<label for="marketplace-source-type" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.settings_marketplace_source_type()}</label>
		<CustomSelect
			id="marketplace-source-type"
			bind:value={sourceType}
			class="mt-1"
			options={MARKETPLACE_SOURCE_TYPES.map((t) => ({ value: t.value, label: getMarketplaceSourceTypeLabel(t.value) }))}
		/>
	</div>

	{#if sourceType === 'github'}
		<div>
			<label for="marketplace-repo" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_repository()} <span class="text-red-500">*</span></label>
			<input id="marketplace-repo" type="text" bind:value={repo} placeholder={m.marketplace_source_repo_placeholder()} class="input text-sm w-full mt-1" />
		</div>
		<div class="grid grid-cols-2 gap-2">
			<div>
				<label for="marketplace-github-ref" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_ref()}</label>
				<input id="marketplace-github-ref" type="text" bind:value={ref} placeholder={m.marketplace_source_ref_placeholder()} class="input text-sm w-full mt-1" />
			</div>
			<div>
				<label for="marketplace-github-path" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_path()}</label>
				<input id="marketplace-github-path" type="text" bind:value={path} placeholder={m.marketplace_source_path_placeholder()} class="input text-sm w-full mt-1" />
			</div>
		</div>
	{:else if sourceType === 'git'}
		<div>
			<label for="marketplace-git-url" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_git_url()} <span class="text-red-500">*</span></label>
			<input id="marketplace-git-url" type="text" bind:value={gitUrl} placeholder={m.marketplace_source_git_url_placeholder()} class="input text-sm w-full mt-1" />
		</div>
		<div class="grid grid-cols-2 gap-2">
			<div>
				<label for="marketplace-git-ref" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_ref()}</label>
				<input id="marketplace-git-ref" type="text" bind:value={ref} placeholder={m.marketplace_source_ref_placeholder()} class="input text-sm w-full mt-1" />
			</div>
			<div>
				<label for="marketplace-git-path" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_path()}</label>
				<input id="marketplace-git-path" type="text" bind:value={path} placeholder={m.marketplace_source_path_placeholder()} class="input text-sm w-full mt-1" />
			</div>
		</div>
	{:else if sourceType === 'url'}
		<div>
			<label for="marketplace-url" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_url()} <span class="text-red-500">*</span></label>
			<input id="marketplace-url" type="text" bind:value={url} placeholder={m.marketplace_source_url_placeholder()} class="input text-sm w-full mt-1" />
		</div>
	{:else if sourceType === 'npm'}
		<div>
			<label for="marketplace-npm-package" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_package()} <span class="text-red-500">*</span></label>
			<input id="marketplace-npm-package" type="text" bind:value={npmPackage} placeholder={m.marketplace_source_npm_placeholder()} class="input text-sm w-full mt-1" />
		</div>
	{:else if sourceType === 'file'}
		<div>
			<label for="marketplace-file-path" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_file_path()} <span class="text-red-500">*</span></label>
			<input id="marketplace-file-path" type="text" bind:value={filePath} placeholder={m.marketplace_source_file_placeholder()} class="input text-sm w-full mt-1" />
		</div>
	{:else if sourceType === 'directory'}
		<div>
			<label for="marketplace-directory-path" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_directory_path()} <span class="text-red-500">*</span></label>
			<input id="marketplace-directory-path" type="text" bind:value={dirPath} placeholder={m.marketplace_source_directory_placeholder()} class="input text-sm w-full mt-1" />
		</div>
	{:else if sourceType === 'hostPattern'}
		<div>
			<label for="marketplace-host-pattern" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.label_host_pattern()} <span class="text-red-500">*</span></label>
			<input id="marketplace-host-pattern" type="text" bind:value={hostPattern} placeholder={m.marketplace_source_host_pattern_placeholder()} class="input text-sm w-full mt-1" />
		</div>
	{/if}

	<div>
		<label for="marketplace-install-location" class="text-xs font-medium text-gray-600 dark:text-gray-400">{m.settings_marketplace_install_location()}</label>
		<input id="marketplace-install-location" type="text" bind:value={installLocation} placeholder={m.marketplace_source_install_location_placeholder()} class="input text-sm w-full mt-1" />
	</div>

	<div class="flex justify-end gap-2 pt-2">
		<button onclick={oncancel} class="btn btn-ghost text-sm">
			<X class="w-4 h-4 mr-1" />
			{m.action_cancel()}
		</button>
		<button onclick={handleSave} disabled={!isValid()} class="btn btn-primary text-sm">
			<Save class="w-4 h-4 mr-1" />
			{initialName ? m.settings_marketplace_update_btn() : m.settings_marketplace_add_btn()}
		</button>
	</div>
</div>
