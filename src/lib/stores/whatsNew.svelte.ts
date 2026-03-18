import { getVersion } from '@tauri-apps/api/app';

const LAST_SEEN_VERSION_KEY = 'claude-tool-manager-last-seen-version';
const GITHUB_REPO = 'linhai0872/claude-code-tool-manager';

export interface ReleaseInfo {
	version: string;
	name: string;
	body: string;
	publishedAt: string;
	htmlUrl: string;
}

class WhatsNewState {
	isOpen = $state(false);
	isLoading = $state(false);
	release = $state<ReleaseInfo | null>(null);
	error = $state<string | null>(null);

	async checkForWhatsNew() {
		try {
			const currentVersion = await getVersion();
			const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY);

			// If this is first run or same version, don't show
			if (!lastSeenVersion) {
				// First run - save current version without showing modal
				localStorage.setItem(LAST_SEEN_VERSION_KEY, currentVersion);
				return;
			}

			if (lastSeenVersion === currentVersion) {
				// Same version, nothing new
				return;
			}

			// Version changed - fetch release notes and show modal
			await this.fetchReleaseNotes(currentVersion);
			this.isOpen = true;
		} catch (e) {
			console.error('Failed to check for what\'s new:', e);
		}
	}

	async fetchReleaseNotes(version: string) {
		this.isLoading = true;
		this.error = null;

		try {
			const response = await fetch(
				`https://api.github.com/repos/${GITHUB_REPO}/releases/tags/v${version}`
			);

			if (!response.ok) {
				// Try without 'v' prefix
				const altResponse = await fetch(
					`https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${version}`
				);

				if (!altResponse.ok) {
					throw new Error('Release not found');
				}

				const data = await altResponse.json();
				this.release = this.parseRelease(data);
				return;
			}

			const data = await response.json();
			this.release = this.parseRelease(data);
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Failed to fetch release notes';
			// Still show modal with basic info
			this.release = {
				version,
				name: `Version ${version}`,
				body: 'You\'ve been updated to the latest version! Check the GitHub releases page for details.',
				publishedAt: new Date().toISOString(),
				htmlUrl: `https://github.com/${GITHUB_REPO}/releases`
			};
		} finally {
			this.isLoading = false;
		}
	}

	private parseRelease(data: {
		tag_name: string;
		name: string;
		body: string;
		published_at: string;
		html_url: string;
	}): ReleaseInfo {
		return {
			version: data.tag_name.replace(/^v/, ''),
			name: data.name || `Version ${data.tag_name}`,
			body: data.body || 'No release notes available.',
			publishedAt: data.published_at,
			htmlUrl: data.html_url
		};
	}

	dismiss() {
		this.isOpen = false;
		// Save current version so we don't show again
		if (this.release) {
			localStorage.setItem(LAST_SEEN_VERSION_KEY, this.release.version);
		}
	}

	// For manual viewing (e.g., from settings)
	async showCurrentReleaseNotes() {
		try {
			const currentVersion = await getVersion();
			await this.fetchReleaseNotes(currentVersion);
			this.isOpen = true;
		} catch (e) {
			console.error('Failed to show release notes:', e);
		}
	}
}

export const whatsNew = new WhatsNewState();
