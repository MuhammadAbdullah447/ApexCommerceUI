import React, { forwardRef } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, RADIUS, SPACING, ColorScheme } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  isFilterActive?: boolean;
  colors?: ColorScheme;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(
  (
    {
      value,
      onChangeText,
      placeholder = 'Search...',
      onFilterPress,
      isFilterActive = false,
      colors = COLORS,
    },
    ref
  ) => {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant },
        ]}
      >
        {/* Search icon sits absolutely inside the input's left padding */}
        <Icon name="search" size={22} color={colors.outline} style={styles.searchIcon} />

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          style={[styles.input, { color: colors.onSurface }]}
        />

      {/* Circular filter button docked on the right edge */}
      <Pressable
        style={[styles.filterButton, { backgroundColor: colors.primary }]}
        onPress={onFilterPress}
      >
        <View style={{ position: 'relative' }}>
          <Icon name="tune" size={18} color={colors.onPrimary} />
          {isFilterActive && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.tertiary,
                borderWidth: 1.5,
                borderColor: colors.primary,
              }}
            />
          )}
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingLeft: 44,
    paddingRight: 6,
  },
  searchIcon: {
    position: 'absolute',
    left: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchBar;