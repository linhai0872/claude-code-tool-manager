<script lang="ts">
	import { ScopedSettingsWrapper } from '$lib/components/settings';
	import { AuthHelpersEditor } from '$lib/components/auth-helpers';
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
		if (s.apiKeyHelper) count++;
		if (s.otelHeadersHelper) count++;
		if (s.awsAuthRefresh) count++;
		if (s.awsCredentialExport) count++;
		return count;
	}
</script>

<ScopedSettingsWrapper {getSettingCount}>
	{#snippet children({ settings, save })}
		<AuthHelpersEditor
			{settings}
			onsave={(s) => save(s, m.settings_auth_saved(), m.settings_auth_save_failed())}
		/>
	{/snippet}
</ScopedSettingsWrapper>
