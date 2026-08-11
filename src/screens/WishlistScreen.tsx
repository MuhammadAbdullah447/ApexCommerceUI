import React, { useRef } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Header from '../components/Header';
import Button from '../components/Button';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { NEW_ARRIVALS, POPULAR_PRODUCTS } from './HomeScreen';
import { PRODUCTS } from './ProductListScreen';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '../navigation/types';

const ALL_PRODUCTS = [...NEW_ARRIVALS, ...POPULAR_PRODUCTS, ...PRODUCTS];

type WishlistScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Wishlist'>;

interface WishlistScreenProps {
  navigation: WishlistScreenNavigationProp;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onProductPress: (id: string) => void;
  colors?: ColorScheme;
}

const WishlistScreen = ({
  navigation,
  favoriteIds,
  onToggleFavorite,
  onProductPress,
  colors = COLORS,
}: WishlistScreenProps) => {
  const wishlistItems = ALL_PRODUCTS.filter((item) => favoriteIds.includes(item.id));

  const renderRightActions = (id: string) => {
    return (
      <Pressable
        style={[styles.deleteAction, { backgroundColor: colors.error }]}
        onPress={() => onToggleFavorite(id)}
      >
        <Icon name="delete" size={24} color={colors.white} />
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Wishlist" colors={colors} />

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContent}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceContainerLow }]}>
            <Icon name="favorite-border" size={64} color={colors.tertiaryContainer} />
          </View>
          <Text style={[styles.title, { color: colors.onSurface }]}>Your Wishlist is Empty</Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Save your favorite items here to view them later or share them with friends.
          </Text>
          <Button
            label="Discover Products"
            onPress={() => navigation.navigate('Categories')}
            variant="primary"
            colors={colors}
            style={styles.button}
          />
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.swipeContainer}>
              <Swipeable
                renderRightActions={() => renderRightActions(item.id)}
                friction={2}
                rightThreshold={40}
              >
                <Pressable
                  style={[styles.itemCard, { backgroundColor: colors.surfaceContainerLowest }]}
                  onPress={() => onProductPress(item.id)}
                >
                  <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemTitle, { color: colors.onSurface }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.itemCategory, { color: colors.onSurfaceVariant }]}>
                      {item.category}
                    </Text>
                    <View style={styles.itemFooter}>
                      <Text style={[styles.itemPrice, { color: colors.primary }]}>
                        ${item.price.toFixed(2)}
                      </Text>
                      <View style={styles.ratingRow}>
                        <Icon name="star" size={14} color={colors.secondaryContainer} />
                        <Text style={[styles.ratingText, { color: colors.onSurfaceVariant }]}>
                          {item.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color={colors.outlineVariant} />
                </Pressable>
              </Swipeable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.marginMobile,
    paddingBottom: 64,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sectionTitle.fontSize - 2,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  button: {
    maxWidth: 240,
  },
  listContent: {
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  swipeContainer: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.sm + 4,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteAction: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default WishlistScreen;
