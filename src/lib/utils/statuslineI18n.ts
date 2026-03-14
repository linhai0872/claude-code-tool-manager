import * as m from '$lib/paraglide/messages.js';
import type { SegmentColor, SegmentType } from '$lib/types';

export function getStatuslineSegmentLabel(type: SegmentType): string {
	switch (type) {
		case 'model':
			return m.statusline_segment_model_label();
		case 'cost':
			return m.statusline_segment_cost_label();
		case 'context':
			return m.statusline_segment_context_label();
		case 'context_remaining':
			return m.statusline_segment_context_remaining_label();
		case 'cwd':
			return m.statusline_segment_cwd_label();
		case 'project_dir':
			return m.statusline_segment_project_dir_label();
		case 'tokens_in':
			return m.statusline_segment_tokens_in_label();
		case 'tokens_out':
			return m.statusline_segment_tokens_out_label();
		case 'duration':
			return m.statusline_segment_duration_label();
		case 'api_duration':
			return m.statusline_segment_api_duration_label();
		case 'lines_changed':
			return m.statusline_segment_lines_changed_label();
		case 'git_branch':
			return m.statusline_segment_git_branch_label();
		case 'git_status':
			return m.statusline_segment_git_status_label();
		case 'session_id':
			return m.statusline_segment_session_id_label();
		case 'version':
			return m.statusline_segment_version_label();
		case 'agent_name':
			return m.statusline_segment_agent_name_label();
		case 'five_hour_usage':
			return m.statusline_segment_five_hour_usage_label();
		case 'weekly_usage':
			return m.statusline_segment_weekly_usage_label();
		case 'vim_mode':
			return m.statusline_segment_vim_mode_label();
		case 'separator':
			return m.statusline_segment_separator_label();
		case 'line_break':
			return m.statusline_segment_line_break_label();
		case 'custom_text':
			return m.statusline_segment_custom_text_label();
	}
}

export function getStatuslineSegmentDescription(type: SegmentType): string {
	switch (type) {
		case 'model':
			return m.statusline_segment_model_desc();
		case 'cost':
			return m.statusline_segment_cost_desc();
		case 'context':
			return m.statusline_segment_context_desc();
		case 'context_remaining':
			return m.statusline_segment_context_remaining_desc();
		case 'cwd':
			return m.statusline_segment_cwd_desc();
		case 'project_dir':
			return m.statusline_segment_project_dir_desc();
		case 'tokens_in':
			return m.statusline_segment_tokens_in_desc();
		case 'tokens_out':
			return m.statusline_segment_tokens_out_desc();
		case 'duration':
			return m.statusline_segment_duration_desc();
		case 'api_duration':
			return m.statusline_segment_api_duration_desc();
		case 'lines_changed':
			return m.statusline_segment_lines_changed_desc();
		case 'git_branch':
			return m.statusline_segment_git_branch_desc();
		case 'git_status':
			return m.statusline_segment_git_status_desc();
		case 'session_id':
			return m.statusline_segment_session_id_desc();
		case 'version':
			return m.statusline_segment_version_desc();
		case 'agent_name':
			return m.statusline_segment_agent_name_desc();
		case 'five_hour_usage':
			return m.statusline_segment_five_hour_usage_desc();
		case 'weekly_usage':
			return m.statusline_segment_weekly_usage_desc();
		case 'vim_mode':
			return m.statusline_segment_vim_mode_desc();
		case 'separator':
			return m.statusline_segment_separator_desc();
		case 'line_break':
			return m.statusline_segment_line_break_desc();
		case 'custom_text':
			return m.statusline_segment_custom_text_desc();
	}
}

