import {get} from 'ytmusic_api_unofficial';

async function InnerRadio(musicId: string) {
  try {
    const music = await get(musicId);
    const playlist = await music?.getRadioPlaylist();
    return playlist.musics;
  } catch (error) {
    console.error('Error gettings suggestions:', error);
    throw error;
  }
}

export default InnerRadio;
