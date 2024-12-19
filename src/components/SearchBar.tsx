import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../ThemeContext';
import { searchBar } from '../style/Styles';
import InnerSearch from '../utils/innertube/Search';
import { useNavigation } from '@react-navigation/native';

const SearchBar: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }
  }, [isLoading, rotateAnim]);

  const searchMusic = async () => {
    if (!query) return;

    setIsLoading(true);

    try {
      await InnerSearch(query).then(() => {
        navigation.navigate('Search');
      });
    } catch {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Icon name="loading" size={25} color={theme.text} />
            </Animated.View>
          ) : (
            <Icon name="magnify" size={25} color={theme.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;