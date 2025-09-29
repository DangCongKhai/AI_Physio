// src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';
import type { SupabaseClient, User } from '@supabase/supabase-js';

const USER_PROFILE_TABLE = 'user_profiles';
// const ORGANIZATIONS_TABLE = 'organizations';

async function ensureUserProfile(supabase: SupabaseClient, user: User) {
	if (!user) return null;

	// Try to fetch existing profile
	const { data: existingProfile } = await supabase
		.from(USER_PROFILE_TABLE)
		.select('*')
		.eq('user_id', user.id)
		.single();

	if (existingProfile) {
		return existingProfile;
	}
	return null;

	// // Create new profile with data from OAuth provider
	// const name =
	// 	user.user_metadata?.full_name ||
	// 	user.user_metadata?.name ||
	// 	user.email?.split('@')[0] ||
	// 	'User';

	// const avatar_url = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

	// const { data: newProfile, error } = await supabase
	// 	.from(USER_PROFILE_TABLE)
	// 	.insert({
	// 		user_id: user.id,
	// 		name: name,
	// 		avatar_url: avatar_url,
	// 		email: user.email,
	// 		credits_balance: NEW_USER_CREDITS_BALANCE
	// 	})
	// 	.select()
	// 	.single();

	// await createNewOrganization(supabase, newProfile); // We can add this new organization to organization_user table later

	// if (error) {
	// 	console.error('Error creating user profile:', error);
	// 	return null;
	// }

	// return newProfile;
}

// async function getUserOrganization(supabase: SupabaseClient, userProfile: UserProfile | null) {
// 	if (!userProfile?.organization_id) return null;

// 	const { data: organization } = await supabase
// 		.from(ORGANIZATIONS_TABLE)
// 		.select('*')
// 		.eq('id', userProfile.organization_id)
// 		.single();

// 	return organization;
// }

// async function createNewOrganization(supabase: SupabaseClient, userProfile: UserProfile) {
// 	const { data: newOrganization, error } = await supabase
// 		.from(ORGANIZATIONS_TABLE)
// 		.insert({
// 			name: userProfile.name,
// 			member_user_ids: [userProfile.user_id],
// 			admin_user_ids: [userProfile.user_id]
// 		})
// 		.select()
// 		.single();

// 	if (error) {
// 		console.error('Error creating organization:', error);
// 		return null;
// 	}

// 	return newOrganization;
// }

// function isUserOrgAdmin(
// 	userProfile: UserProfile | null,
// 	organization: Organization | null
// ): boolean {
// 	if (!userProfile || !organization) return false;

// 	// Check if user has admin role in their profile
// 	if (userProfile.organization_role === 'admin') return true;

// 	// Also check if user ID is in the admin_member_ids array (fallback)
// 	return organization.admin_member_ids?.includes(userProfile.id) || false;
// }

export const load: LayoutServerLoad = async ({
	locals: { safeGetSession, supabase },
	cookies,
	url,
	request
}) => {
	const { session, user } = await safeGetSession();

	// Handle user profile creation/fetching
	let userProfile = null;
	// let organization = null;
	// let isOrgAdmin = false;

	if (user) {
		userProfile = await ensureUserProfile(supabase, user);

		// 	// if (userProfile) {
		// 	// 	organization = await getUserOrganization(supabase, userProfile);
		// 	// 	isOrgAdmin = isUserOrgAdmin(userProfile, organization);
		// 	// }
	}



	return {
		session,
		user,
		userProfile,
		// organization,
		// isOrgAdmin,
		cookies: cookies.getAll()
	};
};
