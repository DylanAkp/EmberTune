import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
import { page } from '../style/Styles';

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
      <FredokaText style={page.text}>Settings</FredokaText>
    </SafeAreaView>
  );
};

export default SettingsScreen;