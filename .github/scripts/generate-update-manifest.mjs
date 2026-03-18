/**
 * Generates a combined latest.json for the Tauri updater by scanning
 * the GitHub Release assets for signed artifacts (.sig files).
 *
 * Runs after all platform build jobs complete so it captures all platforms.
 *
 * Required env vars:
 *   GITHUB_TOKEN  - token with contents:write permission
 *   TAG           - release tag, e.g. "v3.4.1"
 *   REPO          - "owner/repo"
 */

const { GITHUB_TOKEN, TAG, REPO } = process.env;
const VERSION = TAG.replace(/^v/, '');

const BASE_URL = `https://api.github.com/repos/${REPO}`;
const HEADERS = {
	Authorization: `token ${GITHUB_TOKEN}`,
	Accept: 'application/vnd.github.v3+json',
	'User-Agent': 'generate-update-manifest',
};

async function fetchJson(url) {
	const res = await fetch(url, { headers: HEADERS });
	if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${await res.text()}`);
	return res.json();
}

async function fetchText(url) {
	const res = await fetch(url, { headers: HEADERS });
	if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
	return res.text();
}

// Map from asset filename patterns to Tauri platform identifiers.
// Only Windows and Linux get updater support (macOS uses Homebrew).
const PLATFORM_PATTERNS = [
	{
		platform: 'windows-x86_64',
		// tauri-action produces NSIS zip for Windows updater
		test: (name) => name.endsWith('.nsis.zip') && !name.endsWith('.sig'),
		sigTest: (name) => name.endsWith('.nsis.zip.sig'),
	},
	{
		platform: 'linux-x86_64',
		// tauri-action produces AppImage tar.gz for Linux updater
		test: (name) => name.endsWith('.AppImage.tar.gz') && !name.endsWith('.sig'),
		sigTest: (name) => name.endsWith('.AppImage.tar.gz.sig'),
	},
];

async function run() {
	// Find the draft release for this tag
	const releases = await fetchJson(`${BASE_URL}/releases`);
	const release = releases.find((r) => r.tag_name === TAG);
	if (!release) throw new Error(`Release not found for tag ${TAG}`);

	const assets = release.assets;
	const platforms = {};

	for (const { platform, test, sigTest } of PLATFORM_PATTERNS) {
		const artifact = assets.find((a) => test(a.name));
		const sigAsset = assets.find((a) => sigTest(a.name));

		if (!artifact || !sigAsset) {
			console.warn(`[warn] Missing artifact or .sig for ${platform}, skipping`);
			continue;
		}

		const signature = await fetchText(sigAsset.browser_download_url);
		platforms[platform] = {
			url: artifact.browser_download_url,
			signature: signature.trim(),
		};
		console.log(`[ok] ${platform}: ${artifact.name}`);
	}

	if (Object.keys(platforms).length === 0) {
		throw new Error('No signed platform artifacts found — aborting manifest upload');
	}

	const manifest = {
		version: VERSION,
		notes: `See https://github.com/${REPO}/releases/tag/${TAG} for details.`,
		pub_date: new Date().toISOString(),
		platforms,
	};

	// Upload latest.json to the release
	const existing = assets.find((a) => a.name === 'latest.json');
	if (existing) {
		await fetch(`${BASE_URL}/releases/assets/${existing.id}`, {
			method: 'DELETE',
			headers: HEADERS,
		});
		console.log('[ok] Deleted existing latest.json');
	}

	const uploadUrl = release.upload_url.replace('{?name,label}', '');
	const uploadRes = await fetch(`${uploadUrl}?name=latest.json`, {
		method: 'POST',
		headers: {
			...HEADERS,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(manifest, null, 2),
	});

	if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
	console.log(`[ok] Uploaded latest.json with platforms: ${Object.keys(platforms).join(', ')}`);
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
