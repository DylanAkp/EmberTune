import React, {useState} from 'react';
import {FredokaText} from '../elements/FredokaText';
import {getSizedThumbnail} from '../utils/ThumbnailManager';
import {useTheme} from '../../ThemeContext';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {usePlayer} from '../utils/store/Player';
import {useNavigation} from '@react-navigation/native';
import {useNavigationState} from '@react-navigation/native';

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

const SongTools: React.FC<SongInfoProps> = ({song, theme}) => {
  const navigation = useNavigation();
  const route = useNavigationState(state => state.routes[state.index]);
  const [copy, setCopy] = useState('link');

  const handleLyrics = async () => {
    route.name === 'Lyrics'
      ? navigation.goBack()
      : navigation.navigate('Lyrics');
  };

  const copyLink = () => {
    Clipboard.setString(`https://music.youtube.com/watch?v=${song.id}`);
    setCopy('check');
    setTimeout(() => {
      setCopy('link');
    }, 2000);
  };

  return (
    <View style={styles.tools}>
      <TouchableOpacity>
        <Icon name="volume-high" size={20} color={theme.text} />
      </TouchableOpacity>
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
      <Icon name="heart" size={20} color={theme.text} />
      <Icon name="playlist-plus" size={20} color={theme.text} />
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
    <View style={[styles.playbar, {backgroundColor: theme.secondary}]}>
      <SongInfo song={song} theme={theme} />
      <PlayerControls theme={theme} />
      <SongTools song={song} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  songinfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  playbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 20,
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    gap: 20,
  },
  tools: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    flex: 1,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
});

export default PlayBar;
