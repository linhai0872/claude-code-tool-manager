import * as m from '$lib/paraglide/messages.js';

export function getOutcomeLabel(outcome: string): string {
	switch (outcome) {
		case 'fully_achieved':
			return m.analytics_outcome_fully_achieved();
		case 'mostly_achieved':
			return m.analytics_outcome_mostly_achieved();
		case 'partially_achieved':
			return m.analytics_outcome_partially_achieved();
		case 'not_achieved':
			return m.analytics_outcome_not_achieved();
		case 'abandoned':
			return m.analytics_outcome_abandoned();
		case 'unknown':
			return m.analytics_outcome_unknown();
		default:
			return outcome;
	}
}

export function getHelpfulnessLabel(helpfulness: string): string {
	switch (helpfulness) {
		case 'essential':
			return m.analytics_helpfulness_essential();
		case 'very_helpful':
			return m.analytics_helpfulness_very_helpful();
		case 'helpful':
			return m.analytics_helpfulness_helpful();
		case 'slightly_helpful':
			return m.analytics_helpfulness_slightly_helpful();
		case 'not_helpful':
			return m.analytics_helpfulness_not_helpful();
		default:
			return helpfulness;
	}
}

export function getSessionTypeLabel(sessionType: string): string {
	switch (sessionType) {
		case 'single_task':
			return m.analytics_session_type_single_task();
		case 'multi_task':
			return m.analytics_session_type_multi_task();
		case 'exploration':
			return m.analytics_session_type_exploration();
		case 'debugging':
			return m.analytics_session_type_debugging();
		case 'learning':
			return m.analytics_session_type_learning();
		case 'unknown':
			return m.analytics_session_type_unknown();
		default:
			return sessionType;
	}
}

export function getFrictionLabel(friction: string): string {
	switch (friction) {
		case 'tool_failures':
			return m.analytics_friction_tool_failures();
		case 'context_loss':
			return m.analytics_friction_context_loss();
		case 'misunderstanding':
			return m.analytics_friction_misunderstanding();
		case 'slow_response':
			return m.analytics_friction_slow_response();
		case 'permission_issues':
			return m.analytics_friction_permission_issues();
		case 'unclear_instructions':
			return m.analytics_friction_unclear_instructions();
		case 'repeated_attempts':
			return m.analytics_friction_repeated_attempts();
		case 'scope_creep':
			return m.analytics_friction_scope_creep();
		default:
			return friction;
	}
}
