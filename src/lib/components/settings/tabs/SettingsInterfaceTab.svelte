<script lang="ts">
	import { ScopedSettingsWrapper } from '$lib/components/settings';
	import { UITogglesEditor } from '$lib/components/ui-toggles';
	import { claudeSettingsLibrary } from '$lib/stores';
	import type { ClaudeSettingsScope } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';

	const localeNames: Record<string, string> = {
		'en': 'English',
		'zh-CN': '简体中文'
	};

	let currentLocale = $state(getLocale());

	function handleLocaleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const locale = target.value as 'en' | 'zh-CN';
		currentLocale = locale;
		setLocale(locale);
	}

	function getSettingCount(scope: ClaudeSettingsScope): number {
		if (!claudeSettingsLibrary.settings) return 0;
		const s =
			scope === 'user'
				? claudeSettingsLibrary.settings.user
				: scope === 'project'
					? claudeSettingsLibrary.settings.project
					: claudeSettingsLibrary.settings.local;
		if (!s) return 0;
		let count = 0;
		if (s.showTurnDuration !== undefined) count++;
		if (s.spinnerTipsEnabled !== undefined) count++;
		if (s.terminalProgressBarEnabled !== undefined) count++;
		if (s.prefersReducedMotion !== undefined) count++;
		if (s.respectGitignore !== undefined) count++;
		return count;
	}
</script>

<!-- Language Selector -->
<div class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-sm font-medium text-gray-900 dark:text-white">{m.label_language()}</h3>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.label_language_desc()}</p>
		</div>
		<select
			value={currentLocale}
			onchange={handleLocaleChange}
			class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
		>
			{#each locales as locale}
				<option value={locale}>{localeNames[locale] ?? locale}</option>
			{/each}
		</select>
	</div>
</div>

<ScopedSettingsWrapper {getSettingCount}>
	{#snippet children({ settings, save })}
		<UITogglesEditor
			{settings}
			onsave={(s) => save(s, 'UI toggle settings saved', 'Failed to save UI toggle settings')}
		/>
	{/snippet}
</ScopedSettingsWrapper>
