<script lang="ts">
	import type { CreateMcpRequest, McpType, Mcp } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';
	import McpTypeSelector from './McpTypeSelector.svelte';
	import { EnvEditor } from '$lib/components/shared';
	import { parseMcpFromClipboard, type ParsedMcp } from '$lib/utils/mcpPasteParser';
	import { Clipboard, Check, AlertCircle } from 'lucide-svelte';

	type Props = {
		initialValues?: Partial<Mcp>;
		onSubmit: (values: CreateMcpRequest) => void;
		onCancel: () => void;
	};

	let { initialValues = {}, onSubmit, onCancel }: Props = $props();

	// Form state
	let name = $state(initialValues.name ?? '');
	let description = $state(initialValues.description ?? '');
	let mcpType = $state<McpType>(initialValues.type ?? 'stdio');

	// stdio fields
	let command = $state(initialValues.command ?? '');
	let args = $state(initialValues.args?.join(' ') ?? '');

	// sse/http fields
	let url = $state(initialValues.url ?? '');
	let headers = $state<Record<string, string>>(
		(initialValues.headers as Record<string, string>) ?? {}
	);

	// Common fields
	let env = $state<Record<string, string>>(
		(initialValues.env as Record<string, string>) ?? {}
	);

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Paste detection state
	let pasteStatus = $state<'idle' | 'success' | 'error'>('idle');
	let pasteMessage = $state('');

	function applyParsedMcp(mcp: ParsedMcp) {
		name = mcp.name;
		mcpType = mcp.type;

		if (mcp.type === 'stdio') {
			command = mcp.command ?? '';
			args = mcp.args?.join(' ') ?? '';
		} else {
			url = mcp.url ?? '';
			if (mcp.headers) {
				headers = mcp.headers;
			}
		}

		if (mcp.env) {
			env = mcp.env;
		}

		pasteStatus = 'success';
		pasteMessage = m.mcp_paste_imported({ name: mcp.name, type: mcp.type });

		// Reset status after 3 seconds
		setTimeout(() => {
			pasteStatus = 'idle';
			pasteMessage = '';
		}, 3000);
	}

	async function handlePaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text');
		if (!text) return;

		const result = parseMcpFromClipboard(text);

		if (result.success && result.mcps.length > 0) {
			e.preventDefault(); // Prevent default paste into focused field
			applyParsedMcp(result.mcps[0]);

			// If multiple MCPs were found, notify user
			if (result.mcps.length > 1) {
				pasteMessage += ` (+${result.mcps.length - 1} ${m.mcp_paste_more_available()})`;
			}
		}
		// If parsing fails, let the default paste behavior happen
	}

	async function handlePasteFromClipboard() {
		try {
			const text = await navigator.clipboard.readText();
			const result = parseMcpFromClipboard(text);

			if (result.success && result.mcps.length > 0) {
				applyParsedMcp(result.mcps[0]);
			} else {
				pasteStatus = 'error';
				pasteMessage = result.error ?? m.mcp_paste_parse_failed();
				setTimeout(() => {
					pasteStatus = 'idle';
					pasteMessage = '';
				}, 3000);
			}
		} catch {
			pasteStatus = 'error';
			pasteMessage = m.mcp_paste_clipboard_failed();
			setTimeout(() => {
				pasteStatus = 'idle';
				pasteMessage = '';
			}, 3000);
		}
	}

	function validate(): boolean {
		errors = {};

		if (!name.trim()) {
			errors.name = m.validation_name_required();
		} else if (!/^[a-zA-Z0-9_-]+$/.test(name.trim())) {
			errors.name = m.validation_name_format();
		}

		if (mcpType === 'stdio') {
			if (!command.trim()) {
				errors.command = m.validation_command_required();
			}
		} else {
			if (!url.trim()) {
				errors.url = m.validation_url_required();
			} else {
				try {
					new URL(url);
				} catch {
					errors.url = m.validation_url_format();
				}
			}
		}

		return Object.keys(errors).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		const request: CreateMcpRequest = {
			name: name.trim(),
			description: description.trim() || undefined,
			type: mcpType,
			command: mcpType === 'stdio' ? command.trim() : undefined,
			args: mcpType === 'stdio' && args.trim() ? args.trim().split(/\s+/) : undefined,
			url: mcpType !== 'stdio' ? url.trim() : undefined,
			headers: mcpType === 'http' && Object.keys(headers).length ? headers : undefined,
			env: Object.keys(env).length ? env : undefined
		};

		onSubmit(request);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6" onpaste={handlePaste} novalidate>
	<!-- Paste Import Section -->
	<div class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				{#if pasteStatus === 'success'}
					<div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
						<Check class="w-4 h-4 text-green-600 dark:text-green-400" />
					</div>
				{:else if pasteStatus === 'error'}
					<div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
						<AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
					</div>
				{:else}
					<div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
						<Clipboard class="w-4 h-4 text-gray-500 dark:text-gray-400" />
					</div>
				{/if}
				<div>
					{#if pasteStatus !== 'idle'}
						<p class="text-sm font-medium {pasteStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
							{pasteMessage}
						</p>
					{:else}
						<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
							{m.mcp_quick_import()}
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							{m.mcp_quick_import_hint()}
						</p>
					{/if}
				</div>
			</div>
			<button
				type="button"
				onclick={handlePasteFromClipboard}
				class="btn btn-secondary text-sm"
			>
				<Clipboard class="w-4 h-4 mr-1.5" />
				{m.mcp_action_paste()}
			</button>
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
			placeholder={m.placeholder_mcp_name()}
		/>
		{#if errors.name}
			<p class="mt-1 text-sm text-red-500">{errors.name}</p>
		{/if}
	</div>

	<!-- Description -->
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			{m.label_description()}
		</label>
		<textarea
			id="description"
			bind:value={description}
			rows={2}
			class="input mt-1 resize-none"
			placeholder={m.placeholder_mcp_description()}
		></textarea>
	</div>

	<!-- Type Selector -->
	<McpTypeSelector bind:value={mcpType} />

	<!-- Type-specific fields -->
	{#if mcpType === 'stdio'}
		<div class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
			<div>
				<label for="command" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.label_command()} <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="command"
					bind:value={command}
					class="input mt-1 font-mono"
					class:border-red-500={errors.command}
					placeholder={m.placeholder_mcp_command()}
				/>
				{#if errors.command}
					<p class="mt-1 text-sm text-red-500">{errors.command}</p>
				{/if}
			</div>

			<div>
				<label for="args" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.label_arguments()}
				</label>
				<input
					type="text"
					id="args"
					bind:value={args}
					class="input mt-1 font-mono"
					placeholder={m.placeholder_mcp_args()}
				/>
				<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
					{m.mcp_args_hint()}
				</p>
			</div>
		</div>
	{:else}
		<div class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
			<div>
				<label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{m.label_url()} <span class="text-red-500">*</span>
				</label>
				<input
					type="url"
					id="url"
					bind:value={url}
					class="input mt-1 font-mono"
					class:border-red-500={errors.url}
					placeholder={mcpType === 'sse' ? m.placeholder_mcp_sse_url() : m.placeholder_mcp_http_url()}
				/>
				{#if errors.url}
					<p class="mt-1 text-sm text-red-500">{errors.url}</p>
				{/if}
			</div>

			{#if mcpType === 'http'}
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{m.label_headers()}
					</label>
					<EnvEditor
						bind:values={headers}
						keyPlaceholder={m.placeholder_header_name()}
						valuePlaceholder={m.placeholder_header_value()}
					/>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Environment Variables -->
	<div>
		<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
			{m.label_env_variables()}
		</label>
		<EnvEditor bind:values={env} />
	</div>

	<!-- Actions -->
	<div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
		<button type="button" onclick={onCancel} class="btn btn-secondary">
			{m.action_cancel()}
		</button>
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{initialValues.name ? m.mcp_action_update() : m.mcp_action_create()}
		</button>
	</div>
</form>
