import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { FredokaText } from '../elements/FredokaText';
import { page } from '../style/Styles';
import { useTranslation } from "react-i18next";
import i18n from '../translations';
import { Picker } from '@react-native-picker/picker';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, page.content]}>
      <FredokaText style={page.text}>{t('settings')}</FredokaText>
      <View style={styles.pickerContainer}>
        <FredokaText size={16} style={page.text}>{t('language')}</FredokaText>
        <Picker
          selectedValue={selectedLanguage}
          style={{ height: 50, width: 200, color: theme.text }}
          onValueChange={(itemValue) => handleLanguageChange(itemValue)}
        >
          {languages.map((language) => (
            <Picker.Item key={language.code} label={language.label} value={language.code} />
          ))}
        </Picker>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default SettingsScreen;