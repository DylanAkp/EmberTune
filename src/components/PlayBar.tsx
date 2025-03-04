import React, {useEffect, useState} from 'react';
import {FredokaText} from '../elements/FredokaText';
import {getSizedThumbnail} from '../utils/ThumbnailManager';
import {useTheme} from '../../ThemeContext';
import {Image, StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {usePlayer} from '../utils/store/Player';
import {useNavigation} from '@react-navigation/native';
import {useNavigationState} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import {usePlaylist} from '../utils/store/Playlist';

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const PlayerControls: React.FC<any> = ({theme}) => {
  const {isPlaying, playNext, playPrevious, playSong, pauseSong} = usePlayer();

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const handlePrevious = () => {
    playPrevious();
  };

  const handleNext = () => {
    playNext();
  };

  return (
    <View style={[styles.controls, {backgroundColor: theme.secondary}]}>
      <TouchableOpacity onPress={handlePrevious}>
        <Icon name="skip-previous" size={30} color={theme.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlayPause}>
        <Icon
          name={isPlaying ? 'pause' : 'play'}
          size={30}
          color={theme.text}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext}>
        <Icon name="skip-next" size={30} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

interface SongInfoProps {
  song: any;
  theme: any;
}

const SongInfo: React.FC<SongInfoProps> = ({song, theme}) => {
  return (
    <View style={styles.songinfo}>
      <Image
        style={styles.image}
        source={{
          uri:
            getSizedThumbnail(song.thumbnails, 60) ||
            'https://via.placeholder.com/60',
        }}
      />
      <View>
        <FredokaText size={16}>
          {truncateText(song.title || 'No song selected', 20)}
        </FredokaText>
        <FredokaText size={12} color="grey">
          {truncateText(song.artists[0]?.name || 'Unknown artist', 30)}
        </FredokaText>
      </View>
    </View>
  );
};

const AddToPlaylist: React.FC<{song: any; theme: any}> = ({song, theme}) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const {playlists, addSongToPlaylist} = usePlaylist();

  const customPlaylists = playlists.filter(p => !p.isDefault);

  if (customPlaylists.length === 0) {
    return (
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'No Playlists',
            'Create a playlist first to add songs to it.',
          )
        }>
        <Icon name="playlist-plus" size={20} color={theme.text} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.playlistContainer}>
      <TouchableOpacity onPress={() => setShowPlaylists(!showPlaylists)}>
        <Icon name="playlist-plus" size={20} color={theme.text} />
      </TouchableOpacity>
      {showPlaylists && (
        <View
          style={[styles.playlistDropdown, {backgroundColor: theme.primary}]}>
          {customPlaylists.map(playlist => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.playlistItem}
              onPress={() => {
                addSongToPlaylist(playlist.id, song);
                setShowPlaylists(false);
              }}>
              <FredokaText size={14}>{playlist.name}</FredokaText>
              <Icon name="plus" size={20} color={theme.accent} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const SongTools: React.FC<SongInfoProps> = ({song, theme}) => {
  const navigation = useNavigation();
  const route = useNavigationState(state => state.routes[state.index]);
  const [copy, setCopy] = useState('link');
  const [volume, setVolume] = useState(100);
  const {changeVolume, getVolume} = usePlayer();
  const {playlists, removeSongFromPlaylist, addSongToPlaylist} = usePlaylist();

  useEffect(() => {
    const initialVolume = getVolume();
  }, [getVolume]);

  const handleLyrics = async () => {
    if (route.name === 'Lyrics') {
      navigation.goBack();
    } else {
      navigation.navigate('Lyrics');
    }
  };

  const copyLink = () => {
    Clipboard.setString(`https://music.youtube.com/watch?v=${song.id}`);
    setCopy('check');
    setTimeout(() => {
      setCopy('link');
    }, 2000);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    changeVolume(value);
  };

  const isSongLiked = () => {
    const likedPlaylist = playlists.find(p => p.isDefault);
    return likedPlaylist?.songs.some(s => s.id === song.id);
  };

  const handleAddToLiked = async () => {
    const defaultPlaylist = playlists.find(p => p.isDefault);
    if (!defaultPlaylist) return;

    const isLiked = defaultPlaylist.songs.some(s => s.id === song.id);
    if (isLiked) {
      removeSongFromPlaylist(defaultPlaylist.id, song.id);
    } else {
      addSongToPlaylist(defaultPlaylist.id, song);
    }
  };

  return (
    <View style={styles.tools}>
      <Icon name="volume-high" size={20} color={theme.text} />
      <Slider
        style={{width: '30%', height: 30}}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={theme.accent}
        thumbTintColor={theme.accent}
        step={1}
        value={volume}
        onValueChange={handleVolumeChange}
      />
      <TouchableOpacity onPress={handleLyrics}>
        <Icon
          name="microphone-variant"
          size={20}
          color={route.name === 'Lyrics' ? theme.accent : theme.text}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={copyLink}>
        <Icon
          name={copy}
          size={20}
          color={copy === 'link' ? theme.text : theme.accent}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAddToLiked}>
        <Icon
          name={isSongLiked() ? 'heart' : 'heart-outline'}
          size={20}
          color={isSongLiked() ? theme.accent : theme.text}
        />
      </TouchableOpacity>
      <AddToPlaylist song={song} theme={theme} />
    </View>
  );
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ProgressBar: React.FC<{theme: any}> = ({theme}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const {getProgress, getDuration, seekTo} = usePlayer();

  useEffect(() => {
    const updateProgress = async () => {
      if (!isSeeking) {
        try {
          const currentProgress = await getProgress();
          const currentDuration = await getDuration();
          setProgress(currentProgress);
          setDuration(currentDuration || 0);
        } catch (error) {
          console.warn('Error updating progress:', error);
        }
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [getProgress, getDuration, isSeeking]);

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleValueChange = (value: number) => {
    setSeekValue(value);
    setProgress(value);
  };

  const handleSeek = async (value: number) => {
    try {
      await seekTo(value);
      setProgress(value);
    } finally {
      setIsSeeking(false);
    }
  };

  return (
    <View style={styles.progressContainer}>
      <FredokaText size={12} color="grey">
        {formatTime(progress)}
      </FredokaText>
      <Slider
        style={styles.progressBar}
        minimumValue={0}
        maximumValue={duration || 100}
        value={isSeeking ? seekValue : progress}
        minimumTrackTintColor={theme.accent}
        maximumTrackTintColor={theme.text}
        thumbTintColor={theme.accent}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSeek}
      />
      <FredokaText size={12} color="grey">
        {formatTime(duration)}
      </FredokaText>
    </View>
  );
};

const PlayBar: React.FC = () => {
  const {theme} = useTheme();
  const {song} = usePlayer();

  if (!song || song.id === '') {
    return null;
  }

  return (
    <>
      <View style={[styles.playbar, {backgroundColor: theme.secondary}]}>
        <View style={styles.mainContent}>
          <SongInfo song={song} theme={theme} />
          <PlayerControls theme={theme} />
          <SongTools song={song} theme={theme} />
        </View>
        <ProgressBar theme={theme} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  songinfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  playbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    paddingRight: 20,
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    gap: 5,
    overflow: 'visible',
  },
  tools: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '10%',
    justifyContent: 'flex-end',
    flex: 1,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: '5%',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10%',
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 40,
  },
  playlistContainer: {
    position: 'relative',
  },
  playlistDropdown: {
    position: 'absolute',
    bottom: 30,
    right: -10,
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 4,
  },
});

export default PlayBar;
