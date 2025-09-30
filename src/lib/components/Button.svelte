<script lang="ts">
	import type { Snippet } from 'svelte';
	import ButtonSpinner from './ButtonSpinner.svelte';

	type ButtonType = {
		disabled?: boolean;
		className?: string;
		children: Snippet;
		loading?: boolean;
		onclick?: any;
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
	};

	let {
		className = '',
		children,
		loading = false,
		onclick,
		disabled,
		variant = 'primary',
		size = 'md'
	}: ButtonType = $props();

	const getVariantClasses = (variant: string) => {
		switch (variant) {
			case 'primary':
				return 'bg-[#3182CE] hover:bg-[#1E40AF] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
			case 'secondary':
				return 'bg-slate-100 hover:bg-slate-200 text-[#1F2937] border border-slate-300 shadow-sm hover:shadow-md';
			case 'outline':
				return 'border-2 border-[#3182CE] text-[#3182CE] hover:bg-[#3182CE] hover:text-white bg-transparent shadow-sm hover:shadow-md';
			case 'ghost':
				return 'text-slate-600 hover:text-[#1F2937] hover:bg-slate-100 bg-transparent';
			default:
				return 'bg-[#3182CE] hover:bg-[#1E40AF] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
		}
	};

	const getSizeClasses = (size: string) => {
		switch (size) {
			case 'sm':
				return 'px-4 py-2 text-sm rounded-lg';
			case 'md':
				return 'px-6 py-3 text-base rounded-xl';
			case 'lg':
				return 'px-8 py-4 text-lg rounded-xl';
			default:
				return 'px-6 py-3 text-base rounded-xl';
		}
	};

	let baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#63B3ED] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current disabled:transform-none';
	let variantClasses = getVariantClasses(variant);
	let sizeClasses = getSizeClasses(size);
</script>

<button
	{disabled}
	{onclick}
	class="{baseClasses} {variantClasses} {sizeClasses} {className}"
>
	{#if loading}
		<ButtonSpinner className="h-4 w-4 mr-2" />
	{/if}
	
	{@render children()}
</button>

