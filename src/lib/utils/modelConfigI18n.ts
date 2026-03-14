import * as m from '$lib/paraglide/messages.js';

export function getClaudeModelLabel(value: string, fallback: string): string {
	switch (value) {
		case 'claude-sonnet-4-5-20250929':
			return m.model_option_sonnet_label();
		case 'claude-opus-4-6':
			return m.model_option_opus_label();
		case 'claude-haiku-4-5-20251001':
			return m.model_option_haiku_label();
		default:
			return fallback;
	}
}

export function getClaudeModelDescription(value: string, fallback: string): string {
	switch (value) {
		case 'claude-sonnet-4-5-20250929':
			return m.model_option_sonnet_desc();
		case 'claude-opus-4-6':
			return m.model_option_opus_desc();
		case 'claude-haiku-4-5-20251001':
			return m.model_option_haiku_desc();
		default:
			return fallback;
	}
}

export function getModelShortcutLabel(value: string): string {
	switch (value) {
		case 'sonnet':
			return m.model_shortcut_sonnet();
		case 'opus':
			return m.model_shortcut_opus();
		case 'haiku':
			return m.model_shortcut_haiku();
		default:
			return value;
	}
}

export function getOutputStyleLabel(value: string): string {
	switch (value) {
		case '':
			return m.label_not_set();
		case 'concise':
			return m.output_style_concise();
		case 'verbose':
			return m.output_style_verbose();
		case 'markdown':
			return m.output_style_markdown();
		default:
			return value;
	}
}

export function getCommonLanguageLabel(value: string): string {
	switch (value) {
		case '':
			return m.language_not_set_default_english();
		case 'english':
			return m.language_english();
		case 'spanish':
			return m.language_spanish();
		case 'french':
			return m.language_french();
		case 'german':
			return m.language_german();
		case 'italian':
			return m.language_italian();
		case 'portuguese':
			return m.language_portuguese();
		case 'japanese':
			return m.language_japanese();
		case 'korean':
			return m.language_korean();
		case 'chinese':
			return m.language_chinese();
		case 'russian':
			return m.language_russian();
		case 'arabic':
			return m.language_arabic();
		case 'hindi':
			return m.language_hindi();
		case 'dutch':
			return m.language_dutch();
		case 'swedish':
			return m.language_swedish();
		case 'polish':
			return m.language_polish();
		case 'turkish':
			return m.language_turkish();
		case 'thai':
			return m.language_thai();
		case 'vietnamese':
			return m.language_vietnamese();
		default:
			return value;
	}
}
