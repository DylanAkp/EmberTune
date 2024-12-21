import React from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
import { page } from '../style/Styles';
import { useRoute } from '@react-navigation/native';

const LyricsScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const { lyrics, song } = route.params;

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
      <ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
          <FredokaText variant="semiBold" style={page.text}>{song.title}</FredokaText>
          <FredokaText size={16} style={page.text}>{song.artists[0]?.name}</FredokaText>
        </View>
        <View style={[{ backgroundColor: theme.secondary }, styles.lyrics]}>
            <FredokaText variant="medium" style={page.text}>{lyrics.source}</FredokaText>
            <FredokaText style={page.text}>{lyrics.lyrics}</FredokaText>
        </View>
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