<script lang="ts">
	import ErrorBox from './ErrorBox.svelte';

	function handleInputRange(){
		if (min === -1) return;

		if (modelValue && typeof(modelValue) === 'number' && modelValue < min){
			modelValue = min;
		}
		

	}

	type InputType = {
		error?: string;
		placeholder?: string;
		type?: string;
		modelValue?: string | number;
		min? : number;
	};

	let { error = '', placeholder = '', type = '', modelValue = $bindable(), min = -1 }: InputType = $props();

</script>

<input
	class="my-2 block w-full border bg-white px-3 py-2 text-base font-medium {error.length > 0
		? 'border-red-700'
		: 'order-neutral-200'} b invalid:border- rounded-md placeholder-slate-400 shadow-sm invalid:text-[#d0011d] focus:border-[#eb008c] focus:ring-1 focus:ring-[#eb008c] focus:outline-none focus:invalid:border-[#d0011d] focus:invalid:ring-[#d0011d] disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
	{placeholder}
	{type}
	bind:value={modelValue}
	min={min != - 1 ? `${min}` : ''}
	onchange={() => handleInputRange}
	
/>
<ErrorBox {error} />
