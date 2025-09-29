// src/lib/utils/anonymousUser.ts
import { browser } from '$app/environment';

interface AnonymousSession {
	id: string;
	createdAt: string;
	lastActiveAt: string;
	translations: number;
	uploadsToday: number;
	dailyResetDate: string;
}

const ANONYMOUS_SESSION_KEY = 'omniglot_anonymous_session';
const MAX_DAILY_TRANSLATIONS = 1;
const MAX_DAILY_UPLOADS = 5;

export function generateAnonymousId(): string {
	return 'anon_' + crypto.randomUUID();
}

export function getAnonymousSession(): AnonymousSession | null {
	if (!browser) return null;

	try {
		const stored = localStorage.getItem(ANONYMOUS_SESSION_KEY);
		if (!stored) return null;

		const session = JSON.parse(stored) as AnonymousSession;

		// Check if we need to reset daily counters
		const today = new Date().toISOString().split('T')[0];
		if (session.dailyResetDate !== today) {
			session.uploadsToday = 0;
			session.translations = 0;
			session.dailyResetDate = today;
			saveAnonymousSession(session);
		}

		return session;
	} catch {
		return null;
	}
}

export function createAnonymousSession(): AnonymousSession {
	const session: AnonymousSession = {
		id: generateAnonymousId(),
		createdAt: new Date().toISOString(),
		lastActiveAt: new Date().toISOString(),
		translations: 0,
		uploadsToday: 0,
		dailyResetDate: new Date().toISOString().split('T')[0]
	};

	saveAnonymousSession(session);
	return session;
}

export function saveAnonymousSession(session: AnonymousSession): void {
	if (!browser) return;

	session.lastActiveAt = new Date().toISOString();
	localStorage.setItem(ANONYMOUS_SESSION_KEY, JSON.stringify(session));
}

export function trackAnonymousAction(action: 'translation' | 'upload'): boolean {
	const session = getAnonymousSession() || createAnonymousSession();

	switch (action) {
		case 'translation':
			if (session.translations >= MAX_DAILY_TRANSLATIONS) {
				return false; // Limit reached
			}
			session.translations++;
			break;
		case 'upload':
			if (session.uploadsToday >= MAX_DAILY_UPLOADS) {
				return false; // Limit reached
			}
			session.uploadsToday++;
			break;
	}

	saveAnonymousSession(session);
	return true;
}

export function resetAnonymousSession(action: 'translation' | 'upload') {
	const session = getAnonymousSession() || createAnonymousSession();

	switch (action) {
		case 'translation':
			if (session.translations <= 0) {
				return;
			}
			session.translations--;
			break;
		case 'upload':
			if (session.uploadsToday <= 0) {
				return;
			}
			session.uploadsToday--;
			break;
	}
	saveAnonymousSession(session);

}

export function getAnonymousLimits() {
	const session = getAnonymousSession() || createAnonymousSession();
	return {
		translations: {
			used: session.translations,
			limit: MAX_DAILY_TRANSLATIONS,
			remaining: MAX_DAILY_TRANSLATIONS - session.translations
		},
		uploads: {
			used: session.uploadsToday,
			limit: MAX_DAILY_UPLOADS,
			remaining: MAX_DAILY_UPLOADS - session.uploadsToday
		}
	};
}
