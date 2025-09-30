# AI Physio

AI Physio is a SvelteKit application that generates personalized physiotherapy workouts using AI and guides users through timed sessions with rich media (images and YouTube videos). It features OAuth login with Supabase, a modern sporty UI, and a simple end‑to‑end flow from plan generation to session feedback.

## Features

- Personalized workout generation with Google Generative AI (Gemini) fallback plans
- Guided workout session with timers, next/prev controls, and phase progression
- Image and YouTube video embeds per exercise (auto‑embed for youtube.com/youtu.be)
- Post‑workout feedback with SVG star ratings and dashboard navigation
- Modern UI using the color palette `#3182CE`, `#63B3ED`, `#1F2937`
- Supabase OAuth (Google/Azure) with SSR session handling

## Tech Stack

- SvelteKit 2 + Svelte 5 (runes)
- TypeScript
- Tailwind CSS 4
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Google Generative AI (`@google/generative-ai`)
- Vite

## Project Structure (key paths)

- `src/routes/+page.svelte` – Landing page
- `src/routes/sign-in/+page.svelte` – Sign‑in UI (OAuth buttons)
- `src/routes/dashboard/+page.svelte` – User dashboard
- `src/routes/workout/generate/+page.svelte` – Plan generator UI
- `src/routes/workout/session/+page.svelte` – Guided session with timers and media
- `src/routes/workout/feedback/+page.svelte` – Session feedback and rating
- `src/routes/api/workout/generate/+server.ts` – Plan generation API (AI prompt + fallback data)
- `src/lib/components/Button.svelte`, `StarRating.svelte` – Shared UI components
- `src/lib/data/exerciseMedia.ts` – Exercise media metadata (images/videos)

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (with OAuth providers enabled)
- Optional: Google Generative AI API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` at the project root:

```bash
# Supabase (required)
PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"

# Optional: Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="<gemini-api-key>"

# Optional: Payments (disabled by default)
PAYOS_CLIENT_ID="<payos-client-id>"
PAYOS_API_KEY="<payos-api-key>"
PAYOS_CHECKSUM_KEY="<payos-checksum-key>"
```

Note: Supabase is wired in `src/hooks.server.ts` using `@supabase/ssr` and requires only the public URL and anon key for client auth.

### Development

```bash
# Run dev server
npm run dev

# Type-check and lint
npm run check
npm run lint

# Build and preview
npm run build
npm run preview
```

## Core Flows

### 1) Generate a Workout

- Route: `src/routes/workout/generate/+page.svelte`
- Server: `src/routes/api/workout/generate/+server.ts`
  - Accepts user preferences and returns a plan with phases: warmup, main, cooldown
  - Includes `imageUrl`, `videoUrl`, and `mediaType: 'image' | 'video'`
  - Fallback plan ships with curated Unsplash images and YouTube links

### 2) Run the Session

- Route: `src/routes/workout/session/+page.svelte`
- Features:
  - Accurate timer per exercise; timers are cleared on navigation to avoid overlap
  - Media rendering: if `videoUrl` is YouTube, it auto‑embeds via `<iframe>`; otherwise uses `<video>`
  - Progress bar and phase labels (Warm‑up, Main, Cool‑down)

### 3) Leave Feedback

- Route: `src/routes/workout/feedback/+page.svelte`
- Uses `StarRating.svelte` with SVG stars and supports navigation back to the dashboard

## Customizing Media

- Update mock media in `src/routes/api/workout/generate/+server.ts`
- YouTube links are converted to embed automatically (supported patterns: `youtube.com/watch?v=…`, `youtu.be/…`)
- Additional examples live in `src/lib/data/physiotherapyVideos.ts`

## Branding & UI

- Colors: `#3182CE` (primary), `#63B3ED` (accent), `#1F2937` (text/dark)
- Buttons: variants and sizes via `src/lib/components/Button.svelte`
- Logo: `static/ai_physio_logo.png` referenced in headers/footers

## Deployment

- Default adapter is `@sveltejs/adapter-auto`
- Configure the same environment variables in your hosting platform (PUBLIC_* keys are safe for the client)

## Troubleshooting

- Auth not working: verify `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, and OAuth provider redirect URLs in Supabase
- Videos not playing: ensure `videoUrl` is a valid YouTube link or a reachable media file
- Type errors: run `npm run check` and ensure `tsconfig.json` is used

---

Built with ❤️ for better health and mobility.
