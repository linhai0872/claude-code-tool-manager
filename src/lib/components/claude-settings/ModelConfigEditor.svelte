<script lang="ts">
	import {
		CLAUDE_MODELS,
		AVAILABLE_MODEL_SHORTCUTS,
		OUTPUT_STYLES,
		COMMON_LANGUAGES
	} from '$lib/types';
	import type { ClaudeSettings } from '$lib/types';
	import { CustomSelect } from '$lib/components/shared';
	import { Save } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import {
		getClaudeModelDescription,
		getClaudeModelLabel,
		getCommonLanguageLabel,
		getModelShortcutLabel,
		getOutputStyleLabel
	} from '$lib/utils/modelConfigI18n';

	type Props = {
		settings: ClaudeSettings;
		onsave: (settings: ClaudeSettings) => void;
	};

	let { settings, onsave }: Props = $props();

	let model = $state(settings.model ?? '');
	let availableModels = $state<string[]>([...settings.availableModels]);
	let outputStyle = $state(settings.outputStyle ?? '');
	let language = $state(settings.language ?? '');
	let alwaysThinkingEnabled = $state<boolean | undefined>(settings.alwaysThinkingEnabled);

	// Reset local state when settings prop changes
	$effect(() => {
		model = settings.model ?? '';
		availableModels = [...settings.availableModels];
		outputStyle = settings.outputStyle ?? '';
		language = settings.language ?? '';
		alwaysThinkingEnabled = settings.alwaysThinkingEnabled;
	});

	function handleSave() {
		onsave({
			...settings,
			model: model || undefined,
			availableModels,
			outputStyle: outputStyle || undefined,
			language: language || undefined,
			alwaysThinkingEnabled
		});
	}

	function toggleAvailableModel(shortcut: string) {
		if (availableModels.includes(shortcut)) {
			availableModels = availableModels.filter((m) => m !== shortcut);
		} else {
			availableModels = [...availableModels, shortcut];
		}
	}

</script>

<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
	<h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">{m.settings_model_title()}</h3>

	<div class="space-y-4">
		<!-- Model -->
		<div>
			<label
				for="model-select"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
			>
				{m.settings_model_default_label()}
			</label>
			<CustomSelect
				id="model-select"
				bind:value={model}
				options={[
					{ value: '', label: m.label_not_set_default() },
					...CLAUDE_MODELS.map((mo) => ({
						value: mo.value,
						label: `${getClaudeModelLabel(mo.value, mo.label)} — ${getClaudeModelDescription(mo.value, mo.description)}`
					}))
				]}
			/>
		</div>

		<!-- Available Models -->
		<div>
			<p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				{m.settings_model_available_label()}
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
				{m.settings_model_available_desc()}
			</p>
			<div class="flex flex-wrap gap-2">
				{#each AVAILABLE_MODEL_SHORTCUTS as shortcut}
					{@const isSelected = availableModels.includes(shortcut.value)}
					<button
						onclick={() => toggleAvailableModel(shortcut.value)}
						class="px-3 py-1.5 text-sm rounded-md border transition-colors
							{isSelected
							? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
							: 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}"
					>
						{getModelShortcutLabel(shortcut.value)}
					</button>
				{/each}
			</div>
		</div>

		<!-- Output Style -->
		<div>
			<label
				for="output-style-select"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
			>
				{m.settings_model_output_style_label()}
			</label>
			<CustomSelect
				id="output-style-select"
				bind:value={outputStyle}
				options={OUTPUT_STYLES.map((s) => ({ value: s.value, label: getOutputStyleLabel(s.value) }))}
			/>
		</div>

		<!-- Language -->
		<div>
			<label
				for="language-select"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
			>
				{m.settings_model_language_label()}
			</label>
			<CustomSelect
				id="language-select"
				bind:value={language}
				searchable
				options={COMMON_LANGUAGES.map((l) => ({ value: l.value, label: getCommonLanguageLabel(l.value) }))}
			/>
		</div>

		<!-- Extended Thinking -->
		<div>
			<label
				for="thinking-select"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
			>
				{m.settings_model_thinking_label()}
			</label>
			<CustomSelect
				id="thinking-select"
				value={alwaysThinkingEnabled === undefined ? '' : String(alwaysThinkingEnabled)}
				onchange={(val) => {
					alwaysThinkingEnabled = val === '' ? undefined : val === 'true';
				}}
				options={[
					{ value: '', label: m.label_not_set_default() },
					{ value: 'true', label: m.settings_model_thinking_always() },
					{ value: 'false', label: m.label_disabled() }
				]}
			/>
		</div>
	</div>

	<div class="mt-5 flex justify-end">
		<button onclick={handleSave} class="btn btn-primary">
			<Save class="w-4 h-4 mr-2" />
			{m.settings_model_save_btn()}
		</button>
	</div>
</div>
