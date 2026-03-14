import * as m from '$lib/paraglide/messages.js';

export function getPermissionToolLabel(tool: string, fallback: string): string {
	switch (tool) {
		case 'Bash':
			return m.permission_tool_bash_label();
		case 'Read':
			return m.permission_tool_read_label();
		case 'Edit':
			return m.permission_tool_edit_label();
		case 'Write':
			return m.permission_tool_write_label();
		case 'WebFetch':
			return m.permission_tool_webfetch_label();
		case 'WebSearch':
			return m.permission_tool_websearch_label();
		case 'Task':
			return m.permission_tool_task_label();
		case 'mcp__':
			return m.permission_tool_mcp_label();
		default:
			return fallback;
	}
}

export function getPermissionToolHint(tool: string, fallback: string): string {
	switch (tool) {
		case 'Bash':
			return m.permission_tool_bash_hint();
		case 'Read':
			return m.permission_tool_read_hint();
		case 'Edit':
			return m.permission_tool_edit_hint();
		case 'Write':
			return m.permission_tool_write_hint();
		case 'WebFetch':
			return m.permission_tool_webfetch_hint();
		case 'WebSearch':
			return m.permission_tool_websearch_hint();
		case 'Task':
			return m.permission_tool_task_hint();
		case 'mcp__':
			return m.permission_tool_mcp_hint();
		default:
			return fallback;
	}
}
