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
<div class="min-h-[100vh] bg-gradient-to-br from-slate-50 to-blue-50">
	<!-- Header -->
	<header class="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center space-x-3">
				<img 
					src="/ai_physio_logo.png" 
					alt="AI Physio Logo" 
					class="w-12 h-12"
				/>
				<h1 class="text-2xl font-bold text-[#1F2937]">AI Physio</h1>
			</div>
			<div class="flex items-center space-x-3">
				<button 
					class="px-6 py-2 text-[#1F2937] hover:text-[#3182CE] font-medium transition-colors duration-200 border border-slate-200 rounded-lg hover:border-[#63B3ED] hover:bg-blue-50/50" 
					onclick={handleSignInClick}
				>
					{user ? 'Dashboard' : 'Sign In'}
				</button>
				<button 
					class="px-6 py-2 bg-[#3182CE] text-white font-medium rounded-lg hover:bg-[#1E40AF] transition-colors duration-200 shadow-sm hover:shadow-md" 
					onclick={handleGetStarted}
				>
					Get Started
				</button>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="max-w-7xl mx-auto px-6 py-20">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div>
				<h1 class="text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight">
					Your Personal 
					<span class="bg-gradient-to-r from-[#3182CE] to-[#63B3ED] bg-clip-text text-transparent">Physical Therapy</span> 
					Coach
				</h1>
				<p class="text-xl text-slate-600 mt-8 leading-relaxed">
					Transform aches and pains into strength and flexibility with AI-powered, personalized stretching and rehab plans. 
					Get custom exercise routines with built-in timers and visual guidance.
				</p>
				<div class="mt-10 space-y-6">
					<div class="flex flex-col sm:flex-row gap-4">
						<button 
							class="px-8 py-4 bg-[#3182CE] text-white font-semibold rounded-xl hover:bg-[#1E40AF] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
							onclick={handleGetStarted}
						>
							Start Your Recovery Journey
						</button>
						
					</div>
					<div class="flex items-center space-x-6 text-sm text-slate-500">
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-[#63B3ED] rounded-full"></div>
							<span>Personalized plans</span>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-[#63B3ED] rounded-full"></div>
							<span>Visual guidance</span>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-[#63B3ED] rounded-full"></div>
							<span>Progress tracking</span>
						</div>
					</div>
				</div>
			</div>
			<div class="relative">
				<div class="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
					<div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#3182CE] to-[#63B3ED]"></div>
					<div class="space-y-6">
						<div class="flex items-center space-x-4">
							<div class="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
								<span class="text-emerald-600 text-2xl">🎯</span>
							</div>
							<div>
								<h3 class="font-bold text-[#1F2937] text-lg">Targeted Relief</h3>
								<p class="text-slate-600">Focus on your specific pain areas</p>
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<div class="w-14 h-14 bg-gradient-to-br from-[#63B3ED]/20 to-[#3182CE]/20 rounded-2xl flex items-center justify-center">
								<span class="text-[#3182CE] text-2xl">⏱️</span>
							</div>
							<div>
								<h3 class="font-bold text-[#1F2937] text-lg">Built-in Timers</h3>
								<p class="text-slate-600">Perfect timing for every exercise</p>
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<div class="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
								<span class="text-purple-600 text-2xl">🤖</span>
							</div>
							<div>
								<h3 class="font-bold text-[#1F2937] text-lg">AI-Powered Plans</h3>
								<p class="text-slate-600">Customized for your goals and time</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-20 bg-white">
		<div class="max-w-7xl mx-auto px-6">
			<div class="text-center mb-20">
				<h2 class="text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6">
					How AI Physio Works
				</h2>
				<p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
					From assessment to recovery, our AI guides you through every step of your physical therapy journey
				</p>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<div class="text-center group">
					<div class="w-20 h-20 bg-gradient-to-br from-[#3182CE]/10 to-[#63B3ED]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
						<span class="text-3xl">📋</span>
					</div>
					<h3 class="text-xl font-bold text-[#1F2937] mb-3">1. Quick Assessment</h3>
					<p class="text-slate-600">Tell us about your goals, pain areas, and available time</p>
				</div>
				<div class="text-center group">
					<div class="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
						<span class="text-3xl">🤖</span>
					</div>
					<h3 class="text-xl font-bold text-[#1F2937] mb-3">2. AI Plan Generation</h3>
					<p class="text-slate-600">Get a personalized exercise plan tailored to your needs</p>
				</div>
				<div class="text-center group">
					<div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
						<span class="text-3xl">💪</span>
					</div>
					<h3 class="text-xl font-bold text-[#1F2937] mb-3">3. Guided Workouts</h3>
					<p class="text-slate-600">Follow along with visual guides and built-in timers</p>
				</div>
				<div class="text-center group">
					<div class="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
						<span class="text-3xl">📈</span>
					</div>
					<h3 class="text-xl font-bold text-[#1F2937] mb-3">4. Track Progress</h3>
					<p class="text-slate-600">Monitor your consistency and celebrate improvements</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Use Cases Section -->
	<section class="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
		<div class="max-w-7xl mx-auto px-6">
			<div class="text-center mb-20">
				<h2 class="text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6">
					Perfect for Every Recovery Goal
				</h2>
				<p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
					Whether you're managing chronic pain, recovering from injury, or improving flexibility
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-10">
				<!-- Flexibility Seekers -->
				<div class="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
					<div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-8">
						<span class="text-3xl">🤸‍♀️</span>
					</div>
					<h3 class="text-3xl font-bold text-[#1F2937] mb-6">Flexibility & Mobility</h3>
					<p class="text-slate-600 mb-8 text-lg leading-relaxed">
						Improve your overall flexibility and range of motion with daily stretching routines 
						tailored to your current level and goals.
					</p>
					<ul class="space-y-4 text-slate-600">
						<li class="flex items-center">
							<div class="w-6 h-6 bg-[#63B3ED] rounded-full flex items-center justify-center mr-4">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="font-medium">Morning mobility routines</span>
						</li>
						<li class="flex items-center">
							<div class="w-6 h-6 bg-[#63B3ED] rounded-full flex items-center justify-center mr-4">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="font-medium">Desk worker stretches</span>
						</li>
						<li class="flex items-center">
							<div class="w-6 h-6 bg-[#63B3ED] rounded-full flex items-center justify-center mr-4">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="font-medium">Athletic performance enhancement</span>
						</li>
					</ul>
				</div>

				<!-- Pain Relief -->
				<div class="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
					<div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-8">
						<span class="text-3xl">🩹</span>
					</div>
					<h3 class="text-3xl font-bold text-[#1F2937] mb-6">Pain Relief & Recovery</h3>
					<p class="text-slate-600 mb-8 text-lg leading-relaxed">
						Target specific pain areas with therapeutic exercises designed to reduce discomfort 
						and promote healing.
					</p>
					<ul class="space-y-4 text-slate-600">
						<li class="flex items-center">
							<div class="w-6 h-6 bg-[#63B3ED] rounded-full flex items-center justify-center mr-4">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="font-medium">Lower back pain relief</span>
						</li>
						<li class="flex items-center">
							<div class="w-6 h-6 bg-[#63B3ED] rounded-full flex items-center justify-center mr-4">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="font-medium">Neck and shoulder tension</span>
						</li>
						<li class="flex items-center">
							<div class="w-6 h-6 bg-[#63B3ED] rounded-full flex items-center justify-center mr-4">
								<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="font-medium">Post-injury rehabilitation</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-[#1F2937] text-white py-16">
		<div class="max-w-7xl mx-auto px-6">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="mb-8 md:mb-0">
					<div class="flex items-center space-x-3 mb-4">
						<img 
							src="/ai_physio_logo.png" 
							alt="AI Physio Logo" 
							class="w-12 h-12"
						/>
						<h1 class="text-2xl font-bold">AI Physio</h1>
					</div>
					<p class="text-slate-400 text-lg">Your Personal Physical Therapy Coach</p>
				</div>
				<div class="flex space-x-8">
					<a href="/privacy" class="text-slate-400 hover:text-white transition-colors duration-200 font-medium">Privacy</a>
					<a href="/terms" class="text-slate-400 hover:text-white transition-colors duration-200 font-medium">Terms</a>
					<button onclick={handleSignInClick} class="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
						{user ? 'Dashboard' : 'Sign In'}
					</button>
				</div>
			</div>
			<div class="border-t border-slate-700 mt-12 pt-8 text-center">
				<p class="text-slate-400 text-sm">© 2024 AI Physio. Built for better health and mobility.</p>
			</div>
		</div>
	</footer>
</div>

