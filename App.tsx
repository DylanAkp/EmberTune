import React from 'react';
import { theme } from './src/style/Themes';
import "react-native-url-polyfill/auto";
import { SafeAreaView, StatusBar, useColorScheme, View, StyleSheet, Text } from 'react-native';
import { EmberText } from './src/elements/FredokaText';
import SideBar from './src/components/SideBar';
import { page } from './src/style/Styles';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const backgroundStyle = {
    backgroundColor: currentTheme.primary,
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.primary}
      />
      <View style={[page.container, { backgroundColor: currentTheme.primary }]}>
        <SideBar isDarkMode={isDarkMode} theme={theme} />
        <View style={[page.content, { backgroundColor: currentTheme.primary }]}>
          <EmberText variant='regular' style={[page.text, { color: currentTheme.text }]}>
            EmberTune
          </EmberText>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;