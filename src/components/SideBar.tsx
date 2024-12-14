import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../style/Themes';
import { EmberText } from '../elements/FredokaText';
import { sidebar } from '../style/Styles';

const SideBar: React.FC<{ isDarkMode: boolean; theme: any }> = ({ isDarkMode }) => {
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <View style={[sidebar.sidebar, { backgroundColor: currentTheme.secondary }]}>
      <EmberText variant="medium" style={[sidebar.title, { color: currentTheme.text }]}>
        EmberTune
      </EmberText>
    </View>
  );
};

export default SideBar;