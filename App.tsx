import React from 'react';
import TrackPlayer from 'react-native-track-player';
import i18n from './src/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { isDesktop } from './src/utils/platform/Platform';
import "react-native-url-polyfill/auto";
//Components
import SideBar from './src/components/SideBar';
import TopBar from './src/components/TopBar';
import PlayBar from './src/components/PlayBar';
//Screens
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SearchScreen from './src/screens/SearchScreen';
import LyricsScreen from './src/screens/LyricsScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();
  AsyncStorage.getItem('language').then((language) => {
    if (language) {
      i18n.changeLanguage(language);
    }
  });
  

  return (
    <NavigationContainer>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        {isDesktop() && <SideBar />}
        <View style={{ flex: 1 }}>
          <TopBar />
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Lyrics" component={LyricsScreen} />
          </Stack.Navigator>
          <PlayBar />
        </View>
      </View>
    </NavigationContainer>
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