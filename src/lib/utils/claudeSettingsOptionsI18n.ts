import * as m from '$lib/paraglide/messages.js';
import type { MarketplaceSourceType } from '$lib/types';

export function getUiToggleLabel(key: string): string {
	switch (key) {
		case 'showTurnDuration':
			return m.ui_toggle_show_turn_duration();
		case 'spinnerTipsEnabled':
			return m.ui_toggle_spinner_tips();
		case 'terminalProgressBarEnabled':
			return m.ui_toggle_terminal_progress_bar();
		case 'prefersReducedMotion':
			return m.ui_toggle_reduced_motion();
		case 'respectGitignore':
			return m.ui_toggle_respect_gitignore();
		default:
			return key;
	}
}

export function getUiToggleDescription(key: string): string {
	switch (key) {
		case 'showTurnDuration':
			return m.ui_toggle_show_turn_duration_desc();
		case 'spinnerTipsEnabled':
			return m.ui_toggle_spinner_tips_desc();
		case 'terminalProgressBarEnabled':
			return m.ui_toggle_terminal_progress_bar_desc();
		case 'prefersReducedMotion':
			return m.ui_toggle_reduced_motion_desc();
		case 'respectGitignore':
			return m.ui_toggle_respect_gitignore_desc();
		default:
			return key;
	}
}

export function getAutoUpdatesChannelLabel(value: string): string {
	switch (value) {
		case '':
			return m.label_not_set();
		case 'stable':
			return m.session_updates_channel_stable();
		case 'latest':
			return m.session_updates_channel_latest();
		default:
			return value;
	}
}

export function getTeammateModeLabel(value: string): string {
	switch (value) {
		case '':
			return m.label_not_set();
		case 'auto':
			return m.session_teammate_mode_auto();
		case 'in-process':
			return m.session_teammate_mode_in_process();
		case 'tmux':
			return m.session_teammate_mode_tmux();
		default:
			return value;
	}
}

export function getMarketplaceSourceTypeLabel(value: MarketplaceSourceType): string {
	switch (value) {
		case 'github':
			return m.marketplace_source_type_github();
		case 'git':
			return m.marketplace_source_type_git();
		case 'url':
			return m.marketplace_source_type_url();
		case 'npm':
			return m.marketplace_source_type_npm();
		case 'file':
			return m.marketplace_source_type_file();
		case 'directory':
			return m.marketplace_source_type_directory();
		case 'hostPattern':
			return m.marketplace_source_type_host_pattern();
	}
}
