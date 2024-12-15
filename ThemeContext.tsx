import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme } from './src/style/Themes';

const ThemeContext = createContext({ theme: theme.light });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const currentTheme = useMemo(() => (isDarkMode ? theme.dark : theme.light), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
