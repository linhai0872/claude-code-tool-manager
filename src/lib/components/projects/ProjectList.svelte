<script lang="ts">
	import type { Project } from '$lib/types';
	import { goto } from '$app/navigation';
	import { projectsStore } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';
	import ProjectCard from './ProjectCard.svelte';
	import { SearchBar } from '$lib/components/shared';
	import { FolderOpen, Plus } from 'lucide-svelte';

	type Props = {
		onAddProject?: () => void;
		onRemoveProject?: (project: Project) => void;
	};

	let { onAddProject, onRemoveProject }: Props = $props();

	let searchQuery = $state('');

	// Filter projects based on search query
	let filteredProjects = $derived(
		searchQuery.trim()
			? projectsStore.sortedProjects.filter((project) => {
					const query = searchQuery.toLowerCase();
					return (
						project.name.toLowerCase().includes(query) ||
						project.path.toLowerCase().includes(query)
					);
				})
			: projectsStore.sortedProjects
	);

	function handleProjectClick(project: Project) {
		goto('/projects/' + project.id);
	}

	async function handleFavoriteToggle(project: Project, favorite: boolean) {
		await projectsStore.toggleFavorite(project.id, favorite);
	}
</script>

<div class="space-y-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{m.page_projects_title()}</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{m.project_click_to_open()}
			</p>
		</div>
		{#if onAddProject}
			<button onclick={onAddProject} class="btn btn-primary">
				<Plus class="w-4 h-4 mr-2" />
				{m.project_add_project()}
			</button>
		{/if}
	</div>

	<!-- Search Bar -->
	{#if projectsStore.projects.length > 0}
		<div class="max-w-md">
			<SearchBar bind:value={searchQuery} placeholder={m.placeholder_search_projects()} />
		</div>
	{/if}

	<!-- Project List -->
	{#if projectsStore.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
		</div>
	{:else if projectsStore.projects.length === 0}
		<div class="text-center py-12 card">
			<FolderOpen class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
			<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m.project_no_projects_added()}</h3>
			<p class="text-gray-500 dark:text-gray-400 mt-1 mb-4">
				{m.project_add_folder_hint()}
			</p>
			{#if onAddProject}
				<button onclick={onAddProject} class="btn btn-primary">
					<Plus class="w-4 h-4 mr-2" />
					{m.project_add_first_project()}
				</button>
			{/if}
		</div>
	{:else if filteredProjects.length === 0}
		<div class="text-center py-12 card">
			<FolderOpen class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
			<h3 class="text-lg font-medium text-gray-900 dark:text-white">{m.project_no_projects_found()}</h3>
			<p class="text-gray-500 dark:text-gray-400 mt-1">
				{m.project_no_projects_match({ query: searchQuery })}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{#each filteredProjects as project (project.id)}
				<ProjectCard
					{project}
					onRemove={onRemoveProject}
					onClick={() => handleProjectClick(project)}
					onFavoriteToggle={handleFavoriteToggle}
				/>
			{/each}
		</div>
	{/if}
</div>
