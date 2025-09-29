<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const {data} = $props(); let user = data.user;
	
	// Onboarding state
	let currentStep = $state(1);
	let totalSteps = 4;
	
	// Form data
	let goals = $state<string[]>([]);
	let painAreas = $state<string[]>([]);
	let timeAvailable = $state(15);
	let experienceLevel = $state('beginner');
	
	// Goal options
	const goalOptions = [
		{ id: 'flexibility', label: 'Improve flexibility', icon: '🤸‍♀️' },
		{ id: 'pain_relief', label: 'Reduce pain', icon: '🩹' },
		{ id: 'mobility', label: 'Better mobility', icon: '🚶‍♂️' },
		{ id: 'posture', label: 'Fix posture', icon: '🏃‍♂️' },
		{ id: 'strength', label: 'Build strength', icon: '💪' },
		{ id: 'recovery', label: 'Post-injury recovery', icon: '⚕️' }
	];
	
	// Pain area options
	const painAreaOptions = [
		{ id: 'lower_back', label: 'Lower back', icon: '🦴' },
		{ id: 'neck', label: 'Neck', icon: '👤' },
		{ id: 'shoulders', label: 'Shoulders', icon: '🤷‍♂️' },
		{ id: 'hips', label: 'Hips', icon: '🦵' },
		{ id: 'knees', label: 'Knees', icon: '🦵' },
		{ id: 'ankles', label: 'Ankles', icon: '🦶' },
		{ id: 'wrists', label: 'Wrists', icon: '✋' },
		{ id: 'upper_back', label: 'Upper back', icon: '🔙' }
	];

	// Redirect if not logged in
	$effect(() => {
		if (!user) {
			goto('/sign-in');
		}
	});

	const toggleGoal = (goalId: string) => {
		if (goals.includes(goalId)) {
			goals = goals.filter(g => g !== goalId);
		} else {
			goals = [...goals, goalId];
		}
	};

	const togglePainArea = (areaId: string) => {
		if (painAreas.includes(areaId)) {
			painAreas = painAreas.filter(a => a !== areaId);
		} else {
			painAreas = [...painAreas, areaId];
		}
	};

	const nextStep = () => {
		if (currentStep < totalSteps) {
			currentStep += 1;
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			currentStep -= 1;
		}
	};

	const canProceed = () => {
		switch (currentStep) {
			case 1: return goals.length > 0;
			case 2: return painAreas.length > 0;
			case 3: return timeAvailable > 0;
			case 4: return experienceLevel !== '';
			default: return false;
		}
	};

	const completeOnboarding = async () => {
		// Save user preferences
		const preferences = {
			goals,
			painAreas,
			timeAvailable,
			experienceLevel,
			completedAt: new Date().toISOString()
		};

		try {
			const response = await fetch('/api/user/preferences', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(preferences)
			});

			if (response.ok) {
				goto('/dashboard');
			} else {
				console.error('Failed to save preferences');
			}
		} catch (error) {
			console.error('Error saving preferences:', error);
		}
	};
</script>

