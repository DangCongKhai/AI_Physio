import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { SupabaseClient, User } from "@supabase/supabase-js";


const USER_PROFILE_TABLE = 'user_profiles';
const PROJECTS_TABLE = 'projects';




export const load: PageServerLoad = async ({ locals, url }) => {
    console.log('Confirm page hit with URL:', url.toString());
    
    // Check for OAuth callback parameters
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    if (error) {
        console.error('OAuth error:', error);
        throw redirect(303, '/sign-in?error=' + encodeURIComponent(error));
    }
    
    if (code) {
        console.log('Processing OAuth callback with code');
        // Exchange the code for a session
        const { data, error: exchangeError } = await locals.supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            throw redirect(303, '/sign-in');
        }
        console.log('Session exchanged successfully:', data.session?.user?.email);
    }
    
    // Get the current session
    const { data: { session } } = await locals.supabase.auth.getSession();
    
    let user = null;
    if (session) {
        // If we have a session, try to get user with JWT validation
        const { data: { user: validatedUser }, error: userError } = await locals.supabase.auth.getUser();
        if (!userError && validatedUser) {
            user = validatedUser;
        } else {
            // If JWT validation fails but we have a session, use session user
            console.log('JWT validation failed, using session user:', userError);
            user = session.user;
        }
    }
    
    if (!user) {
        console.log('No user found after OAuth callback');
        console.log('Session exists:', !!session);
        console.log('URL params:', Object.fromEntries(url.searchParams.entries()));
        throw redirect(303, '/sign-in');
    }
    
 
    throw redirect(303, `${url.origin}/dashboard`);
   
    
}


