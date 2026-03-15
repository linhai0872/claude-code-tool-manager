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
			globals: true,
			environment: 'happy-dom',
			setupFiles: ['./src/tests/setup.ts'],
			testTimeout: 10000,
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
			thresholds: {
				statements: 25,
				branches: 12,
				functions: 25,
				lines: 25
			}
		}
	},
	resolve: {
		conditions: ['browser'],
		alias: {
			$lib: resolve('./src/lib'),
			$app: resolve('./src/tests/mocks/app')
		}
	}
});
