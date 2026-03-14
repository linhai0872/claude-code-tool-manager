<script lang="ts">
	import { ScopedSettingsWrapper } from '$lib/components/settings';
	import { EnvVarsEditor } from '$lib/components/env-vars';
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
		return Object.keys(s.env ?? {}).length;
	}
</script>

<ScopedSettingsWrapper {getSettingCount}>
	{#snippet children({ settings, save })}
		<EnvVarsEditor
			{settings}
			onsave={(s) => save(s, m.settings_env_saved(), m.settings_env_save_failed())}
		/>
	{/snippet}
</ScopedSettingsWrapper>
