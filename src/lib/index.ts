import { PUBLIC_SUPABASE_DOC_BUCKET_URL } from '$env/static/public';

// place files you want to import through the `$lib` alias in this folder.

export { useFetchAllDocumentTranslations } from './api/useFetchAllDocumentTranslations';
export { useFetchAllGlossary } from './api/useFetchAllGlossary';
export { default as ErrorModal } from './components/ErrorModal.svelte';
export { default as Modal } from './components/Modal.svelte';

export function getDocUrl(path: string) {
	if (path.includes('http')) return path;
	return `${PUBLIC_SUPABASE_DOC_BUCKET_URL}/${path}`;
}
