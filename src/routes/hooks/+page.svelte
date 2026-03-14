<script lang="ts">
	import { onMount } from 'svelte';
	import { Header } from '$lib/components/layout';
	import { HookLibrary, HookForm, HookExportModal, SoundHookWizard } from '$lib/components/hooks';
	import { SoundBrowser } from '$lib/components/sounds';
	import { ConfirmDialog } from '$lib/components/shared';
	import { hookLibrary, soundLibrary, notifications } from '$lib/stores';
	import type { Hook, CreateHookRequest } from '$lib/types';
	import { Plus, Volume2, Download, Music } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showAddHook = $state(false);
	let editingHook = $state<Hook | null>(null);
	let deletingHook = $state<Hook | null>(null);
	let showSoundWizard = $state(false);
	let showExportModal = $state(false);
	let showSoundBrowser = $state(false);

	onMount(async () => {
		await hookLibrary.load();
		await hookLibrary.loadTemplates();
		await hookLibrary.seedTemplates();
		await hookLibrary.loadGlobalHooks();
		await hookLibrary.loadAllProjectHooks();
		// Pre-load sounds for the wizard
		await soundLibrary.load();
	});

	async function handleCreateHook(values: CreateHookRequest) {
		try {
			await hookLibrary.create(values);
			showAddHook = false;
			notifications.success(m.notify_created({ entity: m.entity_hook() }));
		} catch (err) {
			notifications.error(m.notify_create_failed({ entity: m.entity_hook() }));
		}
	}

	async function handleUpdateHook(values: CreateHookRequest) {
		if (!editingHook) return;
		try {
			await hookLibrary.update(editingHook.id, values);
			editingHook = null;
			notifications.success(m.notify_updated({ entity: m.entity_hook() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_hook() }));
		}
	}

	async function handleDeleteHook() {
		if (!deletingHook) return;
		try {
			await hookLibrary.delete(deletingHook.id);
			notifications.success(m.notify_deleted({ entity: m.entity_hook() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_hook() }));
		} finally {
			deletingHook = null;
		}
	}

	async function handleDuplicate(hook: Hook) {
		try {
			const newName = `${hook.name}-copy`;
			await hookLibrary.create({
				name: newName,
				description: hook.description,
				eventType: hook.eventType,
				matcher: hook.matcher,
				hookType: hook.hookType,
				command: hook.command,
				prompt: hook.prompt,
				timeout: hook.timeout,
				tags: hook.tags
			});
			notifications.success(m.notify_duplicated({ entity: m.entity_hook() }));
		} catch (err) {
			notifications.error(m.notify_duplicate_failed({ entity: m.entity_hook() }));
		}
	}
</script>

<Header
	title={m.page_hooks_title()}
	subtitle={m.page_hooks_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<div class="flex flex-wrap gap-3 justify-end mb-6">
		<button onclick={() => (showSoundWizard = true)} class="btn btn-secondary">
			<Volume2 class="w-4 h-4 mr-2" />
			{m.action_sound_notifications()}
		</button>
		<button onclick={() => (showExportModal = true)} class="btn btn-secondary">
			<Download class="w-4 h-4 mr-2" />
			{m.action_export()}
		</button>
		<button onclick={() => (showSoundBrowser = true)} class="btn btn-secondary">
			<Music class="w-4 h-4 mr-2" />
			{m.action_manage_sounds()}
		</button>
		<button onclick={() => (showAddHook = true)} class="btn btn-primary">
			<Plus class="w-4 h-4 mr-2" />
			{m.action_add_hook()}
		</button>
	</div>

	<HookLibrary
		onEdit={(hook) => (editingHook = hook)}
		onDelete={(hook) => (deletingHook = hook)}
		onDuplicate={handleDuplicate}
	/>
</div>

<!-- Add Hook Modal -->
{#if showAddHook}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div
			class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
		>
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_add_title({ entity: m.entity_hook() })}</h2>
				<HookForm
					templates={hookLibrary.templates}
					onSubmit={handleCreateHook}
					onCancel={() => (showAddHook = false)}
				/>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Hook Modal -->
{#if editingHook}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div
			class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
		>
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_edit_title({ entity: m.entity_hook() })}</h2>
				<HookForm
					initialValues={editingHook}
					templates={hookLibrary.templates}
					onSubmit={handleUpdateHook}
					onCancel={() => (editingHook = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingHook}
	title={m.confirm_delete_title({ entity: m.entity_hook() })}
	message={m.confirm_delete_message({ name: deletingHook?.name ?? '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDeleteHook}
	onCancel={() => (deletingHook = null)}
/>

<!-- Sound Hook Wizard -->
{#if showSoundWizard}
	<SoundHookWizard
		onClose={() => (showSoundWizard = false)}
		onComplete={async () => {
			await hookLibrary.load();
			await hookLibrary.loadGlobalHooks();
		}}
	/>
{/if}

<!-- Export Modal -->
{#if showExportModal}
	<HookExportModal onClose={() => (showExportModal = false)} />
{/if}

<!-- Sound Browser Modal -->
{#if showSoundBrowser}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
			<SoundBrowser onClose={() => (showSoundBrowser = false)} />
		</div>
	</div>
{/if}
