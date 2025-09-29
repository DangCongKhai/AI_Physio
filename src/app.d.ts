// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface Project {
		id: string;
		name: string;
		url_key: string;
		source_lang: string;
		target_lang: string;
	}

	interface UserPreferences {
		goals: string[];
		pain_areas: string[];
		time_available: string;
		experience_level: string;
	}
}

export {};
