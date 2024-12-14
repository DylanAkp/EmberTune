import React, { useEffect, useState } from 'react';
import { theme } from './src/style/Themes';
import "react-native-url-polyfill/auto";
import { SafeAreaView, StatusBar, useColorScheme, View, StyleSheet, Text } from 'react-native';
import { get } from 'ytmusic_api_unofficial';
import { EmberText } from './src/elements/EmberText';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get('dQw4w9WgXcQ');
        setData(JSON.stringify(result, null, 2));
      } catch (error) {
        setData('Error fetching data: ' + error);
      }
    };

    fetchData();
  }, []);

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
      <View style={[styles.container, { backgroundColor: currentTheme.secondary }]}>
        <EmberText variant='regular' style={[styles.text, { color: currentTheme.text }]}>
          {data}
        </EmberText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    padding: 10,
  },
});

export default App;