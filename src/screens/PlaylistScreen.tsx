import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {usePlaylist} from '../utils/store/Playlist';
import PlaylistList from '../components/PlaylistList';

const PlaylistScreen: React.FC = () => {
  const {theme} = useTheme();
  const {initializeDefaultPlaylist} = usePlaylist();

  useEffect(() => {
    initializeDefaultPlaylist();
  }, [initializeDefaultPlaylist]);

  return (
    <View style={[styles.container, {backgroundColor: theme.primary}]}>
      <PlaylistList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlaylistScreen;
