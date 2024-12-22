import React from 'react';
import { getSizedThumbnail } from '../../utils/ThumbnailManager';
import { FredokaText } from '../../elements/FredokaText';
import { useTheme } from '../../../ThemeContext';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const { theme } = useTheme();
    return (
        <View style={[styles.artist, { backgroundColor: theme.secondary }]}>
            <Image source={{ uri: getSizedThumbnail(artist.thumbnails, 70) }} style={styles.thumbnail} />
            <View>
                <FredokaText size={16} style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {artist.name}
                </FredokaText>
                <FredokaText size={14} color="grey" style={styles.followers} numberOfLines={1} ellipsizeMode="tail">
                    {formatFollowers(artist.followers)} {t('followers')}
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
        width: '100%',
        textAlign: 'center',
    },
    followers: {
        width: '100%',
        textAlign: 'center',
    },
});

export default ArtistComponent;