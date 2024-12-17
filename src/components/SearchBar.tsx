import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../ThemeContext';
import { searchBar } from '../style/Styles';
import InnerSearch from '../utils/innertube/Search';

const SearchBar: React.FC = () => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchMusic = async () => {
    if (!query) return;

    setIsLoading(true);
    
    try {
      await InnerSearch(query);
    } catch {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={searchBar.searchContainer}>
      <View style={[searchBar.searchBar, { backgroundColor: theme.secondary }]}>
        <TextInput
          style={[searchBar.searchInput, { backgroundColor: theme.third }]}
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMusic}
          editable={!isLoading}
        />
        <TouchableOpacity style={[searchBar.searchIcon, { backgroundColor: theme.third }]} onPress={searchMusic} disabled={isLoading}>
          {isLoading ? (
            <Icon name="hourglass" size={20} color={theme.text} />
          ) : (
            <Icon name="search" size={20} color={theme.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
