import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
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
        <FredokaText variant="medium" style={[sidebar.title, { color: theme.text }]}>
          EmberTune
        </FredokaText>
      </View>
    </View>
  );
};

export default SideBar;
