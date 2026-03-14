<script lang="ts">
	import { onMount } from 'svelte';
	import { invoke } from '@tauri-apps/api/core';
	import { Header } from '$lib/components/layout';
	import { McpLibrary, McpForm, McpTestModal } from '$lib/components/mcp';
	import { ConfirmDialog } from '$lib/components/shared';
	import { mcpLibrary, notifications } from '$lib/stores';
	import type { Mcp, GatewayMcp } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showAddMcp = $state(false);
	let editingMcp = $state<Mcp | null>(null);
	let deletingMcp = $state<Mcp | null>(null);
	let testingMcp = $state<Mcp | null>(null);
	let gatewayMcpIds = $state<Set<number>>(new Set());

	onMount(async () => {
		await loadGatewayMcps();
	});

	async function loadGatewayMcps() {
		try {
			const gatewayMcps = await invoke<GatewayMcp[]>('get_gateway_mcps');
			gatewayMcpIds = new Set(gatewayMcps.map(gm => gm.mcpId));
		} catch (err) {
			console.error('Failed to load gateway MCPs:', err);
		}
	}

	async function handleGatewayToggle(mcp: Mcp, enabled: boolean) {
		try {
			if (enabled) {
				await invoke('add_mcp_to_gateway', { mcpId: mcp.id });
				gatewayMcpIds = new Set([...gatewayMcpIds, mcp.id]);
				notifications.success(m.notify_added_to_gateway({ name: mcp.name }));
			} else {
				await invoke('remove_mcp_from_gateway', { mcpId: mcp.id });
				const newIds = new Set(gatewayMcpIds);
				newIds.delete(mcp.id);
				gatewayMcpIds = newIds;
				notifications.success(m.notify_removed_from_gateway({ name: mcp.name }));
			}
		} catch (err) {
			notifications.error(enabled ? m.notify_gateway_add_failed() : m.notify_gateway_remove_failed());
			console.error('Gateway toggle error:', err);
		}
	}

	async function handleCreateMcp(values: any) {
		try {
			await mcpLibrary.create(values);
			showAddMcp = false;
			notifications.success(m.notify_created({ entity: m.entity_mcp() }));
		} catch (err) {
			notifications.error(m.notify_create_failed({ entity: m.entity_mcp() }));
		}
	}

	async function handleUpdateMcp(values: any) {
		if (!editingMcp) return;
		try {
			await mcpLibrary.update(editingMcp.id, values);
			editingMcp = null;
			notifications.success(m.notify_updated({ entity: m.entity_mcp() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_mcp() }));
		}
	}

	async function handleDeleteMcp() {
		if (!deletingMcp) return;
		try {
			await mcpLibrary.delete(deletingMcp.id);
			notifications.success(m.notify_deleted({ entity: m.entity_mcp() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_mcp() }));
		} finally {
			deletingMcp = null;
		}
	}

	async function handleDuplicateMcp(mcp: Mcp) {
		try {
			await mcpLibrary.duplicate(mcp.id);
			notifications.success(m.notify_duplicated({ entity: m.entity_mcp() }));
		} catch (err) {
			notifications.error(m.notify_duplicate_failed({ entity: m.entity_mcp() }));
		}
	}
</script>

<Header
	title={m.page_library_title()}
	subtitle={m.page_library_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<div class="flex justify-end mb-6">
		<button onclick={() => (showAddMcp = true)} class="btn btn-primary">
			<Plus class="w-4 h-4 mr-2" />
			{m.action_add_mcp()}
		</button>
	</div>

	<McpLibrary
		onEdit={(mcp) => (editingMcp = mcp)}
		onDelete={(mcp) => (deletingMcp = mcp)}
		onDuplicate={handleDuplicateMcp}
		onTest={(mcp) => (testingMcp = mcp)}
		showGatewayToggle={true}
		{gatewayMcpIds}
		onGatewayToggle={handleGatewayToggle}
	/>
</div>

<!-- Add MCP Modal -->
{#if showAddMcp}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_add_title({ entity: m.entity_mcp() })}</h2>
				<McpForm onSubmit={handleCreateMcp} onCancel={() => (showAddMcp = false)} />
			</div>
		</div>
	</div>
{/if}

<!-- Edit MCP Modal -->
{#if editingMcp}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_edit_title({ entity: m.entity_mcp() })}</h2>
				<McpForm
					initialValues={editingMcp}
					onSubmit={handleUpdateMcp}
					onCancel={() => (editingMcp = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingMcp}
	title={m.confirm_delete_title({ entity: m.entity_mcp() })}
	message={m.confirm_delete_message({ name: deletingMcp?.name ?? '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDeleteMcp}
	onCancel={() => (deletingMcp = null)}
/>

<!-- Test MCP Modal -->
{#if testingMcp}
	<McpTestModal mcp={testingMcp} onClose={() => (testingMcp = null)} />
{/if}
