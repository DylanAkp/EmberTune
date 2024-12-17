import { create } from 'zustand'

export const useSearchResults = create((set) => ({
    // Variables
    artists: [],
    albums: [],
    songs: [],

    // Setters
    setResults: (
        artists: any[],
        albums: any[],
        songs: any[]
    ) => set(() => ({
        artists,
        albums,
        songs
    }
    ))
}))