
export async function useFetchAllGlossary(projectId: string) {
  const response = await fetch(`/api/glossary/fetch-all/${projectId}`, {
    method : 'GET'
  });
  const { data } = await response.json();
  return data;
}