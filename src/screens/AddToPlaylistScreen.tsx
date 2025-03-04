import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {FredokaText} from '../elements/FredokaText';
import {usePlaylist} from '../utils/store/Playlist';
import {useTranslation} from 'react-i18next';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddToPlaylistScreen: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const {playlists, addSongToPlaylist, removeSongFromPlaylist} = usePlaylist();
  const song = (route.params as any)?.song;

  const customPlaylists = playlists.filter(p => !p.isDefault);

  const isSongInPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist?.songs.some(s => s.id === song.id) ?? false;
  };

  const handleToggleInPlaylist = async (playlistId: string) => {
    if (isSongInPlaylist(playlistId)) {
      removeSongFromPlaylist(playlistId, song.id);
    } else {
      addSongToPlaylist(playlistId, song);
    }
  };

  if (!song) {
    return null;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.primary}]}>
      <View style={styles.header}>
        <FredokaText style={styles.title}>{t('addToPlaylist')}</FredokaText>
      </View>

      <View style={styles.songPreview}>
        <FredokaText style={styles.songTitle} numberOfLines={1}>
          {song.title}
        </FredokaText>
        <FredokaText style={styles.artistName} numberOfLines={1}>
          {song.artists[0]?.name || t('unknownArtist')}
        </FredokaText>
      </View>

      {customPlaylists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="playlist-plus" size={48} color={theme.text} />
          <FredokaText style={styles.emptyText}>{t('noPlaylists')}</FredokaText>
          <FredokaText style={styles.emptySubtext}>
            {t('createPlaylistFirst')}
          </FredokaText>
        </View>
      ) : (
        <ScrollView style={styles.playlistList}>
          {customPlaylists.map(playlist => {
            const isInPlaylist = isSongInPlaylist(playlist.id);
            return (
              <TouchableOpacity
                key={playlist.id}
                style={[
                  styles.playlistItem,
                  {
                    backgroundColor: theme.secondary,
                    borderColor: isInPlaylist ? theme.accent : 'transparent',
                  },
                ]}
                onPress={() => handleToggleInPlaylist(playlist.id)}>
                <View style={styles.playlistInfo}>
                  <FredokaText style={styles.playlistName}>
                    {playlist.name}
                  </FredokaText>
                  <FredokaText style={styles.songCount}>
                    {playlist.songs.length} {t('songs')}
                  </FredokaText>
                </View>
                <Icon
                  name={isInPlaylist ? 'check' : 'plus'}
                  size={24}
                  color={isInPlaylist ? theme.accent : theme.text}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  songPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    opacity: 0.7,
  },
  playlistList: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default AddToPlaylistScreen;
