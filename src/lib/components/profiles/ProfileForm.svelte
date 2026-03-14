<script lang="ts">
	import type { Profile, CreateProfileRequest } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		initialValues?: Profile | null;
		onSubmit: (values: CreateProfileRequest) => void;
		onCancel: () => void;
	};

	let { initialValues = null, onSubmit, onCancel }: Props = $props();

	let name = $state(initialValues?.name ?? '');
	let description = $state(initialValues?.description ?? '');
	let icon = $state(initialValues?.icon ?? '');

	const isValid = $derived(name.trim().length > 0);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isValid) return;
		onSubmit({
			name: name.trim(),
			description: description.trim() || null,
			icon: icon.trim() || null
		});
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<div>
		<label for="profile-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{m.label_name()} <span class="text-red-500">*</span>
		</label>
		<input
			id="profile-name"
			type="text"
			bind:value={name}
			placeholder={m.placeholder_profile_name()}
			class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		/>
	</div>

	<div>
		<label for="profile-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{m.label_description()}
		</label>
		<textarea
			id="profile-description"
			bind:value={description}
			placeholder={m.placeholder_profile_description()}
			rows="2"
			class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
		></textarea>
	</div>

	<div>
		<label for="profile-icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{m.label_icon_emoji()}
		</label>
		<input
			id="profile-icon"
			type="text"
			bind:value={icon}
			placeholder={m.placeholder_profile_icon()}
			maxlength="4"
			class="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		/>
	</div>

	<div class="flex justify-end gap-3 pt-2">
		<button
			type="button"
			onclick={onCancel}
			class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
		>
			{m.action_cancel()}
		</button>
		<button
			type="submit"
			disabled={!isValid}
			class="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{initialValues ? m.action_update_profile() : m.action_create_profile()}
		</button>
	</div>
</form>
