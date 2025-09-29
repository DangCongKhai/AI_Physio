<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const {data} = $props(); let user = data.user;
	let loading = $state(false);
	let rating = $state(3);
	let difficulty = $state('just_right');
	let painReduction = $state(3);
	let comments = $state('');
	let improvements = $state([]);

	// Redirect if not logged in
	$effect(() => {
		if (!user) {
			goto('/sign-in');
		}
	});

	const difficultyOptions = [
		{ id: 'too_easy', label: 'Too easy', icon: '😴' },
		{ id: 'just_right', label: 'Just right', icon: '😊' },
		{ id: 'too_hard', label: 'Too challenging', icon: '😅' }
	];

	const improvementOptions = [
		{ id: 'more_time', label: 'More time per exercise' },
		{ id: 'less_time', label: 'Less time per exercise' },
		{ id: 'easier_exercises', label: 'Easier exercises' },
		{ id: 'harder_exercises', label: 'More challenging exercises' },
		{ id: 'more_variety', label: 'More exercise variety' },
		{ id: 'different_focus', label: 'Different focus areas' }
	];

	const toggleImprovement = (improvementId) => {
		if (improvements.includes(improvementId)) {
			improvements = improvements.filter(i => i !== improvementId);
		} else {
			improvements = [...improvements, improvementId];
		}
	};

	const submitFeedback = async () => {
		loading = true;
		try {
			const feedback = {
				rating,
				difficulty,
				painReduction,
				comments,
				improvements,
				completedAt: new Date().toISOString()
			};

			// In a real app, we'd save this feedback
			// For demo, we'll just simulate the API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Clear workout from session storage
			sessionStorage.removeItem('currentWorkout');
			
			goto('/dashboard');
		} catch (error) {
			console.error('Error submitting feedback:', error);
		} finally {
			loading = false;
		}
	};

	const skipFeedback = () => {
		sessionStorage.removeItem('currentWorkout');
		goto('/dashboard');
	};
</script>

<svelte:head>
	<title>Workout Feedback - AI Physio</title>
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
			<button onclick={skipFeedback} class="text-gray-600 hover:text-gray-800">
				Skip for now
			</button>
		</div>
	</header>

	<main class="max-w-4xl mx-auto px-6 py-12">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="text-6xl mb-4">🎯</div>
			<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
				How was your workout?
			</h2>
			<p class="text-xl text-gray-600">
				Your feedback helps us create better workouts for you
			</p>
		</div>

		<div class="space-y-8">
			<!-- Overall Rating -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h3 class="text-xl font-semibold text-gray-900 mb-4">Overall satisfaction</h3>
				<div class="flex justify-center space-x-2 mb-4">
					{#each [1, 2, 3, 4, 5] as star}
						<button
							onclick={() => rating = star}
							class="text-3xl transition-colors {rating >= star ? 'text-yellow-400' : 'text-gray-300'}"
						>
							⭐
						</button>
					{/each}
				</div>
				<p class="text-center text-gray-600">
					{rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very good' : 'Excellent'}
				</p>
			</div>

			<!-- Difficulty -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h3 class="text-xl font-semibold text-gray-900 mb-4">How was the difficulty level?</h3>
				<div class="grid grid-cols-3 gap-4">
					{#each difficultyOptions as option}
						<button
							onclick={() => difficulty = option.id}
							class="p-4 rounded-lg border-2 transition-all text-center
								{difficulty === option.id 
									? 'border-blue-500 bg-blue-50' 
									: 'border-gray-200 hover:border-gray-300'}"
						>
							<div class="text-2xl mb-2">{option.icon}</div>
							<div class="font-medium text-gray-900">{option.label}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Pain Reduction -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h3 class="text-xl font-semibold text-gray-900 mb-4">
					How do you feel compared to before the workout?
				</h3>
				<div class="mb-4">
					<input
						type="range"
						min="1"
						max="5"
						bind:value={painReduction}
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
					/>
				</div>
				<div class="flex justify-between text-sm text-gray-600">
					<span>Much worse</span>
					<span>No change</span>
					<span>Much better</span>
				</div>
				<p class="text-center mt-2 font-medium">
					{painReduction === 1 ? 'Much worse' : 
					 painReduction === 2 ? 'Slightly worse' : 
					 painReduction === 3 ? 'About the same' : 
					 painReduction === 4 ? 'Slightly better' : 'Much better'}
				</p>
			</div>

			<!-- Improvements -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h3 class="text-xl font-semibold text-gray-900 mb-4">
					What would make future workouts better? (Optional)
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					{#each improvementOptions as option}
						<label class="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
							<input
								type="checkbox"
								checked={improvements.includes(option.id)}
								onchange={() => toggleImprovement(option.id)}
								class="w-4 h-4 text-blue-600 rounded"
							/>
							<span class="text-gray-700">{option.label}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Comments -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
				<h3 class="text-xl font-semibold text-gray-900 mb-4">
					Additional comments (Optional)
				</h3>
				<textarea
					bind:value={comments}
					placeholder="Tell us more about your experience..."
					class="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				></textarea>
			</div>

			<!-- Submit -->
			<div class="flex justify-center space-x-4">
				<button
					onclick={skipFeedback}
					class="px-8 py-3 text-gray-600 hover:text-gray-800"
				>
					Skip
				</button>
				<Button
					onclick={submitFeedback}
					disabled={loading}
					className="px-8 py-3"
				>
					{#if loading}
						<div class="flex items-center space-x-2">
							<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							<span>Submitting...</span>
						</div>
					{:else}
						Submit Feedback
					{/if}
				</Button>
			</div>
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
