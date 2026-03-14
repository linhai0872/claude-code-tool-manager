<script lang="ts">
	import { onMount } from 'svelte';
	import { Header } from '$lib/components/layout';
	import {
		StatusLineLibrary,
		StatusLineBuilder,
		StatusLineGallery,
		StatusLineForm
	} from '$lib/components/statusline';
	import { ConfirmDialog } from '$lib/components/shared';
	import { statuslineLibrary, notifications } from '$lib/stores';
	import type { StatusLine, CreateStatusLineRequest, StatusLineGalleryEntry } from '$lib/types';
	import { parseSegmentsJson } from '$lib/types';
	import { Plus, PenTool, Package } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let activeTab = $state<'library' | 'builder' | 'gallery'>('library');
	let showAddRaw = $state(false);
	let editingStatusLine = $state<StatusLine | null>(null);
	let editingInBuilder = $state<StatusLine | null>(null);
	let deletingStatusLine = $state<StatusLine | null>(null);

	onMount(async () => {
		await statuslineLibrary.load();
		await statuslineLibrary.loadGallery();
	});

	async function handleActivate(sl: StatusLine) {
		try {
			await statuslineLibrary.activate(sl.id);
			notifications.success(m.notify_activated_with_name({ name: sl.name }));
		} catch (err) {
			notifications.error(m.notify_activate_failed({ entity: m.entity_status_line() }));
		}
	}

	async function handleDeactivate() {
		try {
			await statuslineLibrary.deactivate();
			notifications.success(m.notify_deactivated({ entity: m.entity_status_line() }));
		} catch (err) {
			notifications.error(m.notify_deactivate_failed({ entity: m.entity_status_line() }));
		}
	}

	async function handleDelete() {
		if (!deletingStatusLine) return;
		try {
			await statuslineLibrary.delete(deletingStatusLine.id);
			notifications.success(m.notify_deleted({ entity: m.entity_status_line() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_status_line() }));
		} finally {
			deletingStatusLine = null;
		}
	}

	async function handleCreateRaw(request: CreateStatusLineRequest) {
		try {
			await statuslineLibrary.create(request);
			showAddRaw = false;
			notifications.success(m.notify_created({ entity: m.entity_status_line() }));
		} catch (err) {
			notifications.error(m.notify_create_failed({ entity: m.entity_status_line() }));
		}
	}

	async function handleUpdateRaw(request: CreateStatusLineRequest) {
		if (!editingStatusLine) return;
		try {
			await statuslineLibrary.update(editingStatusLine.id, request);
			editingStatusLine = null;
			notifications.success(m.notify_updated({ entity: m.entity_status_line() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_status_line() }));
		}
	}

	function handleEdit(sl: StatusLine) {
		if (sl.segmentsJson) {
			editingInBuilder = sl;
			activeTab = 'builder';
		} else {
			editingStatusLine = sl;
		}
	}

	async function handleBuilderSave(request: CreateStatusLineRequest) {
		try {
			if (editingInBuilder) {
				await statuslineLibrary.update(editingInBuilder.id, request);
				notifications.success(m.notify_updated_with_name({ name: request.name }));
				editingInBuilder = null;
			} else {
				await statuslineLibrary.create(request);
				notifications.success(m.notify_saved_with_name({ name: request.name }));
			}
			activeTab = 'library';
		} catch (err) {
			notifications.error(m.notify_save_failed({ entity: m.entity_status_line() }));
		}
	}

	async function handleBuilderActivate(request: CreateStatusLineRequest) {
		try {
			let sl: StatusLine;
			if (editingInBuilder) {
				sl = await statuslineLibrary.update(editingInBuilder.id, request);
				editingInBuilder = null;
			} else {
				sl = await statuslineLibrary.create(request);
			}
			await statuslineLibrary.activate(sl.id);
			notifications.success(m.notify_saved_and_activated({ name: sl.name }));
			activeTab = 'library';
		} catch (err) {
			notifications.error(m.notify_save_activate_failed({ entity: m.entity_status_line() }));
		}
	}

	async function handleGalleryInstall(entry: StatusLineGalleryEntry) {
		try {
			const sl = await statuslineLibrary.installPremade(entry);
			notifications.success(m.notify_added_to_library({ name: sl.name }));
		} catch (err) {
			notifications.error(m.notify_install_failed({ entity: m.entity_status_line() }));
		}
	}
</script>

<Header
	title={m.page_statusline_title()}
	subtitle={m.page_statusline_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<!-- Tab bar -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
			<button
				onclick={() => (activeTab = 'library')}
				class="px-4 py-2 text-sm font-medium transition-colors
					{activeTab === 'library'
						? 'bg-primary-600 text-white'
						: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
			>
				{m.statusline_tab_library()}
			</button>
			<button
				onclick={() => (activeTab = 'builder')}
				class="px-4 py-2 text-sm font-medium transition-colors border-x border-gray-200 dark:border-gray-700
					{activeTab === 'builder'
						? 'bg-primary-600 text-white'
						: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
			>
				<span class="flex items-center gap-1.5">
					<PenTool class="w-3.5 h-3.5" />
					{m.statusline_tab_builder()}
				</span>
			</button>
			<button
				onclick={() => (activeTab = 'gallery')}
				class="px-4 py-2 text-sm font-medium transition-colors
					{activeTab === 'gallery'
						? 'bg-primary-600 text-white'
						: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
			>
				<span class="flex items-center gap-1.5">
					<Package class="w-3.5 h-3.5" />
					{m.statusline_tab_gallery()}
				</span>
			</button>
		</div>

		{#if activeTab === 'library'}
			<button onclick={() => (showAddRaw = true)} class="btn btn-primary">
				<Plus class="w-4 h-4 mr-2" />
				{m.statusline_add_raw_command()}
			</button>
		{/if}
	</div>

	<!-- Tab content -->
	{#if activeTab === 'library'}
		<StatusLineLibrary
			onActivate={handleActivate}
			onDeactivate={handleDeactivate}
			onEdit={handleEdit}
			onDelete={(sl) => (deletingStatusLine = sl)}
		/>
	{:else if activeTab === 'builder'}
		{#key editingInBuilder?.id}
			{@const parsed = editingInBuilder?.segmentsJson ? parseSegmentsJson(editingInBuilder.segmentsJson) : undefined}
			<StatusLineBuilder
				initialName={editingInBuilder?.name}
				initialDescription={editingInBuilder?.description ?? undefined}
				initialPadding={editingInBuilder?.padding}
				initialSegments={parsed?.segments}
				initialTheme={parsed?.theme}
				onSave={handleBuilderSave}
				onActivate={handleBuilderActivate}
			/>
		{/key}
	{:else if activeTab === 'gallery'}
		<StatusLineGallery onInstall={handleGalleryInstall} />
	{/if}
</div>

<!-- Add Raw Modal -->
{#if showAddRaw}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.statusline_add_raw_title()}</h2>
				<StatusLineForm
					onSubmit={handleCreateRaw}
					onCancel={() => (showAddRaw = false)}
				/>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if editingStatusLine}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_edit_title({ entity: m.entity_status_line() })}</h2>
				<StatusLineForm
					initialValues={editingStatusLine}
					onSubmit={handleUpdateRaw}
					onCancel={() => (editingStatusLine = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingStatusLine}
	title={m.confirm_delete_title({ entity: m.entity_status_line() })}
	message={m.confirm_delete_message_no_undo({ name: deletingStatusLine?.name ?? '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDelete}
	onCancel={() => (deletingStatusLine = null)}
/>
