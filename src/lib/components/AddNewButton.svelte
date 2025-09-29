<script lang="ts">
	import type { Snippet } from 'svelte';
	import ButtonSpinner from './ButtonSpinner.svelte';

	let { loading, children }: { loading: boolean; children: Snippet } = $props();
</script>

<button
	class="text-md rounded-lg border-2 border-dotted border-[#DDD] bg-white px-4 py-2 text-[#333] hover:-translate-y-1 disabled:opacity-75"
>
	{#if loading}
		<ButtonSpinner className="h-2" />
	{/if}
	{@render children()}
</button>
