<script lang="ts">
	import type { StatusLineSegment, CreateStatusLineRequest, StatusLineTheme } from '$lib/types';
	import { serializeSegmentsJson } from '$lib/types';
	import { statuslineLibrary } from '$lib/stores';
	import SegmentPicker from './SegmentPicker.svelte';
	import SegmentCard from './SegmentCard.svelte';
	import SegmentConfig from './SegmentConfig.svelte';
	import StatusLinePreview from './StatusLinePreview.svelte';
	import { Save, Play, FileCode, Zap } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		initialSegments?: StatusLineSegment[];
		initialName?: string;
		initialDescription?: string;
		initialPadding?: number;
		initialTheme?: StatusLineTheme;
		onSave?: (request: CreateStatusLineRequest) => void;
		onActivate?: (request: CreateStatusLineRequest) => void;
	};

	let { initialSegments, initialName, initialDescription, initialPadding, initialTheme, onSave, onActivate }: Props = $props();

	let segments = $state<StatusLineSegment[]>(initialSegments ?? getDefaultSegments());
	let selectedSegmentId = $state<string | null>(null);
	let name = $state(initialName ?? '');
	let description = $state(initialDescription ?? '');
	let padding = $state(initialPadding ?? 0);
	let theme = $state<StatusLineTheme>(initialTheme ?? 'default');
	let showScript = $state(false);
	let scriptContent = $state('');
	const selectedSegment = $derived(segments.find((s) => s.id === selectedSegmentId) ?? null);
	const isPowerline = $derived(theme === 'powerline' || theme === 'powerline_round');

	function getDefaultSegments(): StatusLineSegment[] {
		return [
			{ id: crypto.randomUUID(), type: 'model', enabled: true, format: 'short', color: 'cyan', position: 0 },
			{ id: crypto.randomUUID(), type: 'separator', enabled: true, color: 'gray', separatorChar: '|', position: 1 },
			{ id: crypto.randomUUID(), type: 'cost', enabled: true, format: '$0.00', color: 'green', position: 2 },
			{ id: crypto.randomUUID(), type: 'separator', enabled: true, color: 'gray', separatorChar: '|', position: 3 },
			{ id: crypto.randomUUID(), type: 'context', enabled: true, format: 'percentage', color: 'yellow', position: 4 },
		];
	}

	function addSegment(seg: StatusLineSegment) {
		seg.position = segments.length;
		segments = [...segments, seg];
		selectedSegmentId = seg.id;
	}

	function removeSegment(seg: StatusLineSegment) {
		segments = segments.filter((s) => s.id !== seg.id);
		if (selectedSegmentId === seg.id) selectedSegmentId = null;
		normalizePositions();
	}

	function toggleSegment(seg: StatusLineSegment) {
		segments = segments.map((s) =>
			s.id === seg.id ? { ...s, enabled: !s.enabled } : s
		);
	}

	function updateSegment(updated: StatusLineSegment) {
		segments = segments.map((s) => (s.id === updated.id ? updated : s));
	}

	const flipDurationMs = 150;

	function handleDndConsider(e: CustomEvent<{ items: StatusLineSegment[] }>) {
		segments = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<{ items: StatusLineSegment[] }>) {
		segments = e.detail.items;
		normalizePositionsArray(segments);
	}

	function normalizePositions() {
		segments = segments.map((s, i) => ({ ...s, position: i }));
	}

	function normalizePositionsArray(arr: StatusLineSegment[]) {
		arr.forEach((s, i) => (s.position = i));
	}

	function buildRequest(): CreateStatusLineRequest {
		normalizePositions();
		return {
			name: name || 'Custom Status Line',
			description: description || null,
			statuslineType: 'custom',
			segmentsJson: serializeSegmentsJson(segments, theme),
			padding,
			tags: isPowerline ? ['custom', 'powerline'] : ['custom']
		};
	}
</script>

