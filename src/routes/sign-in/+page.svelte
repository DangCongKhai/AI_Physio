<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Authentication from '$lib/components/Authentication.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorBox from '$lib/components/ErrorBox.svelte';



	let url = page.url;
	let stateParam = url.searchParams.get('state');
	// const supabase = useSupabaseClient();
	// const user = useSupabaseUser();
	let { data } = $props();

	$effect(() => {
		if (data.user) {
			console.log(data.user);
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

<div class="h-[100vh] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
	<div class="grid h-full grid-cols-9 gap-4">
		<div class="col-span-9 flex flex-col justify-end md:col-span-4">
			<div class="p-6">
				<a href="/">
					<div class="flex items-center space-x-3">
						<img 
							src="/ai_physio_logo.png" 
							alt="AI Physio Logo" 
							class="w-12 h-12"
						/>
						<div class="text-2xl font-bold text-[#1F2937]">AI Physio</div>
					</div>
				</a>
			</div>

			<div class="grid h-full grid-cols-7">
				<div class="col-span-5 col-start-2 flex flex-col content-center items-center">
					<div class="my-auto flex w-full flex-col gap-6 pb-24">
						<Authentication supabase={data.supabase} mode="sign-in" {stateParam}></Authentication>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-7">
				<div class="col-span-5 col-start-2 py-8">
					<p class="text-xs text-slate-600">
						By continuing, you agree to our
						<a href="/terms" class="underline text-[#3182CE] hover:text-[#1E40AF]">Terms of Service</a>
						and
						<a href="/privacy" class="underline text-[#3182CE] hover:text-[#1E40AF]">Privacy Policy</a>, and you may receive communications from us.
					</p>
				</div>
			</div>
		</div>

		<div
			class="hidden content-center items-center bg-gradient-to-br from-[#3182CE]/5 to-[#63B3ED]/10 md:col-span-5 md:col-start-5 md:flex"
		>
			<div class="relative m-auto flex flex-col gap-8 text-center">
				<div class="mb-8">
					<h2 class="text-4xl font-bold text-[#1F2937] mb-4">Transform Your Fitness Journey</h2>
					<p class="text-xl text-slate-600">AI-powered physiotherapy guidance for better health and mobility</p>
				</div>
				
				<div class="space-y-6">
					<div class="flex items-center justify-center space-x-4">
						<div class="w-12 h-12 bg-gradient-to-br from-[#3182CE] to-[#63B3ED] rounded-2xl flex items-center justify-center">
							<span class="text-white text-xl">🎯</span>
						</div>
						<div class="text-left">
							<h3 class="font-bold text-[#1F2937]">Personalized Plans</h3>
							<p class="text-slate-600 text-sm">Tailored to your specific goals and needs</p>
						</div>
					</div>
					
					<div class="flex items-center justify-center space-x-4">
						<div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
							<span class="text-white text-xl">⏱️</span>
						</div>
						<div class="text-left">
							<h3 class="font-bold text-[#1F2937]">Built-in Timers</h3>
							<p class="text-slate-600 text-sm">Perfect timing for every exercise</p>
						</div>
					</div>
					
					<div class="flex items-center justify-center space-x-4">
						<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
							<span class="text-white text-xl">📈</span>
						</div>
						<div class="text-left">
							<h3 class="font-bold text-[#1F2937]">Progress Tracking</h3>
							<p class="text-slate-600 text-sm">Monitor your improvement over time</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
