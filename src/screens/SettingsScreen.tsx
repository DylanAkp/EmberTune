import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { EmberText } from '../elements/FredokaText';
import { page } from '../style/Styles';

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
      <EmberText style={page.text}>Settings</EmberText>
    </SafeAreaView>
  );
};

export default SettingsScreen;