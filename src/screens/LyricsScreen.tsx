import React from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
import { page } from '../style/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const LyricsScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const { lyrics, song } = route.params;
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
      <ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
          <FredokaText variant="semiBold" style={page.text}>{song.title}</FredokaText>
          <FredokaText size={16} style={page.text}>{song.artists[0]?.name}</FredokaText>
        </View>
        {lyrics.lyrics ? (
          <View style={[{ backgroundColor: theme.secondary }, styles.lyrics]}>
            <FredokaText style={page.text}>{lyrics.lyrics}</FredokaText>
            <FredokaText variant="medium" style={page.text}>{lyrics.source}</FredokaText>
          </View>
        ) : (
          <View style={[{ backgroundColor: theme.secondary, alignItems: 'center', justifyContent: 'center', height: '100%' }, styles.lyrics]}>
            <FredokaText style={page.text}>{t('noLyrics')}</FredokaText>
            <Icon name="microphone-variant-off" size={50} color={theme.text} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
    lyrics : {
        marginBottom: 20,
        margin: 10,
        padding: 10,
        borderRadius: 10,
        gap: 20,
    },
};

export default LyricsScreen;