import React from 'react';
import { ThemeProvider } from './ThemeContext';
import AppContent from './src/AppContent';

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
