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
				return 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md';
			case 'secondary':
				return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300';
			case 'outline':
				return 'border border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent';
			case 'ghost':
				return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-transparent';
			default:
				return 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md';
		}
	};

	const getSizeClasses = (size: string) => {
		switch (size) {
			case 'sm':
				return 'px-3 py-1.5 text-sm';
			case 'md':
				return 'px-4 py-2 text-base';
			case 'lg':
				return 'px-6 py-3 text-lg';
			default:
				return 'px-4 py-2 text-base';
		}
	};

	let baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current';
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

