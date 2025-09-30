import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RequestHandler } from './$types';

// For demo purposes, using a fallback API key. In production, you'd use environment variables
const DEMO_API_KEY = 'AIzaSyBvbqgqPJK8FXYrw2ZkJ5_XQGCMEjFNw4s'; // This is a placeholder - replace with real key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || DEMO_API_KEY);

interface WorkoutRequest {
	goals: string[];
	painAreas: string[];
	timeAvailable: number;
	experienceLevel: string;
	focusToday?: string;
}

interface Exercise {
	name: string;
	description: string;
	duration: number;
	instructions: string[];
	targetAreas: string[];
	difficulty: string;
	benefits: string;
	imageUrl?: string;
	videoUrl?: string;
	mediaType?: 'image' | 'video';
}

interface WorkoutPlan {
	title: string;
	totalDuration: number;
	exercises: Exercise[];
	warmup: Exercise[];
	cooldown: Exercise[];
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { safeGetSession } = locals;
	const { session } = await safeGetSession();

	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const workoutRequest: WorkoutRequest = await request.json();
		
		// For hackathon demo, we'll use a hybrid approach:
		// 1. Try Gemini AI if API key is available
		// 2. Fall back to predefined plans based on user preferences

		let workoutPlan: WorkoutPlan;

		try {
			workoutPlan = await generateWithGemini(workoutRequest);
		} catch (error) {
			console.log('Gemini API unavailable, using fallback plan generator');
			workoutPlan = generateFallbackPlan(workoutRequest);
		}

		// Save the generated workout (for future tracking)
		// TODO: Save to database

		return json({ success: true, workout: workoutPlan });
	} catch (error) {
		console.error('Error generating workout:', error);
		return json({ error: 'Failed to generate workout' }, { status: 500 });
	}
};

async function generateWithGemini(request: WorkoutRequest): Promise<WorkoutPlan> {
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

	const prompt = `
You are an expert physical therapist and fitness coach. Create a personalized workout plan based on these user preferences:

Goals: ${request.goals.join(', ')}
Problem Areas: ${request.painAreas.join(', ')}
Available Time: ${request.timeAvailable} minutes
Experience Level: ${request.experienceLevel}
${request.focusToday ? `Special Focus Today: ${request.focusToday}` : ''}

Please respond with ONLY a valid JSON object in this exact format:
{
  "title": "Workout title",
  "totalDuration": ${request.timeAvailable},
  "warmup": [
    {
      "name": "Exercise name",
      "description": "Brief description",
      "duration": 30,
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "targetAreas": ["area1", "area2"],
      "difficulty": "easy|medium|hard",
      "benefits": "What this exercise helps with",
      "imageUrl": "https://images.unsplash.com/photo-example?w=400&h=300&fit=crop&crop=center",
      "videoUrl": "https://example.com/video.mp4",
      "mediaType": "image"
    }
  ],
  "exercises": [
    {
      "name": "Exercise name",
      "description": "Brief description", 
      "duration": 60,
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "targetAreas": ["area1", "area2"],
      "difficulty": "easy|medium|hard",
      "benefits": "What this exercise helps with",
      "imageUrl": "https://images.unsplash.com/photo-example?w=400&h=300&fit=crop&crop=center",
      "videoUrl": "https://example.com/video.mp4",
      "mediaType": "image"
    }
  ],
  "cooldown": [
    {
      "name": "Exercise name",
      "description": "Brief description",
      "duration": 30,
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "targetAreas": ["area1", "area2"],
      "difficulty": "easy|medium|hard",
      "benefits": "What this exercise helps with",
      "imageUrl": "https://images.unsplash.com/photo-example?w=400&h=300&fit=crop&crop=center",
      "videoUrl": "https://example.com/video.mp4",
      "mediaType": "image"
    }
  ]
}

Guidelines:
- Focus on the user's problem areas and goals
- Adjust difficulty based on experience level
- Include 2-3 warmup exercises (30 seconds each)
- Include 3-5 main exercises based on available time
- Include 2-3 cooldown exercises (30 seconds each)
- Ensure total duration matches available time
- Provide clear, step-by-step instructions
- Focus on stretching, mobility, and gentle strengthening
`;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = response.text();
	
	try {
		const workoutPlan = JSON.parse(text);
		return workoutPlan;
	} catch (parseError) {
		console.error('Failed to parse Gemini response:', text);
		throw new Error('Invalid AI response format');
	}
}

