import React, {useState} from 'react';
import {FredokaText} from '../../elements/FredokaText';
import {useTheme} from '../../../ThemeContext';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {usePlayer} from '../../utils/store/Player';
import {getSizedThumbnail} from '../../utils/ThumbnailManager';

interface SongComponentProps {
  song: {
    title: string;
    id: string;
    thumbnails: {
      url: string;
      width: number;
      height: number;
    }[];
    artists: {
      name: string;
      id: string;
      thumbnails: {
        url: string;
        width: number;
        height: number;
      }[];
    }[];
  };
}

const SongComponent: React.FC<SongComponentProps> = ({song}) => {
  const {theme} = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const {setSong} = usePlayer();

  return (
    <View style={[styles.song, {backgroundColor: theme.secondary}]}>
      <TouchableOpacity
        style={styles.thumbnailContainer}
        onPress={() => setSong(song)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <Image
          source={{uri: getSizedThumbnail(song.thumbnails, 120)}}
          style={styles.thumbnail}
        />
        {isHovered && (
          <>
            <View style={styles.overlay} />
            <View style={styles.playIconContainer}>
              <Icon name="play" size={50} color="white" />
            </View>
          </>
        )}
      </TouchableOpacity>
      <FredokaText
        size={16}
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail">
        {song.title}
      </FredokaText>
      {song.artists[0]?.name && (
        <FredokaText
          size={14}
          color="grey"
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail">
          {song.artists[0].name || 'Unknown artist'}
        </FredokaText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  song: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
    width: 140,
    height: 'auto',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  title: {
    marginTop: 5,
    width: '100%',
    textAlign: 'center',
  },
});

export default SongComponent;
