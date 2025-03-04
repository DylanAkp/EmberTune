import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {FredokaText} from '../elements/FredokaText';
import {useTheme} from '../../ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {usePlaylist, Playlist} from '../utils/store/Playlist';
import {usePlayer} from '../utils/store/Player';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PlaylistItemProps {
  playlist: Playlist;
  onPress: (playlist: Playlist, playOnly: boolean) => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  playlist,
  onPress,
  onRename,
  onDelete,
}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(playlist.name);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName.trim());
      setIsEditing(false);
    }
  };

  return (
    <View style={[styles.playlistItem, {backgroundColor: theme.secondary}]}>
      <TouchableOpacity
        style={styles.playlistContent}
        onPress={() => onPress(playlist, false)}
        onLongPress={() => !playlist.isDefault && setIsEditing(true)}>
        {isEditing ? (
          <TextInput
            style={[styles.input, {color: theme.text}]}
            value={newName}
            onChangeText={setNewName}
            onBlur={handleRename}
            onSubmitEditing={handleRename}
            autoFocus
          />
        ) : (
          <View style={styles.playlistInfo}>
            <View style={styles.playlistNameContainer}>
              {playlist.isDefault && (
                <Icon
                  name="heart"
                  size={20}
                  color={theme.accent}
                  style={styles.heartIcon}
                />
              )}
              <FredokaText style={styles.playlistName}>
                {playlist.name}
              </FredokaText>
            </View>
            <FredokaText style={styles.songCount}>
              {playlist.songs?.length || 0} {t('songs')}
            </FredokaText>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.playlistActions}>
        <TouchableOpacity
          style={[styles.playButton, {backgroundColor: theme.accent}]}
          onPress={() => onPress(playlist, true)}
          disabled={!playlist.songs?.length}>
          <Icon name="play" size={24} color="white" />
        </TouchableOpacity>
        {!playlist.isDefault && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(t('deletePlaylist'), t('deletePlaylistConfirm'), [
                {text: t('cancel'), style: 'cancel'},
                {text: t('delete'), style: 'destructive', onPress: onDelete},
              ]);
            }}>
            <Icon name="delete" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const PlaylistList: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const {playlists, createPlaylist, renamePlaylist, deletePlaylist} =
    usePlaylist();
  const {setSong, setCurrentPlaylist} = usePlayer();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (!playlist || !playlist.songs) return;
    if (playlist.songs.length > 0) {
      setCurrentPlaylist(playlist.songs);
      setSong(playlist.songs[0]);
    }
  };

  const handleNavigateToPlaylist = (playlist: Playlist) => {
    navigation.navigate('PlaylistDetail', {playlistId: playlist.id});
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.primary}]}>
      <View style={styles.header}>
        <FredokaText style={styles.title}>{t('playlists')}</FredokaText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsCreating(true)}>
          <Icon name="plus" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {isCreating && (
        <View style={[styles.createInput, {backgroundColor: theme.secondary}]}>
          <TextInput
            style={[styles.input, {color: theme.text}]}
            placeholder={t('newPlaylist')}
            placeholderTextColor={theme.text + '80'}
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
            onSubmitEditing={handleCreatePlaylist}
            onBlur={() => {
              setIsCreating(false);
              setNewPlaylistName('');
            }}
            autoFocus
          />
        </View>
      )}

      <ScrollView style={styles.playlistList}>
        {playlists.map(playlist => (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            onPress={(p, playOnly) =>
              playOnly ? handlePlayPlaylist(p) : handleNavigateToPlaylist(p)
            }
            onRename={newName => renamePlaylist(playlist.id, newName)}
            onDelete={() => deletePlaylist(playlist.id)}
          />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  createInput: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Fredoka',
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
  },
  playlistContent: {
    flex: 1,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  playlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  heartIcon: {
    marginRight: 8,
  },
});

export default PlaylistList;
