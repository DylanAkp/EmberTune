import { search } from 'ytmusic_api_unofficial';
import { useSearchResults } from '../storage/SearchResults';

type SearchResultsState = {
  setResults: (artists: any, albums: any, songs: any) => void;
};

async function InnerSearch(query: string) {
  try {
    // We do 3 searches to get artists, albums and songs
    // This avoid being limited in the number of results
    const artists = await search(query, 'ARTIST', false);
    const albums = await search(query, 'ALBUM', false);
    const songs = await search(query, 'SONG', false);

    const filteredSongs = songs.content.filter((song: any) => song.resultType === 'song');
    const filteredAlbums = albums.content.filter((album: any) => album.resultType === 'album');
    const filteredArtists = artists.content.filter((artist: any) => artist.name && artist.thumbnails && artist.followers);

    const state = useSearchResults.getState() as SearchResultsState;
    state.setResults(filteredArtists, filteredAlbums, filteredSongs);

    return true;
  } catch (error) {
    console.error('Error searching for music:', error);
    throw error;
  }
}

export default InnerSearch;