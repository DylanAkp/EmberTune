import React from 'react';
import { FredokaText } from '../../elements/FredokaText';
import { useTheme } from '../../../ThemeContext';
import { Image, StyleSheet, View } from 'react-native';

interface ArtistComponentProps {
    artist: {
        name: string;
        id: string;
        thumbnails: {
            url: string;
            width: number;
            height: number;
        }[];
        followers: number;
    };
}

const formatFollowers = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num.toString();
    }
};

const ArtistComponent: React.FC<ArtistComponentProps> = ({ artist }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.artist, { backgroundColor: theme.secondary }]}>
            <Image source={{ uri: artist.thumbnails[artist.thumbnails.length - 1].url }} style={styles.thumbnail} />
            <View>
                <FredokaText size={16} style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {artist.name}
                </FredokaText>
                <FredokaText size={14} color="grey" style={styles.followers} numberOfLines={1} ellipsizeMode="tail">
                    {formatFollowers(artist.followers)} followers
                </FredokaText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    artist: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 90,
        padding: 7,
        paddingRight: 20,
        width: 'auto',
        gap: 10,
    },
    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 100,
    },
    name: {
        marginTop: 10,
        width: '100%',
        textAlign: 'center',
    },
    followers: {
        marginTop: 5,
        width: '100%',
        textAlign: 'center',
    },
});

export default ArtistComponent;