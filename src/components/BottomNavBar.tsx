import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, ColorScheme } from '../constants/theme';


export type NavTab = 'home' | 'categories' | 'cart' | 'wishlist' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
  cartCount?: number;
  wishlistCount?: number;
  colors?: ColorScheme;
}


const TABS: { key: NavTab; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'categories', label: 'Categories', icon: 'category' },
  { key: 'cart', label: 'Cart', icon: 'shopping-cart' },
  { key: 'wishlist', label: 'Wishlist', icon: 'favorite-border' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];


const BottomNavBar = ({
  activeTab,
  onTabPress,
  cartCount = 0,
  wishlistCount = 0,
  colors = COLORS,
}: BottomNavBarProps) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainerLowest, borderTopColor: colors.outlineVariant },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onTabPress(tab.key)}>
            <View style={styles.iconWrapper}>
              <Icon
                name={tab.icon}
                size={24}
                color={isActive ? colors.primary : colors.onSurfaceVariant}
              />

              {/* Cart badge: only shown on the Cart tab, and only if count > 0 */}
              {tab.key === 'cart' && cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}

              {/* Wishlist badge: only shown on the Wishlist tab, and only if count > 0 */}
              {tab.key === 'wishlist' && wishlistCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>{wishlistCount}</Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.label,
                { color: isActive ? colors.primary : colors.onSurfaceVariant },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    height: 96,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    paddingBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  
});

export default BottomNavBar;