import React from 'react';
import { FredokaText } from '../../elements/FredokaText';
import { useTheme } from '../../../ThemeContext';
import { Image, StyleSheet, View } from 'react-native';

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

const SongComponent: React.FC<SongComponentProps> = ({ song }) => {
  console.log('Song:', JSON.stringify(song, null, 2));
    const { theme } = useTheme();
    return (
        <View style={[styles.song, {backgroundColor: theme.secondary}]}>
            <Image source={{ uri: song.thumbnails[song.thumbnails.length-1].url }} style={styles.thumbnail} />
            <FredokaText style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {song.title}
            </FredokaText>
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
    width: 160,
    height: 200,
  },
  thumbnail: {
    width: 140,
    height: 140,
    borderRadius: 5,
  },
  title: {
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
  },
});

export default SongComponent;