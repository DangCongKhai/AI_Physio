<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const {data} = $props(); let user = data.user;
	let loading = $state(false);
	let preferences = $state(null);
	let customTime = $state(null);
	let specialFocus = $state('');

	// Redirect if not logged in
	$effect(() => {
		if (!user) {
			goto('/sign-in');
		}
	});

	onMount(async () => {
		if (user) {
			await loadPreferences();
		}
	});

	const loadPreferences = async () => {
		try {
			const response = await fetch('/api/user/preferences');
			if (response.ok) {
				const result = await response.json();
				preferences = result.preferences;
				
				if (!preferences) {
					goto('/onboarding');
					return;
				}

				customTime = preferences.time_available;
			}
		} catch (error) {
			console.error('Error loading preferences:', error);
		}
	};

	const generateWorkout = async () => {
		if (!preferences) return;

		loading = true;
		try {
			const workoutRequest = {
				goals: preferences.goals,
				painAreas: preferences.pain_areas,
				timeAvailable: customTime || preferences.time_available,
				experienceLevel: preferences.experience_level,
				focusToday: specialFocus
			};

			const response = await fetch('/api/workout/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(workoutRequest)
			});

			if (response.ok) {
				const result = await response.json();
				// Store workout in sessionStorage for the workout session
				sessionStorage.setItem('currentWorkout', JSON.stringify(result.workout));
				goto('/workout/session');
			} else {
				console.error('Failed to generate workout');
			}
		} catch (error) {
			console.error('Error generating workout:', error);
		} finally {
			loading = false;
		}
	};

	const specialFocusOptions = [
		{ id: '', label: 'Standard plan based on my preferences' },
		{ id: 'morning_mobility', label: 'Morning mobility routine' },
		{ id: 'desk_break', label: 'Quick desk break stretches' },
		{ id: 'pre_workout', label: 'Pre-workout warm-up' },
		{ id: 'post_workout', label: 'Post-workout recovery' },
		{ id: 'stress_relief', label: 'Stress relief and relaxation' },
		{ id: 'energy_boost', label: 'Energy-boosting session' }
	];
</script>

<svelte:head>
	<title>Generate Workout - AI Physio</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
	<!-- Header -->
	<header class="w-full px-6 py-4 bg-white shadow-sm">
		<div class="max-w-4xl mx-auto flex justify-between items-center">
			<div class="flex items-center space-x-3">
				<img 
					src="/ai_physio_logo.png" 
					alt="AI Physio Logo" 
					class="w-12 h-12"
				/>
				<h1 class="text-2xl font-bold text-[#1F2937]">AI Physio</h1>
			</div>
			<button onclick={() => goto('/dashboard')} class="text-gray-600 hover:text-gray-800">
				← Back to Dashboard
			</button>
		</div>
	</header>

	<main class="max-w-4xl mx-auto px-6 py-12">
		{#if preferences}
			<!-- Header -->
			<div class="text-center mb-12">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					Let's Create Your Workout
				</h2>
				<p class="text-xl text-gray-600">
					Customize today's session or use your standard preferences
				</p>
			</div>

			<!-- Customization Options -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
				<!-- Time Adjustment -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<h3 class="text-xl font-semibold text-gray-900 mb-4">Session Length</h3>
					<div class="mb-4">
						<div class="text-2xl font-bold text-[#63B3ED] mb-2">{customTime} minutes</div>
						<p class="text-gray-600 text-sm">Your usual: {preferences.time_available} minutes</p>
					</div>
					
					<input
						type="range"
						min="5"
						max="60"
						step="5"
						bind:value={customTime}
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
					/>
					
					<div class="flex justify-between text-sm text-gray-500 mt-2">
						<span>5 min</span>
						<span>60 min</span>
					</div>
				</div>

				<!-- Special Focus -->
				<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<h3 class="text-xl font-semibold text-gray-900 mb-4">Special Focus Today</h3>
					<div class="space-y-3">
						{#each specialFocusOptions as option}
							<label class="flex items-center space-x-3 cursor-pointer">
								<input
									type="radio"
									bind:group={specialFocus}
									value={option.id}
									class="w-4 h-4 text-[#63B3ED]"
								/>
								<span class="text-gray-700">{option.label}</span>
							</label>
						{/each}
					</div>
				</div>
			</div>

			<!-- Your Current Preferences -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
				<h3 class="text-xl font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h4 class="font-medium text-gray-600 mb-2">Goals</h4>
						<div class="space-y-1">
							{#each preferences.goals as goal}
								<div class="text-sm text-gray-800 capitalize">{goal.replace('_', ' ')}</div>
							{/each}
						</div>
					</div>
					
					<div>
						<h4 class="font-medium text-gray-600 mb-2">Focus Areas</h4>
						<div class="space-y-1">
							{#each preferences.pain_areas as area}
								<div class="text-sm text-gray-800 capitalize">{area.replace('_', ' ')}</div>
							{/each}
						</div>
					</div>
					
					<div>
						<h4 class="font-medium text-gray-600 mb-2">Experience</h4>
						<div class="text-sm text-gray-800 capitalize">{preferences.experience_level}</div>
					</div>
				</div>
				
				<button 
					onclick={() => goto('/onboarding')}
					class="mt-4 text-[#63B3ED] hover:text-blue-800 text-sm font-medium"
				>
					Update preferences →
				</button>
			</div>

			<!-- Generate Button -->
			<div class="text-center">
				<Button
					onclick={generateWorkout}
					disabled={loading}
					className="px-12 py-4 text-lg"
				>
					{#if loading}
						<div class="flex items-center space-x-2">
							<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							<span>Generating your personalized plan...</span>
						</div>
					{:else}
						🤖 Generate My Workout Plan
					{/if}
				</Button>
				
				{#if !loading}
					<p class="text-gray-500 text-sm mt-3">
						This will create a custom plan with exercises, timers, and guidance
					</p>
				{/if}
			</div>
		{:else}
			<div class="text-center py-12">
				<div class="text-lg text-gray-600">Loading your preferences...</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
	}
</style>
