import React from 'react';
import { Text, TextProps, StyleSheet, Platform } from 'react-native';

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
      fontFamily: Platform.select({
        windows: 'Assets/Fredoka-Regular.ttf#Fredoka',
        default: 'Fredoka-Regular',
      }),
      fontSize: 20,
    },
    medium: {
      fontFamily: Platform.select({
        windows: 'Assets/Fredoka-Medium.ttf#Fredoka',
        default: 'Fredoka-Medium',
      }),
      fontSize: 20,
    },
    semiBold: {
      fontFamily: Platform.select({
        windows: 'Assets/Fredoka-SemiBold.ttf#Fredoka',
        default: 'Fredoka-SemiBold',
      }),
      fontSize: 20,
    },
    bold: {
      fontFamily: Platform.select({
        windows: 'Assets/Fredoka-Bold.ttf#Fredoka',
        default: 'Fredoka-Bold',
      }),
      fontSize: 20,
    },
  });