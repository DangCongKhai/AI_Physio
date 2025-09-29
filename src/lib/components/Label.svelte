<script lang="ts">
	let { children } = $props();
</script>

<span class="mt-[6px] inline-block rounded-lg bg-[#75a5ac] px-2 py-1 font-semibold text-white">
	{@render children()}
</span>
