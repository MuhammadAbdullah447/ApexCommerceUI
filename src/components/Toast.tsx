import React, { useEffect, useState } from 'react';
import { Animated, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, RADIUS, ColorScheme } from '../constants/theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
  colors?: ColorScheme;
}

const Toast = ({
  visible,
  message,
  type = 'success',
  onDismiss,
  colors = COLORS,
}: ToastProps) => {
  const [slideAnim] = useState(() => new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Slide down to 76px from the top (12px below the 64px header)
      Animated.spring(slideAnim, {
        toValue: 76,
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }).start();

      // Auto dismiss after 2.5 seconds
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      slideAnim.setValue(-100);
    }
  }, [visible, slideAnim, onDismiss]);

  if (!visible) return null;

  const getToastColors = () => {
    switch (type) {
      case 'error':
        return {
          bg: colors.surfaceContainerLowest,
          border: 'rgba(186, 26, 26, 0.15)',
          text: colors.onSurface,
          icon: 'error',
          iconColor: colors.error,
        };
      case 'info':
        return {
          bg: colors.surfaceContainerLowest,
          border: colors.outlineVariant,
          text: colors.onSurface,
          icon: 'info',
          iconColor: colors.primary,
        };
      case 'success':
      default:
        return {
          bg: colors.surfaceContainerLowest,
          border: colors.primary === '#adc6ff' ? 'rgba(173, 198, 255, 0.2)' : 'rgba(37, 99, 235, 0.15)',
          text: colors.onSurface,
          icon: 'check-circle',
          iconColor: colors.primary,
        };
    }
  };

  const toastStyle = getToastColors();

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: toastStyle.bg,
          borderColor: toastStyle.border,
        },
      ]}
    >
      <Icon name={toastStyle.icon} size={18} color={toastStyle.iconColor} />
      <Text style={[styles.message, { color: toastStyle.text }]} numberOfLines={1}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 9999,
    maxWidth: '90%',
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Toast;
