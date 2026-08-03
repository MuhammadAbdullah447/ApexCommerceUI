import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, ColorScheme } from '../constants/theme';


interface SectionTitleProps {
  title: string;
  onViewAllPress?: () => void;
  colors?: ColorScheme;
}


const SectionTitle = ({ title, onViewAllPress, colors = COLORS }: SectionTitleProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.onSurface }]}>{title}</Text>

      {onViewAllPress && (
        <Pressable onPress={onViewAllPress}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
        </Pressable>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sectionTitle.fontSize - 4, // 20px, matches design's h3 sizing
    fontWeight: '600',
  },
  viewAll: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
    fontWeight: '600',
  },
});

export default SectionTitle;