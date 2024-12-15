import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import { TouchableOpacity } from 'react-native';
import { searchBar } from '../style/Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../ThemeContext';

const TopBar: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={styles.topBar}>
      <SearchBar />
      <TouchableOpacity style={[searchBar.searchIcon, { backgroundColor: theme.third }]}>
          <Icon name="cog" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default TopBar;