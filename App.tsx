import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import AppContent from './src/AppContent';
import SideBar from './src/components/SideBar';

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
      <AppContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default App;