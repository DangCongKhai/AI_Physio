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
		await fetch('/api/auth/signout', { method: 'POST' });
		goto('/');
	};
</script>

<svelte:head>
	<title>Dashboard - AI Physio</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
	<!-- Header -->
	<header class="w-full px-6 py-4 bg-white shadow-sm">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
					<span class="text-white font-bold text-lg">🏃</span>
				</div>
				<h1 class="text-2xl font-bold text-gray-900">AI Physio</h1>
			</div>
			<div class="flex items-center space-x-4">
				<span class="text-gray-600">Hello, {user?.email?.split('@')[0] || 'there'}!</span>
				<button onclick={signOut} class="text-gray-600 hover:text-gray-800">Sign Out</button>
			</div>
		</div>
	</header>

	{#if loading}
		<div class="flex items-center justify-center min-h-96">
			<div class="text-lg text-gray-600">Loading your dashboard...</div>
		</div>
	{:else if preferences}
		<main class="max-w-7xl mx-auto px-6 py-12">
			<!-- Welcome Section -->
			<div class="mb-12">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					Ready for your next session?
				</h2>
				<p class="text-xl text-gray-600">
					Let's continue your journey to better health and mobility
				</p>
			</div>

			<!-- Quick Start -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				<!-- Main CTA -->
				<div class="lg:col-span-2">
					<div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
						<h3 class="text-2xl font-bold mb-4">Start Your Personalized Workout</h3>
						<p class="text-blue-100 mb-6">
							Get an AI-generated plan based on your goals and available time
						</p>
						<Button onclick={startWorkout} variant="secondary" size="lg">
							Generate Today's Plan
						</Button>
					</div>
				</div>

				<!-- Quick Stats -->
				<div class="space-y-4">
					<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
						<div class="text-2xl font-bold text-gray-900">{weeklyMinutes} min</div>
						<div class="text-gray-600">This week</div>
					</div>
					<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
						<div class="text-2xl font-bold text-gray-900">{streak} days</div>
						<div class="text-gray-600">Current streak</div>
					</div>
					<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
						<div class="text-2xl font-bold text-gray-900">{lastWorkout}</div>
						<div class="text-gray-600">Last workout</div>
					</div>
				</div>
			</div>

			<!-- Your Profile -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Goals & Focus Areas -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<h3 class="text-xl font-semibold text-gray-900 mb-4">Your Goals</h3>
					<div class="space-y-3">
						{#each preferences.goals as goal}
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
								<span class="text-gray-700 capitalize">{goal.replace('_', ' ')}</span>
							</div>
						{/each}
					</div>
					
					<h4 class="text-lg font-semibold text-gray-900 mt-6 mb-4">Focus Areas</h4>
					<div class="space-y-3">
						{#each preferences.pain_areas as area}
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-red-400 rounded-full"></div>
								<span class="text-gray-700 capitalize">{area.replace('_', ' ')}</span>
							</div>
						{/each}
					</div>
					
					<button 
						onclick={updatePreferences}
						class="mt-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
					>
						Update preferences →
					</button>
				</div>

				<!-- Workout Preferences -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<h3 class="text-xl font-semibold text-gray-900 mb-4">Workout Preferences</h3>
					
					<div class="space-y-4">
						<div>
							<label class="text-sm font-medium text-gray-600">Typical Session Length</label>
							<div class="text-2xl font-bold text-gray-900">{preferences.time_available} minutes</div>
						</div>
						
						<div>
							<label class="text-sm font-medium text-gray-600">Experience Level</label>
							<div class="text-lg font-semibold text-gray-900 capitalize">{preferences.experience_level}</div>
						</div>
						
						<div class="pt-4">
							<h4 class="text-sm font-medium text-gray-600 mb-2">Recent Activity</h4>
							<div class="text-gray-500 text-sm">
								No recent workouts yet. Start your first session above!
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick Tips -->
			<div class="mt-12">
				<h3 class="text-xl font-semibold text-gray-900 mb-6">Tips for Success</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
						<div class="text-3xl mb-3">⏰</div>
						<h4 class="font-semibold text-gray-900 mb-2">Stay Consistent</h4>
						<p class="text-gray-600 text-sm">Short, regular sessions are more effective than long, infrequent ones</p>
					</div>
					<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
						<div class="text-3xl mb-3">🎯</div>
						<h4 class="font-semibold text-gray-900 mb-2">Listen to Your Body</h4>
						<p class="text-gray-600 text-sm">Stop if you feel pain, and always warm up before stretching</p>
					</div>
					<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
						<div class="text-3xl mb-3">📈</div>
						<h4 class="font-semibold text-gray-900 mb-2">Track Progress</h4>
						<p class="text-gray-600 text-sm">Complete the post-workout feedback to improve your plan</p>
					</div>
				</div>
			</div>
		</main>
	{/if}
</div>
