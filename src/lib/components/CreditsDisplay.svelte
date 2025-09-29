<script lang="ts">
	type CreditsDisplayProps = {
		userProfile: UserProfile | null;
		className?: string;
		showLabel?: boolean;
	};

	let { userProfile, className = '', showLabel = true }: CreditsDisplayProps = $props();

	const creditsRemaining = $derived(userProfile?.credits_balance ?? 0);
	const hasCredits = $derived(creditsRemaining > 0);
</script>

{#if userProfile}
	<div class="flex items-center gap-2 {className}">
		{#if showLabel}
			<span class="text-sm text-gray-600">Pages remaining:</span>
		{/if}
		<span 
			class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium {hasCredits ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
		>
			{creditsRemaining}
		</span>
	</div>
{/if}