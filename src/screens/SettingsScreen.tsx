import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {FredokaText} from '../elements/FredokaText';
import {page} from '../style/Styles';
import {useTranslation} from 'react-i18next';
import i18n from '../translations';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  {code: 'en', label: 'English'},
  {code: 'fr', label: 'Français'},
];

const searchLanguage = [
  {code: 'en', label: 'English'},
  {code: 'fr', label: 'Français'},
  {code: 'es', label: 'Español'},
  {code: 'de', label: 'Deutsch'},
  {code: 'it', label: 'Italiano'},
  {code: 'pt', label: 'Português'},
  {code: 'ru', label: 'Русский'},
  {code: 'ja', label: '日本語'},
  {code: 'ko', label: '한국어'},
  {code: 'zh', label: '中文'},
];

const SettingsScreen: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [selectedSearchLanguage, setSelectedSearchLanguage] = useState('en');

  useEffect(() => {
    const fetchSearchLanguage = async () => {
      const storedSearchLanguage = await AsyncStorage.getItem('searchLanguage');
      if (storedSearchLanguage) {
        setSelectedSearchLanguage(storedSearchLanguage);
      }
    };
    fetchSearchLanguage();
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    AsyncStorage.setItem('language', languageCode);
  };

  const handleSearchLanguageChange = (languageCode: string) => {
    setSelectedSearchLanguage(languageCode);
    AsyncStorage.setItem('searchLanguage', languageCode);
  };

  return (
    <SafeAreaView style={[{backgroundColor: theme.primary}, page.content]}>
      <FredokaText variant="semiBold" style={page.text}>
        {t('settings')}
      </FredokaText>
      <View>
        <View
          style={[styles.pickerContainer, {backgroundColor: theme.secondary}]}>
          <FredokaText size={16} style={page.text}>
            {t('language')}
          </FredokaText>
          <Picker
            selectedValue={selectedLanguage}
            style={{height: 50, width: 200, color: theme.text}}
            onValueChange={itemValue => handleLanguageChange(itemValue)}>
            {languages.map(language => (
              <Picker.Item
                key={language.code}
                label={language.label}
                value={language.code}
              />
            ))}
          </Picker>
        </View>
        <View
          style={[styles.pickerContainer, {backgroundColor: theme.secondary}]}>
          <FredokaText size={16} style={page.text}>
            {t('contentLanguage')}
          </FredokaText>
          <Picker
            selectedValue={selectedSearchLanguage}
            style={{height: 50, width: 200, color: theme.text}}
            onValueChange={itemValue => handleSearchLanguageChange(itemValue)}>
            {searchLanguage.map(language => (
              <Picker.Item
                key={language.code}
                label={language.label}
                value={language.code}
              />
            ))}
          </Picker>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: 'auto',
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsScreen;
