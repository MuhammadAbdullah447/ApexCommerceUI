import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from './BottomSheet';
import Button from './Button';
import CategoryChip from './CategoryChip';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';

export interface FilterOptions {
  category: string;
  priceSort: 'lowToHigh' | 'highToLow' | 'none';
  inStockOnly: boolean;
  minRating: number;
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  currentFilters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  colors?: ColorScheme;
}

const FilterBottomSheet = ({
  visible,
  onClose,
  categories,
  currentFilters,
  onApply,
  onReset,
  colors = COLORS,
}: FilterBottomSheetProps) => {
  // Local state to hold selections before they are applied
  const [tempCategory, setTempCategory] = useState<string>(currentFilters.category);
  const [tempPriceSort, setTempPriceSort] = useState<FilterOptions['priceSort']>(currentFilters.priceSort);
  const [tempInStockOnly, setTempInStockOnly] = useState<boolean>(currentFilters.inStockOnly);
  const [tempMinRating, setTempMinRating] = useState<number>(currentFilters.minRating);

  // Sync state when sheet becomes visible or active filters change
  useEffect(() => {
    if (visible) {
      setTempCategory(currentFilters.category);
      setTempPriceSort(currentFilters.priceSort);
      setTempInStockOnly(currentFilters.inStockOnly);
      setTempMinRating(currentFilters.minRating);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({
      category: tempCategory,
      priceSort: tempPriceSort,
      inStockOnly: tempInStockOnly,
      minRating: tempMinRating,
    });
    onClose();
  };

  const handleReset = () => {
    setTempCategory(categories[0] || 'All');
    setTempPriceSort('none');
    setTempInStockOnly(false);
    setTempMinRating(0);
  };

  return (
    <BottomSheet
      visible={visible}
      title="Filter Products"
      onClose={onClose}
      colors={colors}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Category section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>CATEGORY</Text>
          <View style={styles.chipRow}>
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isSelected={tempCategory === category}
                onPress={() => setTempCategory(category)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Price sorting section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>PRICE SORTING</Text>
          <View style={styles.chipRow}>
            <Pressable
              style={[
                styles.sortChip,
                { borderColor: colors.outlineVariant },
                tempPriceSort === 'lowToHigh' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setTempPriceSort(tempPriceSort === 'lowToHigh' ? 'none' : 'lowToHigh')}
            >
              <Icon
                name="trending-up"
                size={16}
                color={tempPriceSort === 'lowToHigh' ? colors.white : colors.primary}
              />
              <Text
                style={[
                  styles.sortChipText,
                  { color: tempPriceSort === 'lowToHigh' ? colors.white : colors.onSurface },
                ]}
              >
                Low → High
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.sortChip,
                { borderColor: colors.outlineVariant },
                tempPriceSort === 'highToLow' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setTempPriceSort(tempPriceSort === 'highToLow' ? 'none' : 'highToLow')}
            >
              <Icon
                name="trending-down"
                size={16}
                color={tempPriceSort === 'highToLow' ? colors.white : colors.primary}
              />
              <Text
                style={[
                  styles.sortChipText,
                  { color: tempPriceSort === 'highToLow' ? colors.white : colors.onSurface },
                ]}
              >
                High → Low
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Availability section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>AVAILABILITY</Text>
          <View style={styles.chipRow}>
            <Pressable
              style={[
                styles.sortChip,
                { borderColor: colors.outlineVariant },
                tempInStockOnly && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setTempInStockOnly(!tempInStockOnly)}
            >
              <Icon
                name="check-circle"
                size={16}
                color={tempInStockOnly ? colors.white : colors.primary}
              />
              <Text
                style={[
                  styles.sortChipText,
                  { color: tempInStockOnly ? colors.white : colors.onSurface },
                ]}
              >
                In Stock Only
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Rating section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>MINIMUM RATING</Text>
          <View style={styles.chipRow}>
            {[
              { label: 'All', value: 0 },
              { label: '4.0★ & above', value: 4.0 },
              { label: '4.5★ & above', value: 4.5 },
              { label: '4.8★ & above', value: 4.8 },
            ].map((ratingOption) => (
              <Pressable
                key={ratingOption.value}
                style={[
                  styles.sortChip,
                  { borderColor: colors.outlineVariant },
                  tempMinRating === ratingOption.value && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setTempMinRating(ratingOption.value)}
              >
                {ratingOption.value > 0 && (
                  <Icon
                    name="star"
                    size={14}
                    color={tempMinRating === ratingOption.value ? colors.white : colors.secondaryContainer}
                  />
                )}
                <Text
                  style={[
                    styles.sortChipText,
                    { color: tempMinRating === ratingOption.value ? colors.white : colors.onSurface },
                  ]}
                >
                  {ratingOption.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Buttons section */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              label="Reset"
              variant="outline"
              colors={colors}
              onPress={handleReset}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              label="Apply Filters"
              variant="primary"
              colors={colors}
              onPress={handleApply}
            />
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  sortChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default FilterBottomSheet;
