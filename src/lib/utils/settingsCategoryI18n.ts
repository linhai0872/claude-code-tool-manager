import * as m from '$lib/paraglide/messages.js';

export function getSettingsCategoryLabel(categoryId: string): string {
	switch (categoryId) {
		case 'models':
			return m.settings_model_title();
		case 'security':
			return m.settings_category_security();
		case 'plugins':
			return m.settings_plugins_title();
		case 'environment':
			return m.settings_env_title();
		case 'interface':
			return m.settings_category_interface();
		case 'files':
			return m.settings_category_files();
		case 'session':
			return m.settings_session_title();
		case 'authentication':
			return m.settings_auth_title();
		case 'mcp-approval':
			return m.settings_mcp_approval_title();
		case 'keybindings':
			return m.settings_category_keybindings();
		case 'spinner-verbs':
			return m.settings_category_spinner_verbs();
		case 'admin':
			return m.settings_category_admin();
		case 'editor-sync':
			return m.settings_category_editor_sync();
		default:
			return categoryId;
	}
}
