import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import "react-native-url-polyfill/auto";
//Components
import SideBar from './src/components/SideBar';
import TopBar from './src/components/TopBar';
//Screens
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SearchScreen from './src/screens/SearchScreen';



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

  return (
    <NavigationContainer>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <SideBar />
        <View style={{ flex: 1 }}>
          <TopBar />
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </Stack.Navigator>
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