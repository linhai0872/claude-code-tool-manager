<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Header } from '$lib/components/layout';
	import { SETTINGS_CATEGORIES } from '$lib/components/settings';
	import {
		SettingsModelsTab,
		SettingsSecurityTab,
		SettingsPluginsTab,
		SettingsEnvironmentTab,
		SettingsInterfaceTab,
		SettingsFilesTab,
		SettingsSessionTab,
		SettingsAuthTab,
		SettingsMcpApprovalTab,
		SettingsKeybindingsTab,
		SettingsSpinnerVerbsTab,
		SettingsAdminTab,
		SettingsEditorSyncTab
	} from '$lib/components/settings/tabs';
	import * as m from '$lib/paraglide/messages.js';
	import { getSettingsCategoryLabel } from '$lib/utils/settingsCategoryI18n';

	const scopedCategories = SETTINGS_CATEGORIES.filter(c => c.type === 'scoped');
	const standaloneCategories = SETTINGS_CATEGORIES.filter(c => c.type === 'standalone');

	const activeTab = $derived($page.url.searchParams.get('tab') ?? 'models');
	const activeCategory = $derived(SETTINGS_CATEGORIES.find(c => c.id === activeTab) ?? SETTINGS_CATEGORIES[0]);

	function switchTab(tabId: string) {
		goto(`/settings?tab=${tabId}`, { replaceState: true });
	}

	const TAB_SUBTITLES: Record<string, () => string> = {
		'models': m.page_settings_subtitle_models,
		'security': m.page_settings_subtitle_security,
		'plugins': m.page_settings_subtitle_plugins,
		'environment': m.page_settings_subtitle_environment,
		'interface': m.page_settings_subtitle_interface,
		'files': m.page_settings_subtitle_files,
		'session': m.page_settings_subtitle_session,
		'authentication': m.page_settings_subtitle_authentication,
		'mcp-approval': m.page_settings_subtitle_mcp_approval,
		'keybindings': m.page_settings_subtitle_keybindings,
		'spinner-verbs': m.page_settings_subtitle_spinner_verbs,
		'admin': m.page_settings_subtitle_admin,
		'editor-sync': m.page_settings_subtitle_editor_sync
	};
</script>

<Header
	title={m.page_settings_title()}
	subtitle={TAB_SUBTITLES[activeTab]?.() ?? m.page_settings_subtitle_default()}
/>

<div class="flex-1 overflow-hidden flex">
	<!-- Left Nav -->
	<nav class="w-52 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-y-auto flex-shrink-0">
		<div class="p-3">
			<p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-2">
				{m.settings_section_configuration()}
			</p>
			{#each scopedCategories as category}
				{@const isActive = activeTab === category.id}
				<button
					onclick={() => switchTab(category.id)}
					class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5
						{isActive
							? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
							: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'}"
				>
					<svelte:component this={category.icon} class="w-4 h-4 flex-shrink-0" />
					{getSettingsCategoryLabel(category.id)}
				</button>
			{/each}

			<div class="border-t border-gray-200 dark:border-gray-700 my-3"></div>

			<p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-2">
				{m.settings_section_other()}
			</p>
			{#each standaloneCategories as category}
				{@const isActive = activeTab === category.id}
				<button
					onclick={() => switchTab(category.id)}
					class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5
						{isActive
							? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
							: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'}"
				>
					<svelte:component this={category.icon} class="w-4 h-4 flex-shrink-0" />
					{getSettingsCategoryLabel(category.id)}
				</button>
			{/each}
		</div>
	</nav>

	<!-- Right Content Area -->
	<div class="flex-1 overflow-auto p-6">
		{#if activeTab === 'models'}
			<SettingsModelsTab />
		{:else if activeTab === 'security'}
			<SettingsSecurityTab />
		{:else if activeTab === 'plugins'}
			<SettingsPluginsTab />
		{:else if activeTab === 'environment'}
			<SettingsEnvironmentTab />
		{:else if activeTab === 'interface'}
			<SettingsInterfaceTab />
		{:else if activeTab === 'files'}
			<SettingsFilesTab />
		{:else if activeTab === 'session'}
			<SettingsSessionTab />
		{:else if activeTab === 'authentication'}
			<SettingsAuthTab />
		{:else if activeTab === 'mcp-approval'}
			<SettingsMcpApprovalTab />
		{:else if activeTab === 'keybindings'}
			<SettingsKeybindingsTab />
		{:else if activeTab === 'spinner-verbs'}
			<SettingsSpinnerVerbsTab />
		{:else if activeTab === 'admin'}
			<SettingsAdminTab />
		{:else if activeTab === 'editor-sync'}
			<SettingsEditorSyncTab />
		{/if}
	</div>
</div>
