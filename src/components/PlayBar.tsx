import React from 'react';
import { FredokaText } from '../elements/FredokaText';
import { useTheme } from '../../ThemeContext';
import { Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlayerControls: React.FC = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.controls, { backgroundColor: theme.secondary }]}>
            <Icon name="skip-previous" size={30} color="white" />
            <Icon name="play" size={30} color="white" />
            <Icon name="skip-next" size={30} color="white" />
        </View>
    );
}

const SongInfo: React.FC = () => {
    return (
        <View style={styles.songinfo}>
            <Image style={styles.image} src="none" />
            <View>
                <FredokaText size={16}>Song Title</FredokaText>
                <FredokaText size={12} color="grey">Artist</FredokaText>
            </View>
        </View>
    );
}

const SongTools: React.FC = () => {
    return (
        <View style={styles.controls}>
            <Icon name="microphone-variant" size={20} color="white" />
            <Icon name="heart" size={20} color="white" />
            <Icon name="download" size={20} color="white" />
            <Icon name="playlist-plus" size={20} color="white" />
        </View>
    );
}

const PlayBar: React.FC = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.playbar, { backgroundColor: theme.secondary }]}>
            <SongInfo />
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
    },
    playbar : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingRight: 20,
        margin: 20,
        marginTop: 0,
        borderRadius: 20,
        gap: 20,
    },
    controls : {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    image : {
        width: 60,
        height: 60,
        borderRadius: 15,
    },
});

export default PlayBar;