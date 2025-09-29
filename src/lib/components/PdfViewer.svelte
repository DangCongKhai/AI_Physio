<script lang="ts">
	import { onMount } from 'svelte';

	let { pdfUrl, height = '500px' } = $props<{
		pdfUrl: string;
		height?: string;
	}>();
	

</script>


<div class="pdf-viewer w-full">
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <iframe 
            src={pdfUrl}
            class="w-full"
            style="height: {height}"
            title="Translated PDF Document"
        ></iframe>
    </div>
</div>