export function getStatuslineSegmentFormatLabel(type: SegmentType, format: string, fallback: string): string {
	switch (type) {
		case 'model':
			if (format === 'short') return m.statusline_segment_model_format_short();
			if (format === 'full') return m.statusline_segment_model_format_full();
			return fallback;
		case 'cost':
			if (format === '$0.00') return m.statusline_segment_cost_format_standard();
			if (format === '$0.0000') return m.statusline_segment_cost_format_precise();
			return fallback;
		case 'context':
			if (format === 'percentage') return m.statusline_segment_context_format_percentage();
			if (format === 'fraction') return m.statusline_segment_context_format_fraction();
			if (format === 'bar') return m.statusline_segment_context_format_bar();
			return fallback;
		case 'context_remaining':
			if (format === 'percentage') return m.statusline_segment_context_remaining_format_percentage();
			if (format === 'bar') return m.statusline_segment_context_remaining_format_bar();
			return fallback;
		case 'cwd':
			if (format === 'basename') return m.statusline_segment_cwd_format_basename();
			if (format === 'short') return m.statusline_segment_cwd_format_short();
			if (format === 'full') return m.statusline_segment_cwd_format_full();
			return fallback;
		case 'project_dir':
			if (format === 'basename') return m.statusline_segment_project_dir_format_basename();
			if (format === 'full') return m.statusline_segment_project_dir_format_full();
			return fallback;
		case 'tokens_in':
			if (format === 'compact') return m.statusline_segment_tokens_in_format_compact();
			if (format === 'full') return m.statusline_segment_tokens_in_format_full();
			return fallback;
		case 'tokens_out':
			if (format === 'compact') return m.statusline_segment_tokens_out_format_compact();
			if (format === 'full') return m.statusline_segment_tokens_out_format_full();
			return fallback;
		case 'duration':
			if (format === 'short') return m.statusline_segment_duration_format_short();
			if (format === 'hms') return m.statusline_segment_duration_format_hms();
			return fallback;
		case 'api_duration':
			if (format === 'short') return m.statusline_segment_api_duration_format_short();
			if (format === 'hms') return m.statusline_segment_api_duration_format_hms();
			return fallback;
		case 'lines_changed':
			if (format === 'both') return m.statusline_segment_lines_changed_format_both();
			if (format === 'net') return m.statusline_segment_lines_changed_format_net();
			return fallback;
		case 'git_status':
			if (format === 'compact') return m.statusline_segment_git_status_format_compact();
			if (format === 'verbose') return m.statusline_segment_git_status_format_verbose();
			return fallback;
		case 'session_id':
			if (format === 'short') return m.statusline_segment_session_id_format_short();
			if (format === 'full') return m.statusline_segment_session_id_format_full();
			return fallback;
		case 'five_hour_usage':
			if (format === 'text') return m.statusline_segment_five_hour_usage_format_text();
			if (format === 'bar') return m.statusline_segment_five_hour_usage_format_bar();
			if (format === 'percent_only') return m.statusline_segment_five_hour_usage_format_percent_only();
			return fallback;
		case 'weekly_usage':
			if (format === 'text') return m.statusline_segment_weekly_usage_format_text();
			if (format === 'bar') return m.statusline_segment_weekly_usage_format_bar();
			if (format === 'percent_only') return m.statusline_segment_weekly_usage_format_percent_only();
			return fallback;
		default:
			return fallback;
	}
}

export function getStatuslineColorLabel(color: SegmentColor): string {
	switch (color) {
		case 'red':
			return m.statusline_color_red();
		case 'green':
			return m.statusline_color_green();
		case 'yellow':
			return m.statusline_color_yellow();
		case 'blue':
			return m.statusline_color_blue();
		case 'magenta':
			return m.statusline_color_magenta();
		case 'cyan':
			return m.statusline_color_cyan();
		case 'white':
			return m.statusline_color_white();
		case 'bright_red':
			return m.statusline_color_bright_red();
		case 'bright_green':
			return m.statusline_color_bright_green();
		case 'bright_yellow':
			return m.statusline_color_bright_yellow();
		case 'bright_blue':
			return m.statusline_color_bright_blue();
		case 'bright_magenta':
			return m.statusline_color_bright_magenta();
		case 'bright_cyan':
			return m.statusline_color_bright_cyan();
		case 'bright_white':
			return m.statusline_color_bright_white();
		case 'gray':
			return m.statusline_color_gray();
	}
}
