import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY, ColorScheme } from '../constants/theme';


interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  colors?: ColorScheme;
}


const CategoryChip = ({ label, isSelected, onPress, colors = COLORS }: CategoryChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: isSelected ? colors.onPrimary : colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: SPACING.md + 4,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
    fontWeight: TYPOGRAPHY.labelSmall.fontWeight,
  },
});

export default CategoryChip;