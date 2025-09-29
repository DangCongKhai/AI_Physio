<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	
	const {data} = $props()

	let user = data.user;

	const handleGetStarted = () => {
		if (user) {
			window.location.href = '/onboarding';
		} else {
			window.location.href = '/sign-in';
		}
	};

	const handleSignInClick = () => {
		if (user) {
			window.location.href = '/dashboard';
		} else {
			window.location.href = '/sign-in';
		}
	};
</script>

<svelte:head>
	<title>AI Physio - Your Personal Physical Therapy Coach</title>
</svelte:head>
<div class="min-h-[100vh] bg-gradient-to-br from-blue-50 to-green-50">
	<!-- Header -->
	<header class="w-full px-6 py-4">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
					<span class="text-white font-bold text-lg">🏃</span>
				</div>
				<h1 class="text-2xl font-bold text-gray-900">AI Physio</h1>
			</div>
			<button class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium" onclick={handleSignInClick}>
				{user ? 'Dashboard' : 'Sign In'}
			</button>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="max-w-7xl mx-auto px-6 py-16">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<div>
				<h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
					Your Personal 
					<span class="text-blue-600">Physical Therapy</span> 
					Coach
				</h1>
				<p class="text-xl text-gray-700 mt-6 leading-relaxed">
					Transform aches and pains into strength and flexibility with AI-powered, personalized stretching and rehab plans. 
					Get custom exercise routines with built-in timers and visual guidance.
				</p>
				<div class="mt-8 space-y-4">
					<Button onclick={handleGetStarted} variant="primary" size="lg">
						Start Your Recovery Journey
					</Button>
					<p class="text-sm text-gray-500">✓ Personalized plans ✓ Visual guidance ✓ Progress tracking</p>
				</div>
			</div>
			<div class="relative">
				<div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					<div class="space-y-4">
						<div class="flex items-center space-x-3">
							<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<span class="text-green-600 text-xl">🎯</span>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900">Targeted Relief</h3>
								<p class="text-gray-600 text-sm">Focus on your specific pain areas</p>
							</div>
						</div>
						<div class="flex items-center space-x-3">
							<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<span class="text-blue-600 text-xl">⏱️</span>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900">Built-in Timers</h3>
								<p class="text-gray-600 text-sm">Perfect timing for every exercise</p>
							</div>
						</div>
						<div class="flex items-center space-x-3">
							<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
								<span class="text-purple-600 text-xl">🤖</span>
							</div>
							<div>
								<h3 class="font-semibold text-gray-900">AI-Powered Plans</h3>
								<p class="text-gray-600 text-sm">Customized for your goals and time</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-16 bg-white">
		<div class="max-w-7xl mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					How AI Physio Works
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					From assessment to recovery, our AI guides you through every step of your physical therapy journey
				</p>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<div class="text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl">📋</span>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">1. Quick Assessment</h3>
					<p class="text-gray-600">Tell us about your goals, pain areas, and available time</p>
				</div>
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl">🤖</span>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">2. AI Plan Generation</h3>
					<p class="text-gray-600">Get a personalized exercise plan tailored to your needs</p>
				</div>
				<div class="text-center">
					<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl">💪</span>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">3. Guided Workouts</h3>
					<p class="text-gray-600">Follow along with visual guides and built-in timers</p>
				</div>
				<div class="text-center">
					<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl">📈</span>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">4. Track Progress</h3>
					<p class="text-gray-600">Monitor your consistency and celebrate improvements</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Use Cases Section -->
	<section class="py-16 bg-gray-50">
		<div class="max-w-7xl mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					Perfect for Every Recovery Goal
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Whether you're managing chronic pain, recovering from injury, or improving flexibility
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<!-- Flexibility Seekers -->
				<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
					<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
						<span class="text-2xl">🤸‍♀️</span>
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4">Flexibility & Mobility</h3>
					<p class="text-gray-600 mb-6">
						Improve your overall flexibility and range of motion with daily stretching routines 
						tailored to your current level and goals.
					</p>
					<ul class="space-y-2 text-gray-600">
						<li class="flex items-center">
							<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Morning mobility routines
						</li>
						<li class="flex items-center">
							<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Desk worker stretches
						</li>
						<li class="flex items-center">
							<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Athletic performance enhancement
						</li>
					</ul>
				</div>

				<!-- Pain Relief -->
				<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
					<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
						<span class="text-2xl">🩹</span>
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4">Pain Relief & Recovery</h3>
					<p class="text-gray-600 mb-6">
						Target specific pain areas with therapeutic exercises designed to reduce discomfort 
						and promote healing.
					</p>
					<ul class="space-y-2 text-gray-600">
						<li class="flex items-center">
							<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Lower back pain relief
						</li>
						<li class="flex items-center">
							<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Neck and shoulder tension
						</li>
						<li class="flex items-center">
							<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Post-injury rehabilitation
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>



	<!-- Footer -->
	<footer class="bg-gray-900 text-white py-12">
		<div class="max-w-7xl mx-auto px-6">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="mb-6 md:mb-0">
					<div class="flex items-center space-x-2">
						<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-lg">🏃</span>
						</div>
						<h1 class="text-2xl font-bold">AI Physio</h1>
					</div>
					<p class="text-gray-400 mt-2">Your Personal Physical Therapy Coach</p>
				</div>
				<div class="flex space-x-8">
					<a href="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy</a>
					<a href="/terms" class="text-gray-400 hover:text-white transition-colors">Terms</a>
					<button onclick={handleSignInClick} class="text-gray-400 hover:text-white transition-colors">
						{user ? 'Dashboard' : 'Sign In'}
					</button>
				</div>
			</div>
			<div class="border-t border-gray-800 mt-8 pt-8 text-center">
				<p class="text-gray-400 text-sm">© 2024 AI Physio. Built for better health and mobility.</p>
			</div>
		</div>
	</footer>
</div>

