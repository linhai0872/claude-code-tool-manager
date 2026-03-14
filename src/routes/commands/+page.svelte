<script lang="ts">
	import { Header } from '$lib/components/layout';
	import { CommandLibrary, CommandForm } from '$lib/components/commands';
	import { ConfirmDialog } from '$lib/components/shared';
	import { commandLibrary, notifications } from '$lib/stores';
	import type { Command } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showAddCommand = $state(false);
	let editingCommand = $state<Command | null>(null);
	let deletingCommand = $state<Command | null>(null);

	async function handleCreateCommand(values: any) {
		try {
			await commandLibrary.create(values);
			showAddCommand = false;
			notifications.success(m.notify_created({ entity: m.entity_command() }));
		} catch (err) {
			notifications.error(m.notify_create_failed({ entity: m.entity_command() }));
		}
	}

	async function handleUpdateCommand(values: any) {
		if (!editingCommand) return;
		try {
			await commandLibrary.update(editingCommand.id, values);
			editingCommand = null;
			notifications.success(m.notify_updated({ entity: m.entity_command() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_command() }));
		}
	}

	async function handleDeleteCommand() {
		if (!deletingCommand) return;
		try {
			await commandLibrary.delete(deletingCommand.id);
			notifications.success(m.notify_deleted({ entity: m.entity_command() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_command() }));
		} finally {
			deletingCommand = null;
		}
	}
</script>

<Header
	title={m.page_commands_title()}
	subtitle={m.page_commands_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<div class="flex justify-end mb-6">
		<button onclick={() => (showAddCommand = true)} class="btn btn-primary">
			<Plus class="w-4 h-4 mr-2" />
			{m.action_add_command()}
		</button>
	</div>

	<CommandLibrary
		onEdit={(command) => (editingCommand = command)}
		onDelete={(command) => (deletingCommand = command)}
	/>
</div>

<!-- Add Command Modal -->
{#if showAddCommand}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_add_title({ entity: m.entity_command() })}</h2>
				<CommandForm onSubmit={handleCreateCommand} onCancel={() => (showAddCommand = false)} />
			</div>
		</div>
	</div>
{/if}

<!-- Edit Command Modal -->
{#if editingCommand}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_edit_title({ entity: m.entity_command() })}</h2>
				<CommandForm
					initialValues={editingCommand}
					onSubmit={handleUpdateCommand}
					onCancel={() => (editingCommand = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingCommand}
	title={m.confirm_delete_title({ entity: m.entity_command() })}
	message={m.confirm_delete_message({ name: deletingCommand?.name ? '/' + deletingCommand.name : '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDeleteCommand}
	onCancel={() => (deletingCommand = null)}
/>
