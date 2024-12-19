import { create } from 'zustand';

export interface SearchResults {
    artists: string[];
    albums: string[];
    songs: string[];
}

interface SearchResultsState extends SearchResults {
    setResults: (artists: string[], albums: string[], songs: string[]) => void;
}

export const useSearchResults = create<SearchResultsState>((set) => ({
    // Variables
    artists: [],
    albums: [],
    songs: [],

    // Setters
    setResults: (artists: string[], albums: string[], songs: string[]) => set(() => ({
        artists,
        albums,
        songs
    }))
}));