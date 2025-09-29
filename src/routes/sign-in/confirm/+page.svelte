<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import Spinner from '$lib/components/Spinner.svelte';
	import type { PageData } from './$types';
  	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	
</script>

<div class="flex h-[100vh] place-items-center bg-white px-4 py-20 text-center">
	<div class="m-auto">
		<Spinner className="mb-[-30px]" />
		<div>Hang on one moment, we are bringing you back...</div>
	</div>
</div>
