import * as m from '$lib/paraglide/messages.js';

export function getEnvVarDescriptionLabel(key: string, fallback: string): string {
	switch (key) {
		case 'ANTHROPIC_API_KEY':
			return m.env_var_desc_ANTHROPIC_API_KEY();
		case 'ANTHROPIC_AUTH_TOKEN':
			return m.env_var_desc_ANTHROPIC_AUTH_TOKEN();
		case 'CLAUDE_CODE_API_KEY':
			return m.env_var_desc_CLAUDE_CODE_API_KEY();
		case 'ANTHROPIC_MODEL':
			return m.env_var_desc_ANTHROPIC_MODEL();
		case 'ANTHROPIC_SMALL_FAST_MODEL':
			return m.env_var_desc_ANTHROPIC_SMALL_FAST_MODEL();
		case 'CLAUDE_CODE_MAX_MODEL':
			return m.env_var_desc_CLAUDE_CODE_MAX_MODEL();
		case 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC':
			return m.env_var_desc_CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC();
		case 'ANTHROPIC_BASE_URL':
			return m.env_var_desc_ANTHROPIC_BASE_URL();
		case 'HTTP_PROXY':
			return m.env_var_desc_HTTP_PROXY();
		case 'HTTPS_PROXY':
			return m.env_var_desc_HTTPS_PROXY();
		case 'NO_PROXY':
			return m.env_var_desc_NO_PROXY();
		case 'CLAUDE_CODE_API_TIMEOUT':
			return m.env_var_desc_CLAUDE_CODE_API_TIMEOUT();
		case 'AWS_ACCESS_KEY_ID':
			return m.env_var_desc_AWS_ACCESS_KEY_ID();
		case 'AWS_SECRET_ACCESS_KEY':
			return m.env_var_desc_AWS_SECRET_ACCESS_KEY();
		case 'CLAUDE_CODE_MAX_TURNS':
			return m.env_var_desc_CLAUDE_CODE_MAX_TURNS();
		case 'CLAUDE_CODE_MAX_OUTPUT_TOKENS':
			return m.env_var_desc_CLAUDE_CODE_MAX_OUTPUT_TOKENS();
		case 'CLAUDE_CODE_BUDGET_TOKENS':
			return m.env_var_desc_CLAUDE_CODE_BUDGET_TOKENS();
		case 'CLAUDE_CODE_USE_BEDROCK':
			return m.env_var_desc_CLAUDE_CODE_USE_BEDROCK();
		case 'CLAUDE_CODE_USE_VERTEX':
			return m.env_var_desc_CLAUDE_CODE_USE_VERTEX();
		case 'AWS_REGION':
			return m.env_var_desc_AWS_REGION();
		case 'AWS_SESSION_TOKEN':
			return m.env_var_desc_AWS_SESSION_TOKEN();
		case 'AWS_PROFILE':
			return m.env_var_desc_AWS_PROFILE();
		case 'ANTHROPIC_BEDROCK_BASE_URL':
			return m.env_var_desc_ANTHROPIC_BEDROCK_BASE_URL();
		case 'CLOUD_ML_REGION':
			return m.env_var_desc_CLOUD_ML_REGION();
		case 'ANTHROPIC_VERTEX_PROJECT_ID':
			return m.env_var_desc_ANTHROPIC_VERTEX_PROJECT_ID();
		case 'ANTHROPIC_VERTEX_BASE_URL':
			return m.env_var_desc_ANTHROPIC_VERTEX_BASE_URL();
		case 'CLAUDE_CODE_OUTPUT_FORMAT':
			return m.env_var_desc_CLAUDE_CODE_OUTPUT_FORMAT();
		case 'CLAUDE_CODE_THEME':
			return m.env_var_desc_CLAUDE_CODE_THEME();
		case 'CLAUDE_CODE_TERMINAL_EMULATOR':
			return m.env_var_desc_CLAUDE_CODE_TERMINAL_EMULATOR();
		case 'CLAUDE_CODE_SANDBOX_ENABLED':
			return m.env_var_desc_CLAUDE_CODE_SANDBOX_ENABLED();
		case 'CLAUDE_CODE_SANDBOX_DEBUG':
			return m.env_var_desc_CLAUDE_CODE_SANDBOX_DEBUG();
		case 'CLAUDE_CODE_GIT_AUTHOR_NAME':
			return m.env_var_desc_CLAUDE_CODE_GIT_AUTHOR_NAME();
		case 'CLAUDE_CODE_GIT_AUTHOR_EMAIL':
			return m.env_var_desc_CLAUDE_CODE_GIT_AUTHOR_EMAIL();
		case 'CLAUDE_CODE_MCP_TIMEOUT':
			return m.env_var_desc_CLAUDE_CODE_MCP_TIMEOUT();
		case 'CLAUDE_CODE_MCP_AUTO_START':
			return m.env_var_desc_CLAUDE_CODE_MCP_AUTO_START();
		case 'CLAUDE_CODE_DEBUG':
			return m.env_var_desc_CLAUDE_CODE_DEBUG();
		case 'CLAUDE_CODE_LOG_LEVEL':
			return m.env_var_desc_CLAUDE_CODE_LOG_LEVEL();
		case 'CLAUDE_CODE_LOG_FILE':
			return m.env_var_desc_CLAUDE_CODE_LOG_FILE();
		case 'CLAUDE_CODE_SKIP_UPDATE_CHECK':
			return m.env_var_desc_CLAUDE_CODE_SKIP_UPDATE_CHECK();
		case 'CLAUDE_CODE_CONFIG_DIR':
			return m.env_var_desc_CLAUDE_CODE_CONFIG_DIR();
		case 'CLAUDE_CODE_CACHE_DIR':
			return m.env_var_desc_CLAUDE_CODE_CACHE_DIR();
		case 'TMPDIR':
			return m.env_var_desc_TMPDIR();
		default:
			return fallback;
	}
}

export function getEnvVarCategoryLabel(category: string): string {
	switch (category) {
		case 'API & Auth':
			return m.env_var_cat_API_Auth();
		case 'Model & Provider':
			return m.env_var_cat_Model_Provider();
		case 'Network & Proxy':
			return m.env_var_cat_Network_Proxy();
		case 'Behavior & Limits':
			return m.env_var_cat_Behavior_Limits();
		case 'AWS Bedrock':
			return m.env_var_cat_AWS_Bedrock();
		case 'Google Vertex':
			return m.env_var_cat_Google_Vertex();
		case 'Display & UI':
			return m.env_var_cat_Display_UI();
		case 'Sandbox & Security':
			return m.env_var_cat_Sandbox_Security();
		case 'Git & VCS':
			return m.env_var_cat_Git_VCS();
		case 'MCP':
			return m.env_var_cat_MCP();
		case 'Logging & Debug':
			return m.env_var_cat_Logging_Debug();
		case 'System':
			return m.env_var_cat_System();
		default:
			return category;
	}
}
