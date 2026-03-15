<script lang="ts">
	import { ChevronDown, Check, Search } from 'lucide-svelte';
	import type { SelectOption } from '$lib/types';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		value: string;
		options: SelectOption[];
		placeholder?: string;
		disabled?: boolean;
		searchable?: boolean;
		class?: string;
		id?: string;
		onchange?: (value: string) => void;
	};

	let {
		value = $bindable(),
		options,
		placeholder = '',
		disabled = false,
		searchable = false,
		class: className = '',
		id,
		onchange
	}: Props = $props();

	let open = $state(false);
	let searchQuery = $state('');
	let highlightedIndex = $state(-1);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let searchInputEl = $state<HTMLInputElement | null>(null);
	let flipUp = $state(false);

	const selectedLabel = $derived(options.find((o) => o.value === value)?.label ?? '');

	const filteredOptions = $derived.by(() => {
		if (!searchable || !searchQuery.trim()) return options;
		const q = searchQuery.toLowerCase();
		return options.filter(
			(o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
		);
	});

	function toggle() {
		if (disabled) return;
		if (open) {
			close();
		} else {
			openDropdown();
		}
	}

	function openDropdown() {
		open = true;
		searchQuery = '';
		highlightedIndex = -1;
		flipUp = false;

		requestAnimationFrame(() => {
			checkFlip();
			if (searchable && searchInputEl) {
				searchInputEl.focus();
			}
		});
	}

	function close() {
		open = false;
		searchQuery = '';
		highlightedIndex = -1;
	}

	function selectOption(option: SelectOption) {
		value = option.value;
		onchange?.(option.value);
		close();
	}

	function checkFlip() {
		if (!triggerEl || !panelEl) return;
		const triggerRect = triggerEl.getBoundingClientRect();
		const panelHeight = panelEl.offsetHeight;
		const spaceBelow = window.innerHeight - triggerRect.bottom;
		flipUp = spaceBelow < panelHeight + 8 && triggerRect.top > panelHeight + 8;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) {
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openDropdown();
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlightedIndex =
					highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0;
				scrollToHighlighted();
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlightedIndex =
					highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1;
				scrollToHighlighted();
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
					selectOption(filteredOptions[highlightedIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				close();
				triggerEl?.focus();
				break;
		}
	}

	function scrollToHighlighted() {
		requestAnimationFrame(() => {
			if (!panelEl) return;
			const item = panelEl.querySelector(`[data-index="${highlightedIndex}"]`);
			item?.scrollIntoView({ block: 'nearest' });
		});
	}
</script>

<div class="relative {className}" onkeydown={handleKeydown}>
	<button
		bind:this={triggerEl}
		type="button"
		{id}
		{disabled}
		onclick={toggle}
		class="input flex items-center justify-between gap-2 text-left cursor-pointer
			{disabled ? 'opacity-50 cursor-not-allowed' : ''}"
		role="combobox"
		aria-expanded={open}
		aria-haspopup="listbox"
	>
		<span class="truncate {value ? '' : 'text-gray-400 dark:text-gray-500'}">
			{selectedLabel || placeholder}
		</span>
		<ChevronDown
			class="w-4 h-4 flex-shrink-0 text-gray-400 transition-transform {open
				? 'rotate-180'
				: ''}"
		/>
	</button>

	{#if open}
		<button
			type="button"
			class="fixed inset-0 z-40"
			onclick={close}
			aria-label={m.action_close()}
			tabindex="-1"
		></button>

		<div
			bind:this={panelEl}
			class="absolute z-50 min-w-full w-max max-w-[min(24rem,calc(100vw-2rem))] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden
				{flipUp ? 'bottom-full mb-1' : 'top-full mt-1'}"
			role="listbox"
		>
			{#if searchable}
				<div class="p-2 border-b border-gray-200 dark:border-gray-700">
					<div class="relative">
						<Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
						<input
							bind:this={searchInputEl}
							bind:value={searchQuery}
							type="text"
							class="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600
								bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
								focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
							placeholder={m.action_search()}
							onclick={(e) => e.stopPropagation()}
							onkeydown={(e) => {
								if (e.key === ' ') e.stopPropagation();
							}}
						/>
					</div>
				</div>
			{/if}

			<div class="max-h-60 overflow-auto">
				{#each filteredOptions as option, i (option.value)}
					<button
						type="button"
						data-index={i}
						onclick={() => selectOption(option)}
						class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
							{option.value === value
							? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
							: 'text-gray-900 dark:text-white'}
							{i === highlightedIndex
							? 'bg-gray-100 dark:bg-gray-700'
							: 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}"
						role="option"
						aria-selected={option.value === value}
					>
						<span class="flex-1 truncate">{option.label}</span>
						{#if option.value === value}
							<Check class="w-4 h-4 flex-shrink-0 text-primary-500" />
						{/if}
					</button>
				{:else}
					<div class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
						{m.label_no_results()}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
