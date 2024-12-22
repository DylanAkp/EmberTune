import React from 'react';
import {Text, TextProps, StyleSheet, Platform} from 'react-native';

interface FredokaTextProps extends TextProps {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
  size?: number;
  color?: string;
  children: React.ReactNode;
}

export const FredokaText: React.FC<FredokaTextProps> = ({
  style,
  variant = 'regular',
  size,
  color,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles[variant],
        style,
        size ? {fontSize: size} : {},
        color ? {color: color} : {},
      ]}
      {...props}>
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
