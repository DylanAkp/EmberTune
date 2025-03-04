import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {usePlaylist} from '../utils/store/Playlist';
import PlaylistDetail from '../components/PlaylistDetail';
import {useRoute} from '@react-navigation/native';

const PlaylistDetailScreen: React.FC = () => {
  const {theme} = useTheme();
  const route = useRoute();
  const {playlists} = usePlaylist();
  const playlistId = (route.params as any)?.playlistId;
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return null;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.primary}]}>
      <PlaylistDetail playlist={playlist} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlaylistDetailScreen;
