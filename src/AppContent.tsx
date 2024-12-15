import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import { EmberText } from './elements/FredokaText';
import { page } from './style/Styles';

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
        <EmberText variant="regular" style={[page.text, { color: theme.text }]}>
            EmberTune
        </EmberText>
    </SafeAreaView>
  );
};

export default AppContent;