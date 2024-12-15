import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { EmberText } from '../elements/FredokaText';
import { sidebar } from '../style/Styles';

const SideBar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[sidebar.sidebar, { backgroundColor: theme.secondary }]}>
      <View style={sidebar.header}>
        <Image
          source={require('../assets/embertune_logo.png')}
          style={{ width: 60, height: 60 }}
        />
        <EmberText variant="medium" style={[sidebar.title, { color: theme.text }]}>
          EmberTune
        </EmberText>
      </View>
    </View>
  );
};

export default SideBar;
