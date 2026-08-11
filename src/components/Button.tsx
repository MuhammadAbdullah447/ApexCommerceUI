import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
  ActivityIndicator,
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
  loading?: boolean;
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
  loading = false,
}: ButtonProps) => {

  const variantStyles = getVariantStyles(variant, colors);
  const indicatorColor = variant === 'outline' ? colors.primary : colors.white;

  return (
    <Pressable
      onPress={loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        (pressed && !loading) && styles.pressed,
        (pressed && !loading && variant === 'outline') && { backgroundColor: colors.surfaceContainerLow },
        loading && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.label, variantStyles.label]}>{label}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
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
        label: { color: colors.background },
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