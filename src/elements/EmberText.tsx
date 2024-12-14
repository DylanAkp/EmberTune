import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface EmberTextProps extends TextProps {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
  children: React.ReactNode;
}

export const EmberText: React.FC<EmberTextProps> = ({ 
  style, 
  variant = 'regular', 
  children,
  ...props 
}) => {
  return (
    <Text 
      style={[styles[variant], style]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
    regular: {
      fontFamily: 'Fredoka',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Fredoka',
      fontWeight: '500',
    },
    semiBold: {
      fontFamily: 'Fredoka',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'Fredoka',
      fontWeight: '700',
    },
  });