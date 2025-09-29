<script lang="ts">
	import { onMount } from 'svelte';

	let { modelValue = $bindable() }: { modelValue: string } = $props();

	let textAreaEl = $state<HTMLTextAreaElement>();
	function autoResize() {
		if (textAreaEl) {
			textAreaEl.style.height = 'auto'; // Reset height
			textAreaEl.style.height = textAreaEl.scrollHeight + 'px'; // Set to scrollHeight
		}
	}
	onMount(() => {
		autoResize();
	});

  $effect(() => {
	if (modelValue){
		autoResize();
	}
    	
  })
</script>

<textarea
	bind:value={modelValue}
	bind:this={textAreaEl}
	class="resizable-textarea scroll outline-none"
	oninput={autoResize}
></textarea>

<style>
	.resizable-textarea {
		width: 100%;
    box-sizing: border-box;
    /* padding: 8px; */
	align-content: center;
    resize : none;
	height: auto;
    font-family: inherit;
    font-size: inherit;
    background: transparent;
    border: none;
    /* prevent inner scrollbars */

    min-height: 1em; /* avoid collapsing */
		box-shadow: none;
	}

	.scroll::-webkit-scrollbar {
		display: none;
	}
</style>
