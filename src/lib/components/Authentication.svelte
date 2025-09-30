<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import ErrorBox from '$lib/components/ErrorBox.svelte';

	import type { SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	let url = page.url;

	let {
		supabase,
		stateParam = '',
		mode = 'sign-in',
		message = ''
	}: {
		supabase: SupabaseClient;
		stateParam: string | null | undefined;
		mode: 'sign-in' | 'sign-up';
		message?: string;
	} = $props();

	onMount(() => {
		if (mode === 'sign-in') {
			isSignIn = true;
		} else {
			isSignIn = false;
		}
	});
	let isSignIn = $state(true);

	// Toggle between sign-in and sign-up
	const toggleMode = () => {
		isSignIn = !isSignIn;
	};
	let loading = $state(false);
	let errorMsg = $state('');

	const loginWithGoogle = async () => {
		loading = true;
		errorMsg = '';

		let stateQueryParam = stateParam ? `?state=${stateParam}` : '';
		let redirectTo = `${url.origin}/sign-in/confirm${stateQueryParam}`;
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: redirectTo }
		});

		if (error) {
			errorMsg = error.message;
		}
	};

	// const loginWithMicrosoft = async () => {
	// 	loading = true;
	// 	errorMsg = '';

	// 	let stateQueryParam = stateParam ? `?state=${stateParam}` : '';
	// 	let redirectTo = `${url.origin}/sign-in/confirm${stateQueryParam}`;
	// 	const { error } = await supabase.auth.signInWithOAuth({
	// 		provider: 'azure',
	// 		options: { redirectTo: redirectTo }
	// 	});

	// 	if (error) {
	// 		errorMsg = error.message;
	// 	}
	// };
</script>

<div class="my-auto flex w-full flex-col gap-6">
	{#if isSignIn}
	<div class="text-center mb-8">
							<h1 class="text-3xl font-bold text-[#1F2937] mb-2">Welcome Back</h1>
							<p class="text-slate-600">Sign in to continue your fitness journey</p>
						</div>
		<button
		onclick={loginWithGoogle}
        class="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
      >
        <!-- SVG for Google -->
        <img
          src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
          alt="Google"
          class="w-5 h-5"
        />
        <!-- Comment: Google Icon SVG here -->
        Continue with Google
      </button>
		<!-- <Button className="w-full px-4 bg-[#2F2F2F]" onclick={loginWithMicrosoft} {loading}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-2 inline-block"
				width="16"
				height="16"
				viewBox="0 0 21 21"
				><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022" /><rect
					x="1"
					y="11"
					width="9"
					height="9"
					fill="#00a4ef"
				/><rect x="11" y="1" width="9" height="9" fill="#7fba00" /><rect
					x="11"
					y="11"
					width="9"
					height="9"
					fill="#ffb900"
				/></svg
			>
			{$t('signin.signin.continueWithMicrosoft')}
		</Button> -->

		<p class="text-neutral-600">
			No account?
			<button onclick={toggleMode} class="text-neutral-600 underline hover:text-neutral-800"
				>Sign up now</button
			>
		</p>
	{:else}
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-semibold text-black">Sign up</h1>
			<p class="text-neutral-600">
				{#if message}
					{message}
				{:else}
					Create new account for using our service
				{/if}
			</p>
		</div>

		<button
		onclick={loginWithGoogle}
        class="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
      >
        <!-- SVG for Google -->
        <img
          src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
          alt="Google"
          class="w-5 h-5"
        />
        <!-- Comment: Google Icon SVG here -->
        Create account with Google
      </button>
		<!-- <Button className="w-full px-4 bg-[#2F2F2F]" onclick={loginWithMicrosoft} {loading}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-2 inline-block"
				width="16"
				height="16"
				viewBox="0 0 21 21"
				><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022" /><rect
					x="1"
					y="11"
					width="9"
					height="9"
					fill="#00a4ef"
				/><rect x="11" y="1" width="9" height="9" fill="#7fba00" /><rect
					x="11"
					y="11"
					width="9"
					height="9"
					fill="#ffb900"
				/></svg
			>
			{$t('signin.signin.createAccountWithMicrosoft')}
		</Button> -->
		<p class="text-neutral-600">
			Already have an account?
			<button onclick={toggleMode} class="text-neutral-600 underline hover:text-neutral-800"
				>Sign in now</button
			>
		</p>
	{/if}

	<ErrorBox error={errorMsg} />
</div>
