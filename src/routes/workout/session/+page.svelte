<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const {data} = $props(); let user = data.user;
	let workout = $state<any>(null);
	let currentPhase = $state('warmup'); // 'warmup', 'main', 'cooldown'
	let currentExerciseIndex = $state(0);
	let timeRemaining = $state(0);
	let isActive = $state(false);
	let isPaused = $state(false);
	let isCompleted = $state(false);
	let timer: any = null;

	// Redirect if not logged in
	$effect(() => {
		if (!user) {
			goto('/sign-in');
		}
	});

	onMount(() => {
		// Load workout from sessionStorage
		const workoutData = sessionStorage.getItem('currentWorkout');
		if (workoutData) {
			workout = JSON.parse(workoutData);
			initializeWorkout();
		} else {
			goto('/workout/generate');
		}

		// Cleanup timer on unmount
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	const initializeWorkout = () => {
		if (!workout) return;
		
		currentPhase = 'warmup';
		currentExerciseIndex = 0;
		setCurrentExercise();
	};

	const setCurrentExercise = () => {
		// Clear any existing timer first
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		
		const currentExercise = getCurrentExercise();
		if (currentExercise) {
			timeRemaining = currentExercise.duration;
			isActive = false;
			isPaused = false;
		}
	};

	const getCurrentExercise = () => {
		if (!workout) return null;
		
		switch (currentPhase) {
			case 'warmup':
				return workout.warmup[currentExerciseIndex];
			case 'main':
				return workout.exercises[currentExerciseIndex];
			case 'cooldown':
				return workout.cooldown[currentExerciseIndex];
			default:
				return null;
		}
	};

	const getCurrentPhaseExercises = () => {
		if (!workout) return [];
		
		switch (currentPhase) {
			case 'warmup':
				return workout.warmup;
			case 'main':
				return workout.exercises;
			case 'cooldown':
				return workout.cooldown;
			default:
				return [];
		}
	};

	const startTimer = () => {
		if (timeRemaining <= 0) return;
		
		isActive = true;
		isPaused = false;
		
		timer = setInterval(() => {
			timeRemaining -= 1;
			
			if (timeRemaining <= 0) {
				clearInterval(timer);
				isActive = false;
				
				// Auto advance to next exercise
				setTimeout(() => {
					nextExercise();
				}, 1000);
			}
		}, 1000);
	};

	const pauseTimer = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		isActive = false;
		isPaused = true;
	};

	const resetTimer = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		isActive = false;
		isPaused = false;
		setCurrentExercise();
	};

	const nextExercise = () => {
		// Clear any existing timer first
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		
		const currentPhaseExercises = getCurrentPhaseExercises();
		
		if (currentExerciseIndex < currentPhaseExercises.length - 1) {
			// Next exercise in current phase
			currentExerciseIndex += 1;
			setCurrentExercise();
		} else {
			// Move to next phase
			if (currentPhase === 'warmup') {
				currentPhase = 'main';
				currentExerciseIndex = 0;
				setCurrentExercise();
			} else if (currentPhase === 'main') {
				currentPhase = 'cooldown';
				currentExerciseIndex = 0;
				setCurrentExercise();
			} else {
				// Workout completed
				completeWorkout();
			}
		}
	};

	const prevExercise = () => {
		// Clear any existing timer first
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		
		if (currentExerciseIndex > 0) {
			currentExerciseIndex -= 1;
			setCurrentExercise();
		} else {
			// Move to previous phase
			if (currentPhase === 'main') {
				currentPhase = 'warmup';
				currentExerciseIndex = workout.warmup.length - 1;
				setCurrentExercise();
			} else if (currentPhase === 'cooldown') {
				currentPhase = 'main';
				currentExerciseIndex = workout.exercises.length - 1;
				setCurrentExercise();
			}
		}
	};

	const completeWorkout = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		isCompleted = true;
	};

	const finishWorkout = () => {
		goto('/workout/feedback');
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getPhaseTitle = () => {
		switch (currentPhase) {
			case 'warmup': return 'Warm-up';
			case 'main': return 'Main Exercises';
			case 'cooldown': return 'Cool-down';
			default: return '';
		}
	};

	const getProgressPercentage = () => {
		if (!workout) return 0;
		
		const totalExercises = workout.warmup.length + workout.exercises.length + workout.cooldown.length;
		let completedExercises = 0;
		
		if (currentPhase === 'warmup') {
			completedExercises = currentExerciseIndex;
		} else if (currentPhase === 'main') {
			completedExercises = workout.warmup.length + currentExerciseIndex;
		} else if (currentPhase === 'cooldown') {
			completedExercises = workout.warmup.length + workout.exercises.length + currentExerciseIndex;
		}
		
		return Math.round((completedExercises / totalExercises) * 100);
	};

	const getYouTubeEmbedUrl = (url: string) => {
		// Convert YouTube URL to embed URL
		if (url.includes('youtube.com/watch?v=')) {
			const videoId = url.split('v=')[1].split('&')[0];
			return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
		} else if (url.includes('youtu.be/')) {
			const videoId = url.split('youtu.be/')[1].split('?')[0];
			return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
		}
		return url;
	};
</script>

<svelte:head>
	<title>Workout Session - AI Physio</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
	{#if isCompleted}
		<!-- Completion Screen -->
		<div class="min-h-screen flex items-center justify-center px-6">
			<div class="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-lg">
				<div class="text-6xl mb-6">🎉</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-4">Workout Complete!</h2>
				<p class="text-gray-600 mb-8">
					Great job finishing your {workout?.totalDuration}-minute session. 
					How did it feel?
				</p>
				<Button onclick={finishWorkout} className="w-full py-3">
					Share Feedback
				</Button>
			</div>
		</div>
	{:else if workout}
		<!-- Header -->
		<header class="w-full px-6 py-4 bg-white shadow-sm">
			<div class="max-w-4xl mx-auto flex justify-between items-center">
				<div class="flex items-center space-x-4">
					<button onclick={() => goto('/dashboard')} class="text-gray-600 hover:text-gray-800">
						← Exit
					</button>
					<div>
						<h1 class="text-xl font-bold text-gray-900">{workout.title}</h1>
						<p class="text-sm text-gray-600">{getPhaseTitle()}</p>
					</div>
				</div>
				<div class="text-right">
					<div class="text-sm text-gray-600">Progress</div>
					<div class="text-lg font-semibold">{getProgressPercentage()}%</div>
				</div>
			</div>
		</header>

		<!-- Progress Bar -->
		<div class="w-full px-6 py-2 bg-white border-b">
			<div class="max-w-4xl mx-auto">
				<div class="w-full bg-gray-200 rounded-full h-2">
					<div 
						class="bg-[#63B3ED] h-2 rounded-full transition-all duration-300" 
						style="width: {getProgressPercentage()}%"
					></div>
				</div>
			</div>
		</div>

		<main class="max-w-4xl mx-auto px-6 py-8">
			{#if getCurrentExercise()}
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Timer and Controls -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center sticky top-8">
							<!-- Timer Display -->
							<div class="mb-8">
								<div class="text-5xl font-bold text-[#63B3ED] mb-2">
									{formatTime(timeRemaining)}
								</div>
								<div class="text-gray-600">
									{getCurrentExercise().duration} seconds total
								</div>
							</div>

							<!-- Controls -->
							<div class="space-y-4">
								{#if !isActive}
									<Button onclick={startTimer} className="w-full py-3">
										{isPaused ? 'Resume' : 'Start'} ▶️
									</Button>
								{:else}
									<Button onclick={pauseTimer} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600">
										Pause ⏸️
									</Button>
								{/if}

								<div class="flex space-x-2">
									<button 
										onclick={resetTimer}
										class="flex-1 py-2 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
									>
										Reset ↻
									</button>
									<button 
										onclick={nextExercise}
										class="flex-1 py-2 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
									>
										Skip →
									</button>
								</div>

								<div class="flex space-x-2 mt-4">
									<button 
										onclick={prevExercise}
										class="flex-1 py-2 text-sm text-gray-500 hover:text-gray-700"
										disabled={currentPhase === 'warmup' && currentExerciseIndex === 0}
									>
										← Previous
									</button>
									<button 
										onclick={nextExercise}
										class="flex-1 py-2 px-4 text-sm text-gray-500 hover:text-gray-700"
									>
										Next →
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Exercise Details -->
					<div class="lg:col-span-2">
						<div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
							<!-- Exercise Media (Image or Video) -->
							{#if getCurrentExercise().imageUrl || getCurrentExercise().videoUrl}
								<div class="mb-6">
									{#if getCurrentExercise().mediaType === 'video' && getCurrentExercise().videoUrl}
										<div class="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
											{#if getCurrentExercise().videoUrl.includes('youtube.com') || getCurrentExercise().videoUrl.includes('youtu.be')}
												<!-- YouTube Embed -->
												<iframe 
													src={getYouTubeEmbedUrl(getCurrentExercise().videoUrl)}
													class="w-full h-full"
													frameborder="0"
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
													allowfullscreen
												></iframe>
											{:else}
												<!-- Direct Video File -->
												<video 
													src={getCurrentExercise().videoUrl}
													class="w-full h-full object-cover"
													controls
													preload="metadata"
													poster={getCurrentExercise().imageUrl}
												>
													Your browser does not support the video tag.
												</video>
											{/if}
											<div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
												📹 Video Guide
											</div>
										</div>
									{:else if getCurrentExercise().imageUrl}
										<div class="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
											<img 
												src={getCurrentExercise().imageUrl} 
												alt={getCurrentExercise().name}
												class="w-full h-full object-cover"
												loading="lazy"
											/>
											<div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
												📷 Image Guide
											</div>
										</div>
									{/if}
								</div>
							{/if}

							<div class="mb-6">
								<div class="flex items-center space-x-2 mb-2">
									<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
										{getPhaseTitle()}
									</span>
									<span class="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full capitalize">
										{getCurrentExercise().difficulty}
									</span>
								</div>
								<h2 class="text-3xl font-bold text-gray-900 mb-2">
									{getCurrentExercise().name}
								</h2>
								<p class="text-xl text-gray-600">
									{getCurrentExercise().description}
								</p>
							</div>

							<!-- Benefits -->
							<div class="mb-6 p-4 bg-green-50 rounded-lg">
								<h3 class="font-semibold text-green-800 mb-2">Benefits</h3>
								<p class="text-green-700">{getCurrentExercise().benefits}</p>
							</div>

							<!-- Instructions -->
							<div>
								<h3 class="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
								<ol class="space-y-3">
									{#each getCurrentExercise().instructions as instruction, index}
										<li class="flex items-start space-x-3">
											<span class="flex-shrink-0 w-6 h-6 bg-[#63B3ED] text-white text-sm font-bold rounded-full flex items-center justify-center">
												{index + 1}
											</span>
											<span class="text-gray-700">{instruction}</span>
										</li>
									{/each}
								</ol>
							</div>

							<!-- Target Areas -->
							<div class="mt-6 pt-6 border-t border-gray-200">
								<h4 class="font-medium text-gray-600 mb-2">Target Areas</h4>
								<div class="flex flex-wrap gap-2">
									{#each getCurrentExercise().targetAreas as area}
										<span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full capitalize">
											{area.replace('_', ' ')}
										</span>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</main>
	{:else}
		<div class="min-h-screen flex items-center justify-center">
			<div class="text-lg text-gray-600">Loading workout...</div>
		</div>
	{/if}
</div>
