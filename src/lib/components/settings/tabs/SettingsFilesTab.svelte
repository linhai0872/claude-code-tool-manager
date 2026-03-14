<script lang="ts">
	import { ScopedSettingsWrapper } from '$lib/components/settings';
	import { FileSuggestionEditor } from '$lib/components/file-suggestion';
	import { claudeSettingsLibrary } from '$lib/stores';
	import type { ClaudeSettingsScope } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

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
		if (s.fileSuggestionCommand) count++;
		return count;
	}
</script>

<ScopedSettingsWrapper {getSettingCount}>
	{#snippet children({ settings, save })}
		<FileSuggestionEditor
			{settings}
			onsave={(s) => save(s, m.settings_file_suggestion_saved(), m.settings_file_suggestion_save_failed())}
		/>
	{/snippet}
</ScopedSettingsWrapper>
