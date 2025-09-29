<script lang="ts">
	let { error }: { error: string} = $props();
</script>

{#if error.length > 0}
	<div
		class="text-md my-3 rounded-lg border border-red-700 bg-red-200 p-4 text-center text-red-700"
	>
		{error}
	</div>
{/if}
