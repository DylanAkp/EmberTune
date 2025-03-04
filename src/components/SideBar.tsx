import React from 'react';
import {Image, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {FredokaText} from '../elements/FredokaText';
import {sidebar} from '../style/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {usePlaylist} from '../utils/store/Playlist';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SideBar: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {t} = useTranslation();

  const menuItems = [
    {icon: 'home', label: t('home'), route: 'Home' as const},
    {
      icon: 'playlist-music',
      label: t('playlists'),
      route: 'Playlists' as const,
    },
  ];

  const handleNavigation = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  return (
    <View style={[sidebar.sidebar, {backgroundColor: theme.secondary}]}>
      <View style={sidebar.header}>
        <Image
          source={require('../assets/embertune_logo.png')}
          style={{width: 60, height: 60}}
        />
        <FredokaText
          variant="medium"
          style={[sidebar.title, {color: theme.text}]}>
          EmberTune
        </FredokaText>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, {backgroundColor: theme.primary}]}
            onPress={() => handleNavigation(item.route)}>
            <Icon name={item.icon} size={24} color={theme.text} />
            <FredokaText style={[styles.menuLabel, {color: theme.text}]}>
              {item.label}
            </FredokaText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    width: '100%',
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
  },
});

export default SideBar;
