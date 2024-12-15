import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import SideBar from './components/SideBar';
import { EmberText } from './elements/FredokaText';
import { page } from './style/Styles';

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary, flex: 1 }]}>
      <View style={[page.container, { backgroundColor: theme.primary }]}>
        <SideBar />
        <View style={[page.content, { backgroundColor: theme.primary }]}>
          <EmberText variant="regular" style={[page.text, { color: theme.text }]}>
            EmberTune
          </EmberText>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppContent;
