import { create } from 'zustand';

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
  setSong: (newSong: Song) => void;
}

export const useSong = create<SongStore>((set) => ({
  song: {
    title: '',
    id: '',
    thumbnails: [],
    artists: []
  },
  setSong: (newSong) => set({ song: newSong })
}));