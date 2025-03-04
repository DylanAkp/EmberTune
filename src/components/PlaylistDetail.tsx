import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {FredokaText} from '../elements/FredokaText';
import {useTheme} from '../../ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {usePlaylist, Playlist, Song} from '../utils/store/Playlist';
import {usePlayer} from '../utils/store/Player';
import {getSizedThumbnail} from '../utils/ThumbnailManager';
import {useTranslation} from 'react-i18next';

interface PlaylistDetailProps {
  playlist: Playlist;
}

const PlaylistDetail: React.FC<PlaylistDetailProps> = ({playlist}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {removeSongFromPlaylist, reorderPlaylist} = usePlaylist();
  const {setSong, setCurrentPlaylist} = usePlayer();

  const handleRemoveSong = (songId: string) => {
    Alert.alert(t('removeSong'), t('removeSongConfirm'), [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('remove'),
        style: 'destructive',
        onPress: () => removeSongFromPlaylist(playlist.id, songId),
      },
    ]);
  };

  const handlePlaySong = (song: Song) => {
    setCurrentPlaylist(playlist.songs);
    setSong(song);
  };

  const handlePlayPlaylist = () => {
    if (playlist.songs.length > 0) {
      setCurrentPlaylist(playlist.songs);
      setSong(playlist.songs[0]);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.primary}]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FredokaText style={styles.title}>{playlist.name}</FredokaText>
          <FredokaText style={styles.songCount}>
            {playlist.songs.length} {t('songs')}
          </FredokaText>
        </View>
        <TouchableOpacity
          style={[styles.playButton, {backgroundColor: theme.accent}]}
          onPress={handlePlayPlaylist}
          disabled={playlist.songs.length === 0}>
          <Icon name="play" size={24} color="white" />
          <FredokaText style={styles.playButtonText}>{t('play')}</FredokaText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.songList}>
        {playlist.songs.map((song, index) => (
          <TouchableOpacity
            key={song.id}
            style={[styles.songItem, {backgroundColor: theme.secondary}]}
            onPress={() => handlePlaySong(song)}
            onLongPress={() => {
              if (!playlist.isDefault) {
                Alert.alert(t('removeSong'), t('removeSongConfirm'), [
                  {text: t('cancel'), style: 'cancel'},
                  {
                    text: t('remove'),
                    style: 'destructive',
                    onPress: () => handleRemoveSong(song.id),
                  },
                ]);
              }
            }}>
            <Image
              source={{uri: getSizedThumbnail(song.thumbnails, 60)}}
              style={styles.thumbnail}
            />
            <View style={styles.songInfo}>
              <FredokaText style={styles.songTitle}>{song.title}</FredokaText>
              <FredokaText style={styles.artistName}>
                {song.artists[0]?.name || t('unknownArtist')}
              </FredokaText>
            </View>
            <Icon name="play" size={24} color={theme.text} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 16,
    opacity: 0.7,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songList: {
    flex: 1,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  artistName: {
    fontSize: 14,
    opacity: 0.7,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default PlaylistDetail;
