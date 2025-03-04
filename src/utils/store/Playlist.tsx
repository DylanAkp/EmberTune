import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export interface Song {
  title: string;
  id: string;
  thumbnails: Thumbnail[];
  artists: Artist[];
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean;
}

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  reorderPlaylist: (
    playlistId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  initializeDefaultPlaylist: () => void;
}

export const usePlaylist = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [],
      currentPlaylist: null,

      initializeDefaultPlaylist: () => {
        const state = get();
        if (!state.playlists.some(p => p.isDefault)) {
          const defaultPlaylist: Playlist = {
            id: 'liked-songs',
            name: 'Liked Songs',
            songs: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDefault: true,
          };
          set(state => ({
            playlists: [...state.playlists, defaultPlaylist],
          }));
        }
      },

      createPlaylist: (name: string) => {
        const newPlaylist: Playlist = {
          id: Date.now().toString(),
          name,
          songs: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set(state => ({
          playlists: [...state.playlists, newPlaylist],
        }));
      },

      deletePlaylist: (playlistId: string) => {
        const state = get();
        const playlist = state.playlists.find(p => p.id === playlistId);
        if (playlist?.isDefault) {
          console.warn('Cannot delete default playlist');
          return;
        }
        set(state => ({
          playlists: state.playlists.filter(p => p.id !== playlistId),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? null
              : state.currentPlaylist,
        }));
      },

      renamePlaylist: (playlistId: string, newName: string) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {...playlist, name: newName, updatedAt: Date.now()}
              : playlist,
          ),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {...state.currentPlaylist, name: newName}
              : state.currentPlaylist,
        }));
      },

      addSongToPlaylist: (playlistId: string, song: Song) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: [...playlist.songs, song],
                  updatedAt: Date.now(),
                }
              : playlist,
          ),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {
                  ...state.currentPlaylist,
                  songs: [...state.currentPlaylist.songs, song],
                }
              : state.currentPlaylist,
        }));
      },

      removeSongFromPlaylist: (playlistId: string, songId: string) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: playlist.songs.filter(song => song.id !== songId),
                  updatedAt: Date.now(),
                }
              : playlist,
          ),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {
                  ...state.currentPlaylist,
                  songs: state.currentPlaylist.songs.filter(
                    song => song.id !== songId,
                  ),
                }
              : state.currentPlaylist,
        }));
      },

      reorderPlaylist: (
        playlistId: string,
        fromIndex: number,
        toIndex: number,
      ) => {
        set(state => ({
          playlists: state.playlists.map(playlist => {
            if (playlist.id !== playlistId) return playlist;

            const newSongs = [...playlist.songs];
            const [movedSong] = newSongs.splice(fromIndex, 1);
            newSongs.splice(toIndex, 0, movedSong);

            return {
              ...playlist,
              songs: newSongs,
              updatedAt: Date.now(),
            };
          }),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {
                  ...state.currentPlaylist,
                  songs: [...state.currentPlaylist.songs],
                }
              : state.currentPlaylist,
        }));
      },

      setCurrentPlaylist: (playlist: Playlist | null) => {
        set({currentPlaylist: playlist});
      },
    }),
    {
      name: 'playlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
