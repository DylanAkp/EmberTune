import React from 'react';
import { FredokaText } from '../elements/FredokaText';
import { useTheme } from '../../ThemeContext';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSong } from '../utils/storage/Player';

const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

const PlayerControls: React.FC = () => {
    const { theme } = useTheme();
    const { song, isPlaying, playSong, pauseSong } = useSong();

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    };

    return (
        <View style={[styles.controls, { backgroundColor: theme.secondary }]}>
            <Icon name="skip-previous" size={30} color="white" />
            <TouchableOpacity onPress={handlePlayPause}>
                <Icon name={isPlaying ? "pause" : "play"} size={30} color="white" />
            </TouchableOpacity>
            <Icon name="skip-next" size={30} color="white" />
        </View>
    );
};

interface SongInfoProps {
    song: any;
}

const SongInfo: React.FC<SongInfoProps> = ({ song }) => {
    return (
        <View style={styles.songinfo}>
            <Image style={styles.image} source={{ uri: song.thumbnails[0]?.url || 'https://via.placeholder.com/60' }} />
            <View>
                <FredokaText size={16}>{truncateText(song.title || 'No song selected', 20)}</FredokaText>
                <FredokaText size={12} color="grey">{truncateText(song.artists[0]?.name || 'Unknown artist', 30)}</FredokaText>
            </View>
        </View>
    );
}

const SongTools: React.FC = () => {
    return (
        <View style={styles.tools}>
            <Icon name="microphone-variant" size={20} color="white" />
            <Icon name="heart" size={20} color="white" />
            <Icon name="download" size={20} color="white" />
            <Icon name="playlist-plus" size={20} color="white" />
        </View>
    );
}

const PlayBar: React.FC = () => {
    const { theme } = useTheme();
    const { song } = useSong();

    if (!song || song.id === '') {
        return null;
    }

    return (
        <View style={[styles.playbar, { backgroundColor: theme.secondary }]}>
            <SongInfo song={song} />
            <PlayerControls />
            <SongTools />
        </View>
    );
}

const styles = StyleSheet.create({
    songinfo : {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    playbar : {
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
    tools : {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
        flex: 1,
    },
    controls : {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        flex: 1,
    },
    image : {
        width: 60,
        height: 60,
        borderRadius: 15,
    },
});

export default PlayBar;