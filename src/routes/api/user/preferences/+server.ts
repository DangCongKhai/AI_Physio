import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { safeGetSession, supabase } = locals;
	const { session } = await safeGetSession();

	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const preferences = await request.json();
		
		// Save user preferences to Supabase
		const { data, error } = await supabase
			.from('user_preferences')
			.upsert({
				user_id: session.user.id,
				goals: preferences.goals,
				pain_areas: preferences.painAreas,
				time_available: preferences.timeAvailable,
				experience_level: preferences.experienceLevel,
				completed_onboarding: true,
				updated_at: new Date().toISOString()
			})
			.select();

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to save preferences' }, { status: 500 });
		}

		return json({ success: true, data });
	} catch (error) {
		console.error('Error saving preferences:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ locals }) => {
	const { safeGetSession, supabase } = locals;
	const { session } = await safeGetSession();

	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { data, error } = await supabase
			.from('user_preferences')
			.select('*')
			.eq('user_id', session.user.id)
			.order('updated_at', { ascending: false })
			.limit(1)
			.single();
		console.log('Error:', error);
		if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch preferences' }, { status: 500 });
		}


		return json({ preferences: data });
	} catch (error) {
		console.error('Error fetching preferences:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
