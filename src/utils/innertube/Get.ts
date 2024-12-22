import {get} from 'ytmusic_api_unofficial';

async function InnerGet(musicId: string) {
  try {
    const results = await get(musicId);
    return results;
  } catch (error) {
    console.error('Error getting music:', error);
    throw error;
  }
}

export default InnerGet;
