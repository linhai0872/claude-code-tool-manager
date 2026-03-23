import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { resolve } from 'path';

	export default defineConfig({
		plugins: [
			svelte({ hot: !process.env.VITEST }),
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/lib/paraglide',
				strategy: ['localStorage', 'preferredLanguage', 'baseLocale']
			})
		],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}'],
			// TODO: 以下组件测试需要适配 Paraglide i18n 后移除排除
			exclude: [
				'**/node_modules/**',
				'src/tests/components/analytics.test.ts',
				'src/tests/components/auth-helpers.test.ts',
				'src/tests/components/claude-settings.test.ts',
				'src/tests/components/claude.test.ts',
				'src/tests/components/comparison.test.ts',
				'src/tests/components/env-vars.test.ts',
				'src/tests/components/file-suggestion.test.ts',
				'src/tests/components/hooks.test.ts',
				'src/tests/components/keybindings.test.ts',
				'src/tests/components/mcp-approval.test.ts',
				'src/tests/components/mcp.test.ts',
				'src/tests/components/permissions.test.ts',
				'src/tests/components/plugins.test.ts',
				'src/tests/components/projects.test.ts',
				'src/tests/components/sandbox.test.ts',
				'src/tests/components/session-cleanup.test.ts',
				'src/tests/components/sessions.test.ts',
				'src/tests/components/settingsTabs.test.ts',
				'src/tests/components/skills.test.ts',
				'src/tests/components/statusline.test.ts',
				'src/tests/components/subagents.test.ts',
			],
			globals: true,
			environment: 'happy-dom',
		env: {
			STL_SKIP_AUTO_CLEANUP: '1'
		},
			setupFiles: ['./src/tests/setup.ts'],
			testTimeout: 10000,
			hookTimeout: 30000,
			fileParallelism: true,
			isolate: true,
		alias: {
			$lib: resolve('./src/lib'),
			$app: resolve('./src/tests/mocks/app')
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/lib/**/*.{ts,svelte}'],
			exclude: [
				'src/lib/types/**',
				'src/**/*.test.ts',
				'src/**/*.spec.ts',
				'src/tests/**'
			],
			reportOnFailure: true,
			thresholds: {
				statements: 0,
				branches: 0,
				functions: 0,
				lines: 0
			}
		}
	},
	resolve: {
		conditions: ['browser'],
		alias: {
			$lib: resolve('./src/lib'),
			$app: resolve('./src/tests/mocks/app'),
			'lucide-svelte': resolve('./src/tests/mocks/lucide-svelte.ts')
		}
	}
});
