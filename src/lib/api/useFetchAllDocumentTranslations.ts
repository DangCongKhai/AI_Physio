
export async function useFetchAllDocumentTranslations(projectId: string, documentId: string) {
    const response = await fetch(
        `api/translations/${projectId}/${documentId}/all`, {
            method : 'GET'
        }
    )

    const { data } = await response.json();
    return data;
}