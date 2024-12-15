import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import AppContent from './src/AppContent';
import SideBar from './src/components/SideBar';
import TopBar from './src/components/TopBar';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <SideBar />
      <View style={{ flex: 1 }}>
        <TopBar />
        <AppContent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  appcontent: {
    flex: 1,
    flexDirection: 'column',
  }
});

export default App;