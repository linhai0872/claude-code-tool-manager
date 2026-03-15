<script lang="ts">
	import type { CreateSkillRequest, Skill } from '$lib/types';
	import { CustomSelect } from '$lib/components/shared';
	import * as m from '$lib/paraglide/messages.js';
	import { parseSkillMarkdown } from '$lib/utils/markdownParser';
	import { Clipboard, Check, AlertCircle, FileUp, TriangleAlert } from 'lucide-svelte';

	// Validation constants (matching official Claude Code documentation)
	const MAX_NAME_LENGTH = 64;
	const MAX_DESCRIPTION_LENGTH = 1024;
	const RECOMMENDED_MAX_CONTENT_LINES = 500;
	const RESERVED_WORDS = ['anthropic', 'claude'];
	const NAME_PATTERN = /^[a-z0-9-]+$/;

	type Props = {
		initialValues?: Partial<Skill>;
		onSubmit: (values: CreateSkillRequest) => void;
		onCancel: () => void;
	};

	let { initialValues = {}, onSubmit, onCancel }: Props = $props();

	// Form state
	let name = $state(initialValues.name ?? '');
	let description = $state(initialValues.description ?? '');
	let content = $state(initialValues.content ?? '');
	let allowedToolsInput = $state(initialValues.allowedTools?.join(', ') ?? '');
	let model = $state(initialValues.model ?? '');
	let disableModelInvocation = $state(initialValues.disableModelInvocation ?? false);
	let tagsInput = $state(initialValues.tags?.join(', ') ?? '');

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});
	let warnings = $state<Record<string, string>>({});

	// Import state
	let importStatus = $state<'idle' | 'success' | 'error'>('idle');
	let importMessage = $state('');

	function applyParsedSkill(parsed: { name?: string; description?: string; content: string; allowedTools?: string[]; model?: string; disableModelInvocation?: boolean; tags?: string[] }) {
		if (parsed.name) name = parsed.name;
		if (parsed.description) description = parsed.description;
		content = parsed.content;
		if (parsed.allowedTools) allowedToolsInput = parsed.allowedTools.join(', ');
		if (parsed.model) model = parsed.model;
		if (parsed.disableModelInvocation !== undefined) disableModelInvocation = parsed.disableModelInvocation;
		if (parsed.tags) tagsInput = parsed.tags.join(', ');

		importStatus = 'success';
		importMessage = parsed.name ? m.skill_import_success_name({ name: parsed.name }) : m.skill_import_success();

		setTimeout(() => {
			importStatus = 'idle';
			importMessage = '';
		}, 3000);
	}

	async function handlePaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text');
		if (!text) return;

		const result = parseSkillMarkdown(text);

		if (result.success && result.data) {
			if (result.data.name) {
				e.preventDefault();
				applyParsedSkill(result.data);
			}
		}
	}

	async function handlePasteFromClipboard() {
		try {
			const text = await navigator.clipboard.readText();
			const result = parseSkillMarkdown(text);

			if (result.success && result.data) {
				applyParsedSkill(result.data);
			} else {
				importStatus = 'error';
				importMessage = result.error ?? m.skill_import_parse_failed();
				setTimeout(() => {
					importStatus = 'idle';
					importMessage = '';
				}, 3000);
			}
		} catch {
			importStatus = 'error';
			importMessage = m.skill_import_clipboard_failed();
			setTimeout(() => {
				importStatus = 'idle';
				importMessage = '';
			}, 3000);
		}
	}

	async function handleFileImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.md,.markdown,.txt';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			try {
				const text = await file.text();
				const result = parseSkillMarkdown(text);

				if (result.success && result.data) {
					applyParsedSkill(result.data);
				} else {
					importStatus = 'error';
					importMessage = result.error ?? m.skill_import_file_parse_failed();
					setTimeout(() => {
						importStatus = 'idle';
						importMessage = '';
					}, 3000);
				}
			} catch {
				importStatus = 'error';
				importMessage = m.skill_import_file_read_failed();
				setTimeout(() => {
					importStatus = 'idle';
					importMessage = '';
				}, 3000);
			}
		};
		input.click();
	}

	function validate(): boolean {
		errors = {};
		warnings = {};
		const trimmedName = name.trim();
		const trimmedDescription = description.trim();
		const trimmedContent = content.trim();

		if (!trimmedName) {
			errors.name = m.validation_name_required();
		} else if (trimmedName.length > MAX_NAME_LENGTH) {
			errors.name = m.validation_name_max_length({ max: MAX_NAME_LENGTH, current: trimmedName.length });
		} else if (!NAME_PATTERN.test(trimmedName)) {
			errors.name = m.validation_name_pattern();
		} else if (trimmedName.includes('<') || trimmedName.includes('>')) {
			errors.name = m.validation_name_no_xml();
		} else {
			const nameLower = trimmedName.toLowerCase();
			for (const reserved of RESERVED_WORDS) {
				if (nameLower.includes(reserved)) {
					errors.name = m.validation_name_reserved({ word: reserved });
					break;
				}
			}
		}

		if (trimmedDescription) {
			if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
				errors.description = m.validation_description_max_length({ max: MAX_DESCRIPTION_LENGTH, current: trimmedDescription.length });
			} else if (trimmedDescription.includes('<') || trimmedDescription.includes('>')) {
				errors.description = m.validation_description_no_xml();
			}
		}

		if (!trimmedContent) {
			errors.content = m.validation_content_required();
		} else {
			const lineCount = trimmedContent.split('\n').length;
			if (lineCount > RECOMMENDED_MAX_CONTENT_LINES) {
				warnings.content = m.validation_content_lines_warning_split({ count: lineCount, max: RECOMMENDED_MAX_CONTENT_LINES });
			}
		}

		return Object.keys(errors).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		const allowedTools = allowedToolsInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);

		const tags = tagsInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);

		const request: CreateSkillRequest = {
			name: name.trim(),
			description: description.trim() || undefined,
			content: content.trim(),
			allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
			model: model.trim() || undefined,
			disableModelInvocation: disableModelInvocation || undefined,
			tags: tags.length > 0 ? tags : undefined
		};

		onSubmit(request);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6" onpaste={handlePaste}>
	<!-- Import Section -->
	<div class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				{#if importStatus === 'success'}
					<div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
						<Check class="w-4 h-4 text-green-600 dark:text-green-400" />
					</div>
				{:else if importStatus === 'error'}
					<div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
						<AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
					</div>
				{:else}
					<div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
						<Clipboard class="w-4 h-4 text-gray-500 dark:text-gray-400" />
					</div>
				{/if}
				<div>
					{#if importStatus !== 'idle'}
						<p class="text-sm font-medium {importStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
							{importMessage}
						</p>
					{:else}
						<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
							{m.skill_import_markdown()}
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							{m.skill_import_markdown_hint()}
						</p>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={handleFileImport}
					class="btn btn-secondary text-sm"
				>
					<FileUp class="w-4 h-4 mr-1.5" />
					{m.label_file()}
				</button>
				<button
					type="button"
					onclick={handlePasteFromClipboard}
					class="btn btn-secondary text-sm"
				>
					<Clipboard class="w-4 h-4 mr-1.5" />
					{m.label_paste()}
				</button>
			</div>
		</div>
	</div>

	<!-- Name -->
	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_name()} <span class="text-red-500">*</span>
		</label>
		<input
			type="text"
			id="name"
			bind:value={name}
			class="input mt-1"
			class:border-red-500={errors.name}
			placeholder={m.placeholder_skill_name()}
		/>
		{#if errors.name}
			<p class="mt-1 text-sm text-red-500">{errors.name}</p>
		{:else}
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
				{m.skill_name_hint({ name: name || 'name' })}
				<span class="text-gray-400 dark:text-gray-500">&nbsp;·&nbsp;{m.skill_name_rules()}</span>
			</p>
		{/if}
	</div>

	<!-- Description -->
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_description()}
		</label>
		<input
			type="text"
			id="description"
			bind:value={description}
			class="input mt-1"
			class:border-red-500={errors.description}
			placeholder={m.placeholder_skill_description()}
		/>
		{#if errors.description}
			<p class="mt-1 text-sm text-red-500">{errors.description}</p>
		{:else}
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
				{m.skill_description_hint({ max: MAX_DESCRIPTION_LENGTH })}
			</p>
		{/if}
	</div>

	<!-- Allowed Tools -->
	<div>
		<label for="allowedTools" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_allowed_tools()}
		</label>
		<input
			type="text"
			id="allowedTools"
			bind:value={allowedToolsInput}
			class="input mt-1"
			placeholder={m.placeholder_allowed_tools_command()}
		/>
		<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
			{m.skill_allowed_tools_hint()}
		</p>
	</div>

	<!-- Model Selection -->
	<div>
		<label for="model" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_model_override()}
		</label>
		<CustomSelect
			id="model"
			bind:value={model}
			class="mt-1"
			options={[
				{ value: '', label: m.command_model_default() },
				{ value: 'opus', label: m.command_model_opus() },
				{ value: 'sonnet', label: m.command_model_sonnet() },
				{ value: 'haiku', label: m.command_model_haiku() }
			]}
		/>
		<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
			{m.skill_model_hint()}
		</p>
	</div>

	<!-- Disable Model Invocation -->
	<div class="flex items-start gap-3">
		<input
			type="checkbox"
			id="disableModelInvocation"
			bind:checked={disableModelInvocation}
			class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
		/>
		<div>
			<label for="disableModelInvocation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				{m.skill_disable_model_invocation()}
			</label>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				{m.skill_disable_model_invocation_hint()}
			</p>
		</div>
	</div>

	<!-- Content -->
	<div>
		<label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_skill_instructions()} <span class="text-red-500">*</span>
		</label>
		<textarea
			id="content"
			bind:value={content}
			rows={12}
			class="input mt-1 font-mono text-sm resize-y"
			class:border-red-500={errors.content}
			placeholder={m.placeholder_skill_content_template()}
		></textarea>
		{#if errors.content}
			<p class="mt-1 text-sm text-red-500">{errors.content}</p>
		{:else}
			{#if warnings.content}
				<div class="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
					<div class="flex items-start gap-2">
						<TriangleAlert class="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
						<p class="text-sm text-amber-700 dark:text-amber-300">{warnings.content}</p>
					</div>
				</div>
			{/if}
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
				{m.skill_content_hint({ max: RECOMMENDED_MAX_CONTENT_LINES })}
			</p>
		{/if}
	</div>

	<!-- Tags -->
	<div>
		<label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_tags()}
		</label>
		<input
			type="text"
			id="tags"
			bind:value={tagsInput}
			class="input mt-1"
			placeholder={m.placeholder_skill_tags()}
		/>
		<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
			{m.skill_tags_hint()}
		</p>
	</div>

	<!-- Actions -->
	<div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
		<button type="button" onclick={onCancel} class="btn btn-secondary">
			{m.action_cancel()}
		</button>
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{initialValues.name ? m.skill_action_update() : m.skill_action_create()}
		</button>
	</div>
</form>
