import React from 'react';
import {View, StyleSheet} from 'react-native';
import SearchBar from './SearchBar';
import {TouchableOpacity} from 'react-native';
import {searchBar} from '../style/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeContext';
import {useNavigation, useNavigationState} from '@react-navigation/native';

const TopBar: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const routesLength = useNavigationState(state => state?.routes?.length);

  return (
    <View style={styles.topBar}>
      {routesLength && routesLength > 1 && (
        <TouchableOpacity
          style={[searchBar.searchIcon, {backgroundColor: theme.secondary, marginRight: 10}]}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={25} color={theme.text} />
        </TouchableOpacity>
      )}
      <SearchBar />
      <TouchableOpacity
        style={[searchBar.searchIcon, {backgroundColor: theme.secondary}]}
        onPress={() => navigation.navigate('Settings')}>
        <Icon name="cog" size={25} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 15,
    paddingLeft: 15,
  },
});

export default TopBar;
