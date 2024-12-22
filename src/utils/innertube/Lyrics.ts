import { get } from 'ytmusic_api_unofficial';

async function InnerLyrics(musicId: string) {
  try {
    const music = await get(musicId);
    const lyrics = await music?.getLyrics();
    return lyrics;
  } catch (error) {
    if (error.code === 2003) {
      return { lyrics: "", source: "" };
    } else {
      console.error('Error downloading music:', error);
      throw error;
    }
  }
}

export default InnerLyrics;