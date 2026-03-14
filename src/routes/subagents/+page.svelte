<script lang="ts">
	import { Header } from '$lib/components/layout';
	import { SubAgentLibrary, SubAgentForm } from '$lib/components/subagents';
	import { ConfirmDialog } from '$lib/components/shared';
	import { subagentLibrary, notifications } from '$lib/stores';
	import type { SubAgent } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showAddSubAgent = $state(false);
	let editingSubAgent = $state<SubAgent | null>(null);
	let deletingSubAgent = $state<SubAgent | null>(null);

	async function handleCreateSubAgent(values: any) {
		try {
			await subagentLibrary.create(values);
			showAddSubAgent = false;
			notifications.success(m.notify_created({ entity: m.entity_sub_agent() }));
		} catch (err) {
			notifications.error(m.notify_create_failed({ entity: m.entity_sub_agent() }));
		}
	}

	async function handleUpdateSubAgent(values: any) {
		if (!editingSubAgent) return;
		try {
			await subagentLibrary.update(editingSubAgent.id, values);
			editingSubAgent = null;
			notifications.success(m.notify_updated({ entity: m.entity_sub_agent() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_sub_agent() }));
		}
	}

	async function handleDeleteSubAgent() {
		if (!deletingSubAgent) return;
		try {
			await subagentLibrary.delete(deletingSubAgent.id);
			notifications.success(m.notify_deleted({ entity: m.entity_sub_agent() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_sub_agent() }));
		} finally {
			deletingSubAgent = null;
		}
	}
</script>

<Header
	title={m.page_subagents_title()}
	subtitle={m.page_subagents_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<div class="flex justify-end mb-6">
		<button onclick={() => (showAddSubAgent = true)} class="btn btn-primary">
			<Plus class="w-4 h-4 mr-2" />
			{m.modal_add_title({ entity: m.entity_sub_agent() })}
		</button>
	</div>

	<SubAgentLibrary
		onEdit={(subagent) => (editingSubAgent = subagent)}
		onDelete={(subagent) => (deletingSubAgent = subagent)}
	/>
</div>

<!-- Add SubAgent Modal -->
{#if showAddSubAgent}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_add_title({ entity: m.entity_sub_agent() })}</h2>
				<SubAgentForm onSubmit={handleCreateSubAgent} onCancel={() => (showAddSubAgent = false)} />
			</div>
		</div>
	</div>
{/if}

<!-- Edit SubAgent Modal -->
{#if editingSubAgent}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_edit_title({ entity: m.entity_sub_agent() })}</h2>
				<SubAgentForm
					initialValues={editingSubAgent}
					onSubmit={handleUpdateSubAgent}
					onCancel={() => (editingSubAgent = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingSubAgent}
	title={m.confirm_delete_title({ entity: m.entity_sub_agent() })}
	message={m.confirm_delete_message({ name: deletingSubAgent?.name ?? '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDeleteSubAgent}
	onCancel={() => (deletingSubAgent = null)}
/>
