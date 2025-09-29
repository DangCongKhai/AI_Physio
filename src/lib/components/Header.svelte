<script lang="ts">
	let { className, children } = $props();
</script>


<h1 class="{className} text-3xl text-[#333]">
	{@render children()}
</h1>
