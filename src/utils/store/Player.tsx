import { create } from 'zustand';
import TrackPlayer from 'react-native-track-player';

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Artist {
  name: string;
  id: string;
  thumbnails: Thumbnail[];
}

interface Song {
  title: string;
  id: string;
  thumbnails: Thumbnail[];
  artists: Artist[];
}

interface PlayerStore {
  song: Song;
  isPlaying: boolean;
  setSong: (newSong: Song) => void;
  playSong: () => void;
  pauseSong: () => void;
  checkIfPlaying: () => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  song: {
    title: '',
    id: '',
    thumbnails: [],
    artists: []
  },
  isPlaying: false,
  setSong: async (newSong) => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: newSong.id,
      url: newSong.thumbnails[0]?.url,
      title: newSong.title,
      artist: newSong.artists.map(artist => artist.name).join(' & '),
      artwork: newSong.thumbnails[0]?.url
    });
    set({ song: newSong });
    await TrackPlayer.play();
    set({ isPlaying: true });
  },
  playSong: async () => {
    await TrackPlayer.play();
    set({ isPlaying: true });
  },
  pauseSong: async () => {
    await TrackPlayer.pause();
    set({ isPlaying: false });
  },
  checkIfPlaying: async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === TrackPlayer.STATE_PLAYING) {
      set({ isPlaying: true });
    } else {
      set({ isPlaying: false });
    }
  }
}));