<div class="space-y-6">
	<!-- Name & Description -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="statusline-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{m.label_name()}</label>
			<input
				id="statusline-name"
				type="text"
				bind:value={name}
				placeholder={m.placeholder_statusline_name()}
				class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
			/>
		</div>
		<div>
			<label for="statusline-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{m.label_description()}</label>
			<input
				id="statusline-description"
				type="text"
				bind:value={description}
				placeholder={m.placeholder_optional_description()}
				class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
			/>
		</div>
	</div>

	<!-- Add Segments -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{m.statusline_add_segments()}</h4>
		<SegmentPicker onAdd={addSegment} />
	</div>

	<!-- Segment List -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{m.statusline_segments_drag()}</h4>
		{#if segments.length === 0}
			<p class="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">{m.empty_no_segments()}</p>
		{:else}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex flex-wrap gap-2"
				use:dndzone={{ items: segments, flipDurationMs, type: 'segments' }}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
			>
				{#each segments as seg (seg.id)}
					<SegmentCard
						segment={seg}
						isSelected={selectedSegmentId === seg.id}
						onSelect={(s) => (selectedSegmentId = s.id)}
						onRemove={removeSegment}
						onToggle={toggleSegment}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Selected Segment Config -->
	{#if selectedSegment}
		<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
			<SegmentConfig segment={selectedSegment} onChange={updateSegment} />
		</div>
	{/if}

	<!-- Preview -->
	<div>
		<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{m.statusline_preview()}</h4>
		<StatusLinePreview {segments} {theme} {padding} />
	</div>

	<!-- Actions -->
	<div class="space-y-2">
		<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{m.statusline_settings_actions()}</h4>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex items-center gap-2">
				<p class="text-xs text-gray-500 dark:text-gray-400">{m.label_theme()}:</p>
				<div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
					<button
						onclick={() => (theme = 'default')}
						class="px-2.5 py-1 text-xs font-medium transition-colors
							{theme === 'default'
								? 'bg-primary-500 text-white'
								: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
					>{m.statusline_theme_default()}</button>
					<button
						onclick={() => (theme = 'powerline')}
						class="px-2.5 py-1 text-xs font-medium transition-colors border-l border-gray-200 dark:border-gray-700
							{theme === 'powerline'
								? 'bg-primary-500 text-white'
								: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
					>
						<Zap class="w-3 h-3 inline -mt-0.5 mr-0.5" />{m.statusline_theme_powerline()}
					</button>
					<button
						onclick={() => (theme = 'powerline_round')}
						class="px-2.5 py-1 text-xs font-medium transition-colors border-l border-gray-200 dark:border-gray-700
							{theme === 'powerline_round'
								? 'bg-primary-500 text-white'
								: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
					>
						<Zap class="w-3 h-3 inline -mt-0.5 mr-0.5" />{m.statusline_theme_round()}
					</button>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<label for="statusline-padding" class="text-xs text-gray-500 dark:text-gray-400">{m.label_padding()}:</label>
				<input
					id="statusline-padding"
					type="number"
					min="0"
					max="10"
					bind:value={padding}
					class="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white text-center"
				/>
			</div>
			<button onclick={async () => {
				showScript = !showScript;
				if (showScript && !scriptContent) {
					scriptContent = await statuslineLibrary.generatePreview(segments, theme);
				}
			}} class="btn btn-secondary text-sm">
				<FileCode class="w-4 h-4 mr-1.5" />
				{showScript ? m.statusline_hide_script() : m.statusline_show_script()}
			</button>
			<div class="ml-auto flex items-center gap-2">
				<button onclick={() => onSave?.(buildRequest())} class="btn btn-secondary text-sm" disabled={!name.trim()}>
					<Save class="w-4 h-4 mr-1.5" />
					{m.action_save()}
				</button>
				<button onclick={() => onActivate?.(buildRequest())} class="btn btn-primary text-sm" disabled={!name.trim()}>
					<Play class="w-4 h-4 mr-1.5" />
					{m.statusline_save_activate()}
				</button>
			</div>
		</div>
	</div>

	<!-- Generated Script (toggleable) -->
	{#if showScript}
		<div>
			<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{m.statusline_generated_script()}</h4>
			<div class="flex justify-end mb-1">
				<button
					onclick={async () => { scriptContent = await statuslineLibrary.generatePreview(segments, theme); }}
					class="text-xs text-primary-500 hover:text-primary-600"
				>
					{m.statusline_refresh()}
				</button>
			</div>
			<pre class="bg-gray-900 text-gray-300 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono">{scriptContent || m.statusline_generating()}</pre>
		</div>
	{/if}
</div>
