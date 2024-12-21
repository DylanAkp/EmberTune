import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
import { page } from '../style/Styles';
import { useSearchResults } from '../utils/store/SearchResults';
import SongComponent from '../components/Objects/SongComponent';
import ArtistComponent from '../components/Objects/ArtistComponent';

const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { artists, albums, songs } = useSearchResults();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
      <ScrollView>
        <View style={results.results}>
          <View style={results.songs}>
            {artists && artists.map((artist, index) => (
              <ArtistComponent key={index} artist={artist} />
            ))}
          </View>

          <View style={results.songs}>
            {songs && songs.map((song, index) => (
              <SongComponent key={index} song={song} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const results = StyleSheet.create({
  songs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 10,
  },
  results: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 15,
      marginTop: 10,
      marginRight: 'auto',
      marginLeft: 'auto',
  },
});


export default SearchScreen;