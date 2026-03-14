import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = [
	'src/routes',
	'src/lib/components',
	'src/lib/types',
	'src/lib/stores',
	'src/lib/utils'
];

const MAX_RESULTS = Number(process.argv.find((arg) => arg.startsWith('--max='))?.split('=')[1] ?? 200);

const TEMPLATE_PATTERNS = [
	{
		kind: 'template-attr',
		regex: /(placeholder|title|aria-label)=["']([^"'\n]*[A-Za-z][^"'\n]*)["']/g
	},
	{
		kind: 'template-text',
		regex: />\s*([A-Za-z][A-Za-z0-9 ,:/().&+_\-%]*?)\s*</g
	}
];

const METADATA_PATTERNS = [
	{
		kind: 'metadata',
		regex: /\b(label|description|name|matcherHint):\s*['"]([^'"\n]*[A-Za-z][^'"\n]*)['"]/g
	}
];

function shouldSkipFile(filePath) {
	return filePath.includes(`${path.sep}paraglide${path.sep}`) || filePath.includes(`${path.sep}node_modules${path.sep}`);
}

function isRelevantExtension(filePath) {
	return filePath.endsWith('.svelte') || filePath.endsWith('.ts');
}

function isLikelyNoise(value) {
	const trimmed = value.trim();
	if (!trimmed) return true;
	if (/^[A-Z]$/.test(trimmed)) return true;
	if (/^(bg|text|border|hover|dark|flex|grid|rounded|px|py|min|max|w|h)-/.test(trimmed)) return true;
	if (/^(ctrl|alt|shift|meta|escape|enter|tab|space|backspace|delete|up|down|left|right|home|end|pageup|pagedown)$/i.test(trimmed)) return true;
	if (/^[A-Za-z0-9_-]+$/.test(trimmed) && trimmed === trimmed.toLowerCase() && !trimmed.includes(' ')) return true;
	if (/^https?:\/\//.test(trimmed)) return true;
	if (/^[A-Za-z0-9_/-]+\.[A-Za-z0-9]+$/.test(trimmed) && !trimmed.includes(' ')) return true;
	return false;
}

function priorityFor(filePath, kind) {
	if (filePath.endsWith('.svelte') && kind !== 'metadata') return 'P0';
	if (filePath.includes(`${path.sep}types${path.sep}`) || filePath.includes(`${path.sep}stores${path.sep}`) || filePath.includes(`${path.sep}utils${path.sep}`)) return 'P1';
	return 'P2';
}

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (shouldSkipFile(fullPath)) continue;
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
			continue;
		}
		if (entry.isFile() && isRelevantExtension(fullPath)) {
			files.push(fullPath);
		}
	}

	return files;
}

function lineNumberAt(content, index) {
	return content.slice(0, index).split('\n').length;
}

async function collectCandidates(filePath) {
	const content = await readFile(filePath, 'utf8');
	const patterns = filePath.endsWith('.svelte') ? [...TEMPLATE_PATTERNS, ...METADATA_PATTERNS] : METADATA_PATTERNS;
	const hits = [];

	for (const pattern of patterns) {
		for (const match of content.matchAll(pattern.regex)) {
			const value = (match[2] ?? match[1] ?? '').trim();
			if (isLikelyNoise(value)) continue;
			hits.push({
				file: path.relative(ROOT, filePath),
				line: lineNumberAt(content, match.index ?? 0),
				kind: pattern.kind,
				priority: priorityFor(filePath, pattern.kind),
				value
			});
		}
	}

	return hits;
}

function formatGroup(priority, candidates) {
	if (candidates.length === 0) return '';
	const lines = [`## ${priority} (${candidates.length})`];
	for (const candidate of candidates) {
		lines.push(`- ${candidate.file}:${candidate.line} [${candidate.kind}] ${candidate.value}`);
	}
	return lines.join('\n');
}

async function main() {
	const allFiles = [];
	for (const target of TARGETS) {
		const fullPath = path.join(ROOT, target);
		try {
			const info = await stat(fullPath);
			if (info.isDirectory()) {
				allFiles.push(...(await walk(fullPath)));
			}
		} catch {
			// ignore missing targets
		}
	}

	const candidateLists = await Promise.all(allFiles.map(collectCandidates));
	const candidates = candidateLists.flat().slice(0, MAX_RESULTS);
	const grouped = {
		P0: candidates.filter((item) => item.priority === 'P0'),
		P1: candidates.filter((item) => item.priority === 'P1'),
		P2: candidates.filter((item) => item.priority === 'P2')
	};

	console.log(`# i18n candidate audit`);
	console.log(`Scanned ${allFiles.length} files, showing up to ${MAX_RESULTS} candidates.\n`);
	console.log(formatGroup('P0', grouped.P0));
	console.log(grouped.P0.length ? '' : '## P0 (0)\n');
	console.log(formatGroup('P1', grouped.P1));
	console.log(grouped.P1.length ? '' : '## P1 (0)\n');
	console.log(formatGroup('P2', grouped.P2));
	if (!grouped.P2.length) {
		console.log('## P2 (0)');
	}
}

await main();
