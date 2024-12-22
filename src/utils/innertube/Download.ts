import {download} from 'ytmusic_api_unofficial';

async function InnerDownload(
  musicId: string,
  format?: string,
  quality?: string,
) {
  try {
    const results = await download(musicId, format, quality);
    return results;
  } catch (error) {
    console.error('Error downloading music:', error);
    throw error;
  }
}

export default InnerDownload;
