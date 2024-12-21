import { create } from 'zustand';
import TrackPlayer from 'react-native-track-player';
import InnerDownload from '../innertube/Download';

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

interface SongStore {
  song: Song;
  isPlaying: boolean;
  setSong: (newSong: Song) => void;
  playSong: () => void;
  pauseSong: () => void;
}

export const useSong = create<SongStore>((set) => ({
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
      url: await InnerDownload(newSong.id),
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
  }
}));