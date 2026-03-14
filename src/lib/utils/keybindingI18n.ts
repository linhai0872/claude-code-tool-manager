import * as m from '$lib/paraglide/messages.js';
import type { KeybindingContext } from '$lib/types';

export function getKeybindingContextLabel(context: KeybindingContext): string {
	switch (context) {
		case 'Global':
			return m.keybinding_context_global();
		case 'Chat':
			return m.keybinding_context_chat();
		case 'Autocomplete':
			return m.keybinding_context_autocomplete();
		case 'Confirm':
			return m.keybinding_context_confirm();
		case 'Tabs':
			return m.keybinding_context_tabs();
		case 'Transcript':
			return m.keybinding_context_transcript();
		case 'HistorySearch':
			return m.keybinding_context_history_search();
		case 'Task':
			return m.keybinding_context_task();
		case 'Theme':
			return m.keybinding_context_theme();
		case 'Help':
			return m.keybinding_context_help();
		case 'Attachments':
			return m.keybinding_context_attachments();
		case 'Footer':
			return m.keybinding_context_footer();
		case 'MessageSelector':
			return m.keybinding_context_message_selector();
		case 'Diff':
			return m.keybinding_context_diff();
		case 'ModelPicker':
			return m.keybinding_context_model_picker();
		case 'Select':
			return m.keybinding_context_select();
		case 'Plugin':
			return m.keybinding_context_plugin();
		case 'Permission':
			return m.keybinding_context_permission();
	}
}

export function getKeybindingContextDescription(context: KeybindingContext): string {
	switch (context) {
		case 'Global':
			return m.keybinding_context_global_desc();
		case 'Chat':
			return m.keybinding_context_chat_desc();
		case 'Autocomplete':
			return m.keybinding_context_autocomplete_desc();
		case 'Confirm':
			return m.keybinding_context_confirm_desc();
		case 'Tabs':
			return m.keybinding_context_tabs_desc();
		case 'Transcript':
			return m.keybinding_context_transcript_desc();
		case 'HistorySearch':
			return m.keybinding_context_history_search_desc();
		case 'Task':
			return m.keybinding_context_task_desc();
		case 'Theme':
			return m.keybinding_context_theme_desc();
		case 'Help':
			return m.keybinding_context_help_desc();
		case 'Attachments':
			return m.keybinding_context_attachments_desc();
		case 'Footer':
			return m.keybinding_context_footer_desc();
		case 'MessageSelector':
			return m.keybinding_context_message_selector_desc();
		case 'Diff':
			return m.keybinding_context_diff_desc();
		case 'ModelPicker':
			return m.keybinding_context_model_picker_desc();
		case 'Select':
			return m.keybinding_context_select_desc();
		case 'Plugin':
			return m.keybinding_context_plugin_desc();
		case 'Permission':
			return m.keybinding_context_permission_desc();
	}
}