<svelte:head>
	<title>Get Started - AI Physio</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
	<!-- Header -->
	<header class="w-full px-6 py-4">
		<div class="max-w-4xl mx-auto flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
					<span class="text-white font-bold text-lg">🏃</span>
				</div>
				<h1 class="text-2xl font-bold text-gray-900">AI Physio</h1>
			</div>
			<div class="text-sm text-gray-600">
				Step {currentStep} of {totalSteps}
			</div>
		</div>
	</header>

	<!-- Progress Bar -->
	<div class="w-full px-6 mb-8">
		<div class="max-w-4xl mx-auto">
			<div class="w-full bg-gray-200 rounded-full h-2">
				<div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: {(currentStep / totalSteps) * 100}%"></div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-4xl mx-auto px-6 pb-12">
		{#if currentStep === 1}
			<!-- Step 1: Goals -->
			<div class="text-center mb-12">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					What are your main goals?
				</h2>
				<p class="text-xl text-gray-600">
					Select all that apply - we'll personalize your plan accordingly
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
				{#each goalOptions as goal}
					<button
						class="p-6 rounded-xl border-2 transition-all duration-200 text-left
							{goals.includes(goal.id) 
								? 'border-blue-500 bg-blue-50 shadow-md' 
								: 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}"
						onclick={() => toggleGoal(goal.id)}
					>
						<div class="text-3xl mb-3">{goal.icon}</div>
						<h3 class="font-semibold text-gray-900 mb-1">{goal.label}</h3>
					</button>
				{/each}
			</div>

		{:else if currentStep === 2}
			<!-- Step 2: Pain Areas -->
			<div class="text-center mb-12">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					Where do you experience discomfort?
				</h2>
				<p class="text-xl text-gray-600">
					We'll focus on exercises that target these areas
				</p>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
				{#each painAreaOptions as area}
					<button
						class="p-6 rounded-xl border-2 transition-all duration-200 text-center
							{painAreas.includes(area.id) 
								? 'border-blue-500 bg-blue-50 shadow-md' 
								: 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}"
						onclick={() => togglePainArea(area.id)}
					>
						<div class="text-3xl mb-3">{area.icon}</div>
						<h3 class="font-semibold text-gray-900 text-sm">{area.label}</h3>
					</button>
				{/each}
			</div>

		{:else if currentStep === 3}
			<!-- Step 3: Time Available -->
			<div class="text-center mb-12">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					How much time do you typically have?
				</h2>
				<p class="text-xl text-gray-600">
					We'll create plans that fit your schedule
				</p>
			</div>

			<div class="max-w-md mx-auto">
				<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
					<div class="text-center mb-6">
						<div class="text-4xl font-bold text-blue-600 mb-2">{timeAvailable} minutes</div>
						<p class="text-gray-600">per session</p>
					</div>
					
					<input
						type="range"
						min="5"
						max="60"
						step="5"
						bind:value={timeAvailable}
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
					/>
					
					<div class="flex justify-between text-sm text-gray-500 mt-2">
						<span>5 min</span>
						<span>60 min</span>
					</div>
				</div>
			</div>

		{:else if currentStep === 4}
			<!-- Step 4: Experience Level -->
			<div class="text-center mb-12">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					What's your experience level?
				</h2>
				<p class="text-xl text-gray-600">
					We'll adjust exercise difficulty accordingly
				</p>
			</div>

			<div class="max-w-2xl mx-auto space-y-4">
				{#each [
					{ id: 'beginner', label: 'Beginner', desc: 'New to stretching and exercise', icon: '🌱' },
					{ id: 'intermediate', label: 'Intermediate', desc: 'Some experience with fitness routines', icon: '💪' },
					{ id: 'advanced', label: 'Advanced', desc: 'Very active with regular exercise', icon: '🏆' }
				] as level}
					<button
						class="w-full p-6 rounded-xl border-2 transition-all duration-200 text-left
							{experienceLevel === level.id 
								? 'border-blue-500 bg-blue-50 shadow-md' 
								: 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}"
						onclick={() => experienceLevel = level.id}
					>
						<div class="flex items-center space-x-4">
							<div class="text-3xl">{level.icon}</div>
							<div>
								<h3 class="font-semibold text-gray-900 mb-1">{level.label}</h3>
								<p class="text-gray-600">{level.desc}</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Navigation -->
		<div class="flex justify-between items-center mt-12 max-w-4xl mx-auto">
			<button
				onclick={prevStep}
				class="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={currentStep === 1}
			>
				← Previous
			</button>

			{#if currentStep < totalSteps}
				<Button
					onclick={nextStep}
					disabled={!canProceed()}
					className="px-8 py-3 bg-none"
				>
					Next →
				</Button>
			{:else}
				<Button
					onclick={completeOnboarding}
					disabled={!canProceed()}
					className="px-8 py-3"
				>
					Complete Setup 🎉
				</Button>
			{/if}
		</div>
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
