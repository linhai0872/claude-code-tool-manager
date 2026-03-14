<script lang="ts">
	import { onMount } from 'svelte';
	import { Header } from '$lib/components/layout';
	import { ProfileLibrary, ProfileForm } from '$lib/components/profiles';
	import { ConfirmDialog } from '$lib/components/shared';
	import { profileLibrary, mcpLibrary, skillLibrary, commandLibrary, subagentLibrary, hookLibrary, notifications } from '$lib/stores';
	import type { Profile, CreateProfileRequest } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showAddProfile = $state(false);
	let editingProfile = $state<Profile | null>(null);
	let deletingProfile = $state<Profile | null>(null);

	onMount(async () => {
		await profileLibrary.load();
		await profileLibrary.loadActiveProfile();
	});

	async function handleCreate(values: CreateProfileRequest) {
		try {
			await profileLibrary.create(values);
			showAddProfile = false;
			notifications.success(m.notify_created({ entity: m.entity_profile() }));
		} catch (err) {
			notifications.error(m.notify_create_failed({ entity: m.entity_profile() }));
		}
	}

	async function handleUpdate(values: CreateProfileRequest) {
		if (!editingProfile) return;
		try {
			await profileLibrary.update(editingProfile.id, values);
			editingProfile = null;
			notifications.success(m.notify_updated({ entity: m.entity_profile() }));
		} catch (err) {
			notifications.error(m.notify_update_failed({ entity: m.entity_profile() }));
		}
	}

	async function handleDelete() {
		if (!deletingProfile) return;
		try {
			await profileLibrary.delete(deletingProfile.id);
			notifications.success(m.notify_deleted({ entity: m.entity_profile() }));
		} catch (err) {
			notifications.error(m.notify_delete_failed({ entity: m.entity_profile() }));
		} finally {
			deletingProfile = null;
		}
	}

	async function handleActivate(profile: Profile) {
		try {
			await profileLibrary.activate(profile.id);
			// Reload other stores so UI reflects the new global state
			await Promise.all([
				mcpLibrary.load(),
				skillLibrary.load(),
				commandLibrary.load(),
				subagentLibrary.load(),
				hookLibrary.load(),
				hookLibrary.loadGlobalHooks()
			]);
			notifications.success(m.notify_profile_activated({ name: profile.name }));
		} catch (err) {
			notifications.error(m.notify_activate_failed({ entity: m.entity_profile() }));
		}
	}

	async function handleDeactivate() {
		try {
			await profileLibrary.deactivate();
			notifications.success(m.notify_deactivated({ entity: m.entity_profile() }));
		} catch (err) {
			notifications.error(m.notify_deactivate_failed({ entity: m.entity_profile() }));
		}
	}

	async function handleCapture(profile: Profile) {
		try {
			await profileLibrary.captureFromCurrent(profile.id);
			notifications.success(m.notify_profile_captured({ name: profile.name }));
		} catch (err) {
			notifications.error(m.notify_capture_failed());
		}
	}
</script>

<Header
	title={m.page_profiles_title()}
	subtitle={m.page_profiles_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<div class="flex justify-end mb-6">
		<button onclick={() => (showAddProfile = true)} class="btn btn-primary">
			<Plus class="w-4 h-4 mr-2" />
			{m.action_create_profile()}
		</button>
	</div>

	<ProfileLibrary
		onActivate={handleActivate}
		onDeactivate={handleDeactivate}
		onCapture={handleCapture}
		onEdit={(profile) => (editingProfile = profile)}
		onDelete={(profile) => (deletingProfile = profile)}
	/>
</div>

<!-- Add Profile Modal -->
{#if showAddProfile}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_add_title({ entity: m.entity_profile() })}</h2>
				<ProfileForm
					onSubmit={handleCreate}
					onCancel={() => (showAddProfile = false)}
				/>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Profile Modal -->
{#if editingProfile}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{m.modal_edit_title({ entity: m.entity_profile() })}</h2>
				<ProfileForm
					initialValues={editingProfile}
					onSubmit={handleUpdate}
					onCancel={() => (editingProfile = null)}
				/>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog
	open={!!deletingProfile}
	title={m.confirm_delete_title({ entity: m.entity_profile() })}
	message={m.confirm_delete_message_no_undo({ name: deletingProfile?.name ?? '' })}
	confirmText={m.action_delete()}
	onConfirm={handleDelete}
	onCancel={() => (deletingProfile = null)}
/>
