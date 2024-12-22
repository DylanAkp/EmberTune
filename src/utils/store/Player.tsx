import { create } from 'zustand';
import InnerLyrics from '../innertube/Lyrics';
import InnerRadio from '../innertube/Radio';
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

interface Lyrics {
  lyrics: string;
  source: string;
  song: Song;
}

interface PlayerStore {
  song: Song;
  radio: Song[];
  isPlaying: boolean;
  lyrics: Lyrics;
  setSong: (newSong: Song) => void;
  playSong: () => void;
  pauseSong: () => void;
  checkIfPlaying: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setLyrics: (newLyrics: Lyrics) => void;
  setSongWithoutReset: (song: Song) => void;
}

export const usePlayer = create<PlayerStore>((set, get) => ({
  song: {
    title: '',
    id: '',
    thumbnails: [],
    artists: []
  },
  radio: [],
  lyrics: {
    lyrics: '',
    source: '',
    song: {
      title: '',
      id: '',
      thumbnails: [],
      artists: []
    }
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
    const filtered = (await InnerRadio(newSong.id)).filter((song: any) => song.resultType === 'song');
    await TrackPlayer.play();
    set({ isPlaying: true, lyrics: await InnerLyrics(newSong.id), radio: filtered });
  },
  setSongWithoutReset: async (song) => {
    await TrackPlayer.add({
      id: song.id,
      url: song.thumbnails[0]?.url,
      title: song.title,
      artist: song.artists.map(artist => artist.name).join(' & '),
      artwork: song.thumbnails[0]?.url
    });
    set({ song: song, lyrics: await InnerLyrics(song.id) });
  },
  setLyrics: async (newLyrics: Lyrics) => {
    set({ lyrics: newLyrics });
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
    set({ isPlaying: currentState === TrackPlayer.STATE_PLAYING });
  },
  playNext: async () => {
    const { radio, song } = get();
    const currentIndex = radio.findIndex((s: any) => s.id === song.id) || 0;
    if (currentIndex >= 0 && currentIndex < radio.length - 1) {
      const nextSong = radio[currentIndex + 1];
      await get().setSongWithoutReset(nextSong);
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
      set({ isPlaying: true });
    }
  },
  playPrevious: async () => {
    const { radio, song } = get();
    const currentIndex = radio.findIndex((s: any) => s.id === song.id) || 0;
    if (currentIndex > 0) {
      const previousSong = radio[currentIndex - 1];
      await get().setSongWithoutReset(previousSong);
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
      set({ isPlaying: true });
    }
  }
}));