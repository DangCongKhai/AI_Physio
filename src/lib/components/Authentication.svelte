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
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-semibold text-black">Welcomback</h1>
			<p class="text-neutral-600">Sign in</p>
		</div>

		<Button className="w-full" variant="primary" size="md" onclick={loginWithGoogle} {loading}>
			{#if !loading}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 30 30"
					width="16px"
					height="16px"
					fill="currentColor"
					class="mr-2"
				>
					<path
						d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"
					/>
				</svg>
			{/if}
			Continue with Google
		</Button>
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
			<h1 class="text-2xl font-semibold text-black">Sign up title</h1>
			<p class="text-neutral-600">
				{#if message}
					{message}
				{:else}
					Description
				{/if}
			</p>
		</div>

		<Button className="w-full" variant="primary" size="md" onclick={loginWithGoogle} {loading}>
			{#if !loading}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 30 30"
					width="16px"
					height="16px"
					fill="currentColor"
					class="mr-2"
				>
					<path
						d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"
					/>
				</svg>
			{/if}
			Create account with Google
		</Button>
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
