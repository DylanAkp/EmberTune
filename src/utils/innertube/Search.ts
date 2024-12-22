import {search} from 'ytmusic_api_unofficial';
import {useSearchResults} from '../store/SearchResults';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SearchResultsState = {
  setResults: (artists: any, albums: any, songs: any) => void;
};

async function InnerSearch(query: string) {
  try {
    const searchLanguage =
      (await AsyncStorage.getItem('searchLanguage')) || 'en';
    // We do 3 searches to get artists, albums and songs
    // This avoid being limited in the number of results
    const artists = await search(query, 'ARTIST', {
      language: searchLanguage,
      fetch: false,
    });
    const albums = await search(query, 'ALBUM', {
      language: searchLanguage,
      fetch: false,
    });
    const songs = await search(query, 'SONG', {
      language: searchLanguage,
      fetch: false,
    });

    const filteredSongs = songs.content.filter(
      (song: any) => song.resultType === 'song',
    );
    const filteredAlbums = albums.content.filter(
      (album: any) => album.resultType === 'album',
    );
    const filteredArtists = artists.content.filter(
      (artist: any) => artist.name && artist.thumbnails && artist.followers,
    );

    const state = useSearchResults.getState() as SearchResultsState;
    state.setResults(filteredArtists, filteredAlbums, filteredSongs);

    return true;
  } catch (error) {
    console.error('Error searching for music:', error);
    throw error;
  }
}

export default InnerSearch;
