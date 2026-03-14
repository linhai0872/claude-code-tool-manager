import * as m from '$lib/paraglide/messages.js';
import type { HookEventType } from '$lib/types';

export function getHookEventLabel(eventType: HookEventType): string {
	switch (eventType) {
		case 'SessionStart':
			return m.hook_event_session_start();
		case 'UserPromptSubmit':
			return m.hook_event_user_prompt_submit();
		case 'PreToolUse':
			return m.hook_event_pre_tool_use();
		case 'PermissionRequest':
			return m.hook_event_permission_request();
		case 'PostToolUse':
			return m.hook_event_post_tool_use();
		case 'Notification':
			return m.hook_event_notification();
		case 'Stop':
			return m.hook_event_stop();
		case 'SubagentStop':
			return m.hook_event_subagent_stop();
		case 'PreCompact':
			return m.hook_event_pre_compact();
		case 'SessionEnd':
			return m.hook_event_session_end();
	}
}

export function getHookEventDescription(eventType: HookEventType): string {
	switch (eventType) {
		case 'SessionStart':
			return m.hook_event_session_start_desc();
		case 'UserPromptSubmit':
			return m.hook_event_user_prompt_submit_desc();
		case 'PreToolUse':
			return m.hook_event_pre_tool_use_desc();
		case 'PermissionRequest':
			return m.hook_event_permission_request_desc();
		case 'PostToolUse':
			return m.hook_event_post_tool_use_desc();
		case 'Notification':
			return m.hook_event_notification_desc();
		case 'Stop':
			return m.hook_event_stop_desc();
		case 'SubagentStop':
			return m.hook_event_subagent_stop_desc();
		case 'PreCompact':
			return m.hook_event_pre_compact_desc();
		case 'SessionEnd':
			return m.hook_event_session_end_desc();
	}
}

export function getHookEventMatcherHint(eventType: HookEventType): string | undefined {
	switch (eventType) {
		case 'SessionStart':
			return m.hook_event_session_start_matcher_hint();
		case 'PreToolUse':
			return m.hook_event_pre_tool_use_matcher_hint();
		case 'PermissionRequest':
			return m.hook_event_permission_request_matcher_hint();
		case 'PostToolUse':
			return m.hook_event_post_tool_use_matcher_hint();
		case 'Notification':
			return m.hook_event_notification_matcher_hint();
		case 'PreCompact':
			return m.hook_event_pre_compact_matcher_hint();
		default:
			return undefined;
	}
}
