import * as m from '$lib/paraglide/messages.js';

export function getEditorDisplayName(editorId: string): string {
	switch (editorId) {
		case 'claude_code':
			return m.editor_claude_code();
		case 'opencode':
			return m.editor_opencode();
		case 'codex':
			return m.editor_codex();
		case 'copilot':
			return m.editor_copilot();
		case 'cursor':
			return m.editor_cursor();
		case 'gemini':
			return m.editor_gemini();
		default:
			return editorId;
	}
}
