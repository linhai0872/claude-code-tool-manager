import * as m from '$lib/paraglide/messages.js';

export function getManagedSettingsFieldLabel(key: string, fallback: string): string {
	switch (key) {
		case 'allowManagedHooksOnly':
			return m.managed_field_allow_managed_hooks_only();
		case 'allowManagedPermissionRulesOnly':
			return m.managed_field_allow_managed_permission_rules_only();
		case 'disableBypassPermissionsMode':
			return m.managed_field_disable_bypass_permissions_mode();
		case 'allowedMcpServers':
			return m.managed_field_allowed_mcp_servers();
		case 'deniedMcpServers':
			return m.managed_field_denied_mcp_servers();
		case 'strictKnownMarketplaces':
			return m.managed_field_strict_known_marketplaces();
		case 'companyAnnouncements':
			return m.managed_field_company_announcements();
		case 'forceLoginMethod':
			return m.managed_field_force_login_method();
		case 'forceLoginOrgUUID':
			return m.managed_field_force_login_org_uuid();
		default:
			return fallback;
	}
}

export function getManagedSettingsFieldDescription(key: string, fallback: string): string {
	switch (key) {
		case 'allowManagedHooksOnly':
			return m.managed_field_allow_managed_hooks_only_desc();
		case 'allowManagedPermissionRulesOnly':
			return m.managed_field_allow_managed_permission_rules_only_desc();
		case 'disableBypassPermissionsMode':
			return m.managed_field_disable_bypass_permissions_mode_desc();
		case 'allowedMcpServers':
			return m.managed_field_allowed_mcp_servers_desc();
		case 'deniedMcpServers':
			return m.managed_field_denied_mcp_servers_desc();
		case 'strictKnownMarketplaces':
			return m.managed_field_strict_known_marketplaces_desc();
		case 'companyAnnouncements':
			return m.managed_field_company_announcements_desc();
		case 'forceLoginMethod':
			return m.managed_field_force_login_method_desc();
		case 'forceLoginOrgUUID':
			return m.managed_field_force_login_org_uuid_desc();
		default:
			return fallback;
	}
}