function generateFallbackPlan(request: WorkoutRequest): WorkoutPlan {
	// Predefined exercise database
	const exerciseDB = {
		warmup: [
			{
				name: "Neck Rolls",
				description: "Gentle neck mobility to release tension",
				duration: 30,
				instructions: [
					"Stand or sit comfortably",
					"Slowly roll your head in a circle",
					"5 rolls clockwise, then 5 counter-clockwise",
					"Keep movements slow and controlled"
				],
				targetAreas: ["neck"],
				difficulty: "easy",
				benefits: "Relieves neck tension and improves mobility",
				imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=face",
				videoUrl: "https://www.youtube.com/watch?v=2M80Mn0VBPw", // Neck Rolls - Replace with real physiotherapy video
				mediaType: "video"
			},
			{
				name: "Shoulder Shrugs",
				description: "Activate and warm up shoulder muscles",
				duration: 30,
				instructions: [
					"Stand with arms at your sides",
					"Lift shoulders up towards ears",
					"Hold for 2 seconds, then release",
					"Repeat 10 times"
				],
				targetAreas: ["shoulders"],
				difficulty: "easy",
				benefits: "Reduces shoulder tension and improves circulation",
				imageUrl: "https://images.unsplash.com/photo-1506629905607-f53b44b46f78?w=600&h=400&fit=crop&crop=center",
				videoUrl: "shoulder shrugs- https://youtu.be/ja_P3YhmAlE?si=YrwSHZVKbM_K5m51",
				mediaType: "video"
			},
			{
				name: "Arm Circles",
				description: "Dynamic warm-up for shoulders and arms",
				duration: 30,
				instructions: [
					"Extend arms out to sides",
					"Make small circles forward for 15 seconds",
					"Reverse direction for 15 seconds",
					"Keep movements controlled"
				],
				targetAreas: ["shoulders", "arms"],
				difficulty: "easy",
				benefits: "Warms up shoulder joints and improves range of motion",
				imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://www.youtube.com/watch?v=140RTNMciH8",
				mediaType: "video"
			}
		],
		main: [
			{
				name: "Cat-Cow Stretch",
				description: "Spinal mobility exercise for back flexibility",
				duration: 60,
				instructions: [
					"Start on hands and knees",
					"Arch your back, looking up (Cow)",
					"Round your spine, tucking chin (Cat)",
					"Alternate slowly for 1 minute"
				],
				targetAreas: ["lower_back", "upper_back"],
				difficulty: "easy",
				benefits: "Improves spinal flexibility and reduces back pain",
				imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://youtu.be/AlnydRPKvY0?si=I3RG7QnyQrv6Q5vV", // Neck Rolls - Replace with real physiotherapy video
				mediaType: "video"
			},
			{
				name: "Child's Pose",
				description: "Relaxing stretch for back and hips",
				duration: 45,
				instructions: [
					"Kneel on the floor",
					"Sit back on your heels",
					"Reach arms forward, lowering chest",
					"Hold and breathe deeply"
				],
				targetAreas: ["lower_back", "hips"],
				difficulty: "easy",
				benefits: "Gently stretches the back and promotes relaxation",
				imageUrl: "https://images.unsplash.com/photo-1506629905607-f53b44b46f78?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://www.youtube.com/watch?v=_ZX_zTOBgp8",
				mediaType: "video"
			},
			{
				name: "Hip Flexor Stretch",
				description: "Opens tight hip flexors from sitting",
				duration: 60,
				instructions: [
					"Kneel in lunge position",
					"Keep back leg extended",
					"Push hips forward gently",
					"Hold 30 seconds each side"
				],
				targetAreas: ["hips"],
				difficulty: "medium",
				benefits: "Counteracts effects of prolonged sitting",
				imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Neck Rolls - Replace with real physiotherapy video
				mediaType: "video"
			},
			{
				name: "Seated Spinal Twist",
				description: "Gentle rotation for spine mobility",
				duration: 60,
				instructions: [
					"Sit cross-legged or in chair",
					"Place right hand behind you",
					"Twist gently to the right",
					"Hold 30 seconds, repeat left"
				],
				targetAreas: ["upper_back", "lower_back"],
				difficulty: "easy",
				benefits: "Improves spinal rotation and relieves back tension",
				imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&crop=center",
				mediaType: "image"
			},
			{
				name: "Forward Fold",
				description: "Stretches entire back body",
				duration: 45,
				instructions: [
					"Stand with feet hip-width apart",
					"Hinge at hips, reaching toward floor",
					"Let arms hang heavy",
					"Bend knees if needed"
				],
				targetAreas: ["lower_back", "hamstrings"],
				difficulty: "medium",
				benefits: "Lengthens spine and relieves tension",
				imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Neck Rolls - Replace with real physiotherapy video
				mediaType: "video"
			}
		],
		cooldown: [
			{
				name: "Deep Breathing",
				description: "Calming breath work to end session",
				duration: 30,
				instructions: [
					"Lie down or sit comfortably",
					"Breathe in for 4 counts",
					"Hold for 4 counts",
					"Exhale for 6 counts"
				],
				targetAreas: ["full_body"],
				difficulty: "easy",
				benefits: "Activates relaxation response and reduces stress",
				imageUrl: "https://images.unsplash.com/photo-1506629905607-f53b44b46f78?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://www.youtube.com/watch?v=kpSkoXRrZnE", // Neck Rolls - Replace with real physiotherapy video
				mediaType: "video"
			},
			{
				name: "Gentle Twist",
				description: "Final spinal mobility",
				duration: 30,
				instructions: [
					"Lie on back, knees bent",
					"Drop knees to one side",
					"Keep shoulders on ground",
					"Hold 15 seconds each side"
				],
				targetAreas: ["lower_back"],
				difficulty: "easy",
				benefits: "Final release for the spine",
				imageUrl: "https://www.theragear.com/images/exercises/yg_gntlspnltwst_1.jpg?w=600&h=400&fit=crop&crop=center",
				videoUrl: "https://www.youtube.com/watch?v=qEVNj4tcr0Y",
				mediaType: "video"
			}
		]
	};

	// Select exercises based on user preferences
	const selectedWarmup = exerciseDB.warmup.slice(0, 2);
	
	// Filter main exercises based on pain areas
	let selectedMain = exerciseDB.main.filter(exercise => 
		exercise.targetAreas.some(area => request.painAreas.includes(area)) ||
		request.goals.some(goal => goal === 'flexibility' || goal === 'pain_relief')
	);

	// If no specific matches, use general exercises
	if (selectedMain.length === 0) {
		selectedMain = exerciseDB.main.slice(0, 3);
	}

	// Adjust number of exercises based on available time
	const timeForMain = request.timeAvailable - 60 - 60; // Reserve 1 min warmup, 1 min cooldown
	const maxExercises = Math.floor(timeForMain / 45);
	selectedMain = selectedMain.slice(0, Math.min(maxExercises, selectedMain.length));

	const selectedCooldown = exerciseDB.cooldown;

	return {
		title: `Personalized ${request.timeAvailable}-Minute Recovery Session`,
		totalDuration: request.timeAvailable,
		warmup: selectedWarmup,
		exercises: selectedMain,
		cooldown: selectedCooldown
	};
}
