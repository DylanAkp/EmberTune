import {create} from 'zustand';
import InnerLyrics from '../innertube/Lyrics';
import InnerRadio from '../innertube/Radio';
import InnerDownload from '../innertube/Download';
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
  progress: number;
  duration: number;
  currentPlaylist: Song[] | null;
  setSong: (newSong: Song) => void;
  playSong: () => void;
  pauseSong: () => void;
  checkIfPlaying: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setLyrics: (newLyrics: Lyrics) => void;
  setSongWithoutReset: (song: Song) => void;
  getVolume: () => Promise<number>;
  changeVolume: (volume: number) => void;
  getProgress: () => Promise<number>;
  getDuration: () => Promise<number>;
  seekTo: (position: number) => void;
  setCurrentPlaylist: (playlist: Song[] | null) => void;
}

export const usePlayer = create<PlayerStore>((set, get) => ({
  song: {
    title: '',
    id: '',
    thumbnails: [],
    artists: [],
  },
  radio: [],
  currentPlaylist: null,
  lyrics: {
    lyrics: '',
    source: '',
    song: {
      title: '',
      id: '',
      thumbnails: [],
      artists: [],
    },
  },
  isPlaying: false,
  progress: 0,
  duration: 0,
  setSong: async newSong => {
    // Download current song first
    const songUrl = await InnerDownload(newSong.id);
    await TrackPlayer.reset();

    // Get radio tracks then
    const filtered = (await InnerRadio(newSong.id)).filter(
      (song: any) => song.resultType === 'song',
    );

    // Add current song to queue and start playing immediately
    await TrackPlayer.add({
      id: newSong.id,
      url: songUrl,
      title: newSong.title,
      artist: newSong.artists.map(artist => artist.name).join(' & '),
      artwork: newSong.thumbnails[0]?.url,
    });

    // If we have a current playlist, add the remaining songs to the queue
    const {currentPlaylist} = get();
    if (currentPlaylist) {
      const currentIndex = currentPlaylist.findIndex(s => s.id === newSong.id);
      if (currentIndex >= 0) {
        const remainingSongs = currentPlaylist.slice(currentIndex + 1);
        for (const song of remainingSongs) {
          try {
            const songUrl = await InnerDownload(song.id);
            await TrackPlayer.add({
              id: song.id,
              url: songUrl,
              title: song.title,
              artist: song.artists.map(artist => artist.name).join(' & '),
              artwork: song.thumbnails[0]?.url,
            });
          } catch (error) {
            console.warn(
              `Failed to download playlist song ${song.title}:`,
              error,
            );
          }
        }
      }
    } else {
      // If no playlist, add radio recommendations
      filtered.forEach(async (song: any) => {
        try {
          const radioSongUrl = await InnerDownload(song.id);
          await TrackPlayer.add({
            id: song.id,
            url: radioSongUrl,
            title: song.title,
            artist: song.artists.map((artist: any) => artist.name).join(' & '),
            artwork: song.thumbnails[0]?.url,
          });
        } catch (error) {
          console.warn(`Failed to download radio song ${song.title}:`, error);
        }
      });
    }

    await TrackPlayer.play();

    set({
      song: newSong,
      isPlaying: true,
      lyrics: await InnerLyrics(newSong.id),
      radio: filtered,
    });
  },
  setSongWithoutReset: async song => {
    const songUrl = await InnerDownload(song.id);
    await TrackPlayer.add({
      id: song.id,
      url: songUrl,
      title: song.title,
      artist: song.artists.map(artist => artist.name).join(' & '),
      artwork: song.thumbnails[0]?.url,
    });
    set({song: song, lyrics: await InnerLyrics(song.id)});
  },
  setCurrentPlaylist: (playlist: Song[] | null) => {
    set({currentPlaylist: playlist});
  },
  setLyrics: async (newLyrics: Lyrics) => {
    set({lyrics: newLyrics});
  },
  playSong: async () => {
    await TrackPlayer.play();
    set({isPlaying: true});
  },
  pauseSong: async () => {
    await TrackPlayer.pause();
    set({isPlaying: false});
  },
  checkIfPlaying: async () => {
    try {
      const state = await TrackPlayer.getState();
      set({isPlaying: state === TrackPlayer.State.Playing});
    } catch (error) {
      console.warn('Error checking play state:', error);
      set({isPlaying: false});
    }
  },
  playNext: async () => {
    const {currentPlaylist, song, radio} = get();

    // If no song is currently playing, return early
    if (!song || !song.id) return;

    let nextSong = null;
    let currentIndex = -1;

    // Try to find the next song in current playlist
    if (currentPlaylist && currentPlaylist.length > 0) {
      currentIndex = currentPlaylist.findIndex(s => s.id === song.id);
      if (currentIndex >= 0 && currentIndex < currentPlaylist.length - 1) {
        nextSong = currentPlaylist[currentIndex + 1];
      }
    }

    // If no next song in current playlist, try radio
    if (!nextSong && radio && radio.length > 0) {
      currentIndex = radio.findIndex((s: any) => s.id === song.id);
      if (currentIndex >= 0 && currentIndex < radio.length - 1) {
        nextSong = radio[currentIndex + 1];
      }
    }

    // If we found a next song, play it
    if (nextSong) {
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
      set({
        song: nextSong,
        isPlaying: true,
        lyrics: await InnerLyrics(nextSong.id),
      });
    }
  },
  playPrevious: async () => {
    const {currentPlaylist, song} = get();
    if (currentPlaylist) {
      const currentIndex = currentPlaylist.findIndex(s => s.id === song.id);
      if (currentIndex > 0) {
        const previousSong = currentPlaylist[currentIndex - 1];
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
        set({
          song: previousSong,
          isPlaying: true,
          lyrics: await InnerLyrics(previousSong.id),
        });
      }
    } else {
      const {radio} = get();
      const currentIndex = radio.findIndex((s: any) => s.id === song.id);
      if (currentIndex > 0) {
        const previousSong = radio[currentIndex - 1];
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
        set({
          song: previousSong,
          isPlaying: true,
          lyrics: await InnerLyrics(previousSong.id),
        });
      }
    }
  },
  getVolume: async () => {
    const volume = await TrackPlayer.getVolume();
    return volume;
  },
  changeVolume: async volume => {
    await TrackPlayer.setVolume(volume / 100);
  },
  getProgress: async () => {
    const position = await TrackPlayer.getPosition();
    set({progress: position});
    return position;
  },
  getDuration: async () => {
    const duration = await TrackPlayer.getDuration();
    set({duration});
    return duration;
  },
  seekTo: async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
      await new Promise(resolve => setTimeout(resolve, 50));
      const newPosition = await TrackPlayer.getPosition();
      set({progress: newPosition});
    } catch (error) {
      console.warn('Error while seeking:', error);
    }
  },
}));
