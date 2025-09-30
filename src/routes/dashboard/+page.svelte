<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const {data} = $props(); let user = data.user;
	let preferences = $state<UserPreferences|null>(null);
	let loading = $state(true);
	let weeklyMinutes = $state(0);
	let streak = $state(0);
	let lastWorkout = $state<string|null>(null);

	// Redirect if not logged in
	$effect(() => {
		if (!user) {
			goto('/sign-in');
		}
	});

	onMount(async () => {
		if (user) {
			await loadUserData();
		}
	});

	const loadUserData = async () => {
		try {
			// Load user preferences
			const prefsResponse = await fetch('/api/user/preferences');
			if (prefsResponse.ok) {
				const result = await prefsResponse.json();
				preferences = result.preferences;
				
				// If no preferences, redirect to onboarding
				if (!preferences) {
					goto('/onboarding');
					return;
				}
			}

			// Load workout stats (mock data for now)
			weeklyMinutes = 45; // TODO: Calculate from actual workouts
			streak = 3; // TODO: Calculate from actual workouts
			lastWorkout = '2 days ago'; // TODO: Calculate from actual workouts
		} catch (error) {
			console.error('Error loading user data:', error);
		} finally {
			loading = false;
		}
	};

	const startWorkout = () => {
		goto('/workout/generate');
	};

	const updatePreferences = () => {
		goto('/onboarding');
	};

	const signOut = async () => {
		// Sign out logic here
		const { error } = await data.supabase.auth.signOut();
		await goto('/');
	};
	console.log(user);
</script>

<svelte:head>
	<title>Dashboard - AI Physio</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
	<!-- Header -->
	<header class="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<a href="/">
				<div class="flex items-center space-x-3">
					<img 
						src="/ai_physio_logo.png" 
						alt="AI Physio Logo" 
						class="w-12 h-12"
					/>
					<h1 class="text-2xl font-bold text-[#1F2937]">AI Physio</h1>
				</div>
			</a>
			
			<div class="flex items-center space-x-4">
				<span class="text-slate-600 font-medium">Hello, {user?.user_metadata.name || 'there'}!</span>
				<button 
					onclick={signOut} 
					class="px-4 py-2 text-slate-600 hover:text-[#1F2937] font-medium border border-slate-200 rounded-lg hover:border-[#63B3ED] hover:bg-blue-50/50 transition-colors duration-200"
				>
					Sign Out
				</button>
			</div>
		</div>
	</header>

	{#if loading}
		<div class="flex items-center justify-center min-h-96">
			<div class="text-lg text-slate-600">Loading your dashboard...</div>
		</div>
	{:else if preferences}
		<main class="max-w-7xl mx-auto px-6 py-12">
			<!-- Welcome Section -->
			<div class="mb-12">
				<h2 class="text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6">
					Ready for your next session?
				</h2>
				<p class="text-xl text-slate-600">
					Let's continue your journey to better health and mobility
				</p>
			</div>

			<!-- Quick Start -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				<!-- Main CTA -->
				<div class="lg:col-span-2">
					<div class="bg-gradient-to-r from-[#3182CE] to-[#63B3ED] rounded-3xl p-10 text-white shadow-2xl">
						<h3 class="text-3xl font-bold mb-4">Start Your Personalized Workout</h3>
						<p class="text-blue-100 mb-8 text-lg">
							Get an AI-generated plan based on your goals and available time
						</p>
						<Button onclick={startWorkout} variant="secondary" size="lg">
							Generate Today's Plan
						</Button>
					</div>
				</div>

				<!-- Quick Stats -->
				<div class="space-y-6">
					<div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
						<div class="text-3xl font-bold text-[#1F2937]">{weeklyMinutes} min</div>
						<div class="text-slate-600 font-medium">This week</div>
					</div>
					<div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
						<div class="text-3xl font-bold text-[#1F2937]">{streak} days</div>
						<div class="text-slate-600 font-medium">Current streak</div>
					</div>
					<div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
						<div class="text-3xl font-bold text-[#1F2937]">{lastWorkout}</div>
						<div class="text-slate-600 font-medium">Last workout</div>
					</div>
				</div>
			</div>

			<!-- Your Profile -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Goals & Focus Areas -->
				<div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
					<h3 class="text-2xl font-bold text-[#1F2937] mb-6">Your Goals</h3>
					<div class="space-y-4">
						{#each preferences.goals as goal}
							<div class="flex items-center space-x-3">
								<div class="w-3 h-3 bg-[#63B3ED] rounded-full"></div>
								<span class="text-slate-700 capitalize font-medium">{goal.replace('_', ' ')}</span>
							</div>
						{/each}
					</div>
					
					<h4 class="text-xl font-bold text-[#1F2937] mt-8 mb-6">Focus Areas</h4>
					<div class="space-y-4">
						{#each preferences.pain_areas as area}
							<div class="flex items-center space-x-3">
								<div class="w-3 h-3 bg-red-400 rounded-full"></div>
								<span class="text-slate-700 capitalize font-medium">{area.replace('_', ' ')}</span>
							</div>
						{/each}
					</div>
					
					<button 
						onclick={updatePreferences}
						class="mt-8 text-[#3182CE] hover:text-[#1E40AF] text-sm font-semibold transition-colors duration-200"
					>
						Update preferences →
					</button>
				</div>

				<!-- Workout Preferences -->
				<div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
					<h3 class="text-2xl font-bold text-[#1F2937] mb-6">Workout Preferences</h3>
					
					<div class="space-y-6">
						<div>
							<div class="text-sm font-medium text-slate-600">Typical Session Length</div>
							<div class="text-3xl font-bold text-[#1F2937]">{preferences.time_available} minutes</div>
						</div>
						
						<div>
							<div class="text-sm font-medium text-slate-600">Experience Level</div>
							<div class="text-xl font-semibold text-[#1F2937] capitalize">{preferences.experience_level}</div>
						</div>
						
						<div class="pt-4">
							<h4 class="text-sm font-medium text-slate-600 mb-2">Recent Activity</h4>
							<div class="text-slate-500 text-sm">
								No recent workouts yet. Start your first session above!
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick Tips -->
			<div class="mt-16">
				<h3 class="text-3xl font-bold text-[#1F2937] mb-8">Tips for Success</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow duration-300">
						<div class="text-4xl mb-4">⏰</div>
						<h4 class="font-bold text-[#1F2937] mb-3 text-lg">Stay Consistent</h4>
						<p class="text-slate-600">Short, regular sessions are more effective than long, infrequent ones</p>
					</div>
					<div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow duration-300">
						<div class="text-4xl mb-4">🎯</div>
						<h4 class="font-bold text-[#1F2937] mb-3 text-lg">Listen to Your Body</h4>
						<p class="text-slate-600">Stop if you feel pain, and always warm up before stretching</p>
					</div>
					<div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow duration-300">
						<div class="text-4xl mb-4">📈</div>
						<h4 class="font-bold text-[#1F2937] mb-3 text-lg">Track Progress</h4>
						<p class="text-slate-600">Complete the post-workout feedback to improve your plan</p>
					</div>
				</div>
			</div>
		</main>
	{/if}
</div>
