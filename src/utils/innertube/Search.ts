import { search } from 'ytmusic_api_unofficial';

async function InnerSearch(query: string, filter?: string, fetch?: boolean) {
  try {
    const results = await search(query, filter, fetch);
    return results;
  } catch (error) {
    console.error('Error searching for music:', error);
    throw error;
  }
}

export default InnerSearch;