import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
import { page } from '../style/Styles';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
    </SafeAreaView>
  );
};

export default HomeScreen;