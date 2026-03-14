<script lang="ts">
	import type { CreateStatusLineRequest, StatusLine } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		initialValues?: StatusLine | null;
		onSubmit: (request: CreateStatusLineRequest) => void;
		onCancel: () => void;
	};

	let { initialValues, onSubmit, onCancel }: Props = $props();

	let name = $state(initialValues?.name ?? '');
	let description = $state(initialValues?.description ?? '');
	let rawCommand = $state(initialValues?.rawCommand ?? '');
	let padding = $state(initialValues?.padding ?? 0);

	function handleSubmit() {
		if (!name.trim() || !rawCommand.trim()) return;
		onSubmit({
			name: name.trim(),
			description: description.trim() || null,
			statuslineType: 'raw',
			rawCommand: rawCommand.trim(),
			padding
		});
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
	<div>
		<label for="statusline-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{m.label_name()}</label>
		<input
			id="statusline-name"
			type="text"
			bind:value={name}
			placeholder={m.placeholder_statusline_name()}
			required
			class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
		/>
	</div>

	<div>
		<label for="statusline-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{m.label_description()}</label>
		<input
			id="statusline-description"
			type="text"
			bind:value={description}
			placeholder={m.placeholder_optional_description()}
			class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
		/>
	</div>

	<div>
		<label for="statusline-command" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{m.label_command()}</label>
		<input
			id="statusline-command"
			type="text"
			bind:value={rawCommand}
			placeholder={m.statusline_command_placeholder()}
			required
			class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
		/>
		<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
			{m.statusline_command_hint()}
		</p>
	</div>

	<div>
		<label for="statusline-padding" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{m.label_padding()}</label>
		<input
			id="statusline-padding"
			type="number"
			min="0"
			max="10"
			bind:value={padding}
			class="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
		/>
	</div>

	<div class="flex justify-end gap-3 pt-2">
		<button type="button" onclick={onCancel} class="btn btn-secondary">
			{m.action_cancel()}
		</button>
		<button type="submit" class="btn btn-primary" disabled={!name.trim() || !rawCommand.trim()}>
			{initialValues ? m.action_update() : m.action_create()}
		</button>
	</div>
</form>
