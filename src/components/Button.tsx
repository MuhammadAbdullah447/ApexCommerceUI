import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SPACING, ColorScheme } from '../constants/theme';


type ButtonVariant = 'primary' | 'outline' | 'dark';

interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  colors?: ColorScheme;
}


const Button = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  fullWidth = true,
  style,
  colors = COLORS,
}: ButtonProps) => {

  const variantStyles = getVariantStyles(variant, colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon && iconPosition === 'left' && icon}
      <Text style={[styles.label, variantStyles.label]}>{label}</Text>
      {icon && iconPosition === 'right' && icon}
    </Pressable>
  );
};


function getVariantStyles(variant: ButtonVariant, colors: ColorScheme) {
  switch (variant) {
    case 'outline':
      return {
        container: {
          backgroundColor: colors.surfaceContainerLowest,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        },
        label: { color: colors.onSurface },
      };
    case 'dark':
      return {
        container: {
          backgroundColor: colors.onSurface,
          borderWidth: 0,
        },
        label: { color: colors.white },
      };
    case 'primary':
    default:
      return {
        container: {
          backgroundColor: colors.primary,
          borderWidth: 0,
        },
        label: { color: colors.onPrimary },
      };
  }
}


const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: TYPOGRAPHY.buttonText.fontSize,
    fontWeight: TYPOGRAPHY.buttonText.fontWeight,
    lineHeight: TYPOGRAPHY.buttonText.lineHeight,
  },
});

export default Button;