import {download} from 'ytmusic_api_unofficial';

async function InnerDownload(musicId: string) {
  try {
    const result = await download(musicId, 'webm');
    return result.urlDecoded;
  } catch (error) {
    console.error('Error downloading music:', error);
    throw error;
  }
}

export default InnerDownload;
