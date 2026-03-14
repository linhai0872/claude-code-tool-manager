<script lang="ts">
	import { Header } from '$lib/components/layout';
	import { ProjectList } from '$lib/components/projects';
	import { ConfirmDialog } from '$lib/components/shared';
	import { projectsStore, notifications } from '$lib/stores';
	import type { Project } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

	let deletingProject = $state<Project | null>(null);

	async function handleAddProject() {
		try {
			const path = await projectsStore.browseForProject();
			if (path) {
				const name = path.split(/[/\\]/).pop() || 'Project';
				await projectsStore.addProject({ name, path });
				notifications.success(m.notify_added({ entity: m.entity_project() }));
			}
		} catch (err) {
			notifications.error(m.notify_add_failed({ entity: m.entity_project() }));
		}
	}

	async function handleRemoveProject() {
		if (!deletingProject) return;
		try {
			await projectsStore.removeProject(deletingProject.id);
			notifications.success(m.notify_removed({ entity: m.entity_project() }));
		} catch (err) {
			notifications.error(m.notify_remove_failed({ entity: m.entity_project() }));
		} finally {
			deletingProject = null;
		}
	}
</script>

<Header
	title={m.page_projects_title()}
	subtitle={m.page_projects_subtitle()}
/>

<div class="flex-1 overflow-auto p-6">
	<ProjectList
		onAddProject={handleAddProject}
		onRemoveProject={(project) => (deletingProject = project)}
	/>
</div>

<ConfirmDialog
	open={!!deletingProject}
	title={m.confirm_remove_project_title()}
	message={m.confirm_remove_project_message({ name: deletingProject?.name ?? '' })}
	confirmText={m.action_remove()}
	variant="warning"
	onConfirm={handleRemoveProject}
	onCancel={() => (deletingProject = null)}
/>
