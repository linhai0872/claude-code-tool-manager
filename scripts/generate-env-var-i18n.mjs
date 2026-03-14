import { readFile } from 'node:fs/promises';
import path from 'node:path';

const sourcePath = path.resolve('src/lib/types/claudeSettings.ts');
const source = await readFile(sourcePath, 'utf8');

function sanitizeKey(value) {
	return value.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function extractKnownEnvVars(content) {
	const matches = [...content.matchAll(/\{\s*key:\s*'([^']+)',\s*description:\s*'([^']+)',\s*category:\s*'([^']+)'\s*\}/g)];
	return matches.map(([, key, description, category]) => ({ key, description, category }));
}

const envVars = extractKnownEnvVars(source);
const categories = [...new Set(envVars.map((item) => item.category))];

const enEntries = [];
const zhEntries = [];
const descCases = [];
const catCases = [];

for (const envVar of envVars) {
	const descKey = `env_var_desc_${sanitizeKey(envVar.key)}`;
	enEntries.push(`"${descKey}": "${envVar.description}"`);
	zhEntries.push(`"${descKey}": "TODO: ${envVar.description}"`);
	descCases.push(`\t\tcase '${envVar.key}':\n\t\t\treturn m.${descKey}();`);
}

for (const category of categories) {
	const catKey = `env_var_cat_${sanitizeKey(category)}`;
	enEntries.push(`"${catKey}": "${category}"`);
	zhEntries.push(`"${catKey}": "TODO: ${category}"`);
	catCases.push(`\t\tcase '${category}':\n\t\t\treturn m.${catKey}();`);
}

console.log('## messages/en.json');
console.log(enEntries.map((line) => `\t${line},`).join('\n'));
console.log('\n## messages/zh-CN.json');
console.log(zhEntries.map((line) => `\t${line},`).join('\n'));
console.log('\n## src/lib/utils/envVarI18n.ts');
console.log(`import * as m from '$lib/paraglide/messages.js';

export function getEnvVarDescriptionLabel(key: string): string {
\tswitch (key) {
${descCases.join('\n')}
\t\tdefault:
\t\t\treturn key;
\t}
}

export function getEnvVarCategoryLabel(category: string): string {
\tswitch (category) {
${catCases.join('\n')}
\t\tdefault:
\t\t\treturn category;
\t}
}`);
