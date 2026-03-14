import * as m from '$lib/paraglide/messages.js';
import type { ClaudeSettingsScope } from '$lib/types';

export function getClaudeSettingsScopeLabel(scope: ClaudeSettingsScope): string {
	switch (scope) {
		case 'user':
			return m.settings_scope_user_label();
		case 'project':
			return m.settings_scope_project_label();
		case 'local':
			return m.settings_scope_local_label();
	}
}

export function getClaudeSettingsScopeDescription(scope: ClaudeSettingsScope): string {
	switch (scope) {
		case 'user':
			return m.settings_scope_user_desc();
		case 'project':
			return m.settings_scope_project_desc();
		case 'local':
			return m.settings_scope_local_desc();
	}
}
