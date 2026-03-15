<script lang="ts">
	import { onMount } from 'svelte';
	import { SpinnerVerbList, SpinnerVerbForm } from '$lib/components/spinnerverbs';
	import { ConfirmDialog, CustomSelect } from '$lib/components/shared';
	import { spinnerVerbLibrary, notifications } from '$lib/stores';
	import type { SpinnerVerb } from '$lib/types';
	import { Plus, RefreshCw } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showAddVerb = $state(false);
	let editingVerb = $state<SpinnerVerb | null>(null);
	let deletingVerb = $state<SpinnerVerb | null>(null);
	let isSyncing = $state(false);

	onMount(async () => {
		await spinnerVerbLibrary.load();
	});

	async function handleCreate(verb: string) {
		try {
			await spinnerVerbLibrary.create(verb);
			showAddVerb = false;
			notifications.success(m.notify_added({ entity: m.entity_verb() }));
		} catch (err) {
			notifications.error(m.notify_add_failed({ entity: m.entity_verb() }));
		}
	}

	async function handleUpdate(verb: string) {
		if (!editingVerb) return;
		try {
			await spinnerVerbLibrary.update(editingVerb.id, verb, editingVerb.isEnabled);
			editingVerb = null;
			notifications.success(m.notify_updated({ entity: m.entity_verb() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_verb() }));
		}
	}

	async function handleDelete() {
		if (!deletingVerb) return;
		try {
			await spinnerVerbLibrary.delete(deletingVerb.id);
			notifications.success(m.notify_deleted({ entity: m.entity_verb() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_verb() }));
		} finally {
			deletingVerb = null;
		}
	}

	async function handleModeChange(val: string) {
		const mode = val as 'append' | 'replace';
		try {
			await spinnerVerbLibrary.setMode(mode);
			notifications.success(m.notify_mode_set({ mode }));
		} catch (err) {
			notifications.error(m.notify_mode_change_failed());
		}
	}

	async function handleSync() {
		isSyncing = true;
		try {
			await spinnerVerbLibrary.sync();
			notifications.success(m.notify_spinner_synced());
		} catch (err) {
			notifications.error(m.notify_sync_failed({ entity: m.entity_verb() }));
		} finally {
			isSyncing = false;
		}
	}
</script>

<!-- Mode & Actions Bar -->
<div class="flex items-center justify-between mb-6">
	<div class="flex items-center gap-4">
		<label
			for="spinner-mode"
			class="text-sm font-medium text-gray-700 dark:text-gray-300"
		>
			{m.spinner_mode_label()}
		</label>
		<CustomSelect
			id="spinner-mode"
			class="min-w-52"
			value={spinnerVerbLibrary.mode}
			onchange={handleModeChange}
			options={[
				{ value: 'append', label: m.spinner_mode_append() },
				{ value: 'replace', label: m.spinner_mode_replace() }
			]}
		/>
	</div>

	<div class="flex items-center gap-3">
		<button
			onclick={handleSync}
			disabled={isSyncing}
			class="btn btn-secondary flex items-center gap-2"
		>
			<RefreshCw class="w-4 h-4 {isSyncing ? 'animate-spin' : ''}" />
			{m.spinner_sync_settings()}
		</button>
		<button onclick={() => (showAddVerb = true)} class="btn btn-primary">
			<Plus class="w-4 h-4 mr-2" />
			{m.spinner_add_verb()}
		</button>
	</div>
</div>

<!-- Verb List -->
<SpinnerVerbList
	onEdit={(verb) => (editingVerb = verb)}
	onDelete={(verb) => (deletingVerb = verb)}
/>

<!-- Add Verb Modal -->
{#if showAddVerb}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
					{m.spinner_add_title()}
				</h2>
				<SpinnerVerbForm onSubmit={handleCreate} onCancel={() => (showAddVerb = false)} />
			</div>
		</div>
	</div>
{/if}

<!-- Edit Verb Modal -->
{#if editingVerb}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
					{m.spinner_edit_title()}
				</h2>
				<SpinnerVerbForm
					initialValues={editingVerb}
					onSubmit={handleUpdate}
					onCancel={() => (editingVerb = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingVerb}
	title={m.confirm_delete_title({ entity: m.entity_spinner_verb() })}
	message={m.confirm_delete_message_no_undo({ name: deletingVerb?.verb ?? '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDelete}
	onCancel={() => (deletingVerb = null)}
/>
