import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, RADIUS, SPACING, ColorScheme } from '../constants/theme';


interface ProductCardProps {
  imageUri: string;
  title: string;
  price: number;
  rating: number;
  reviewCount?: number;
  variant?: 'carousel' | 'grid';
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  showAddButton?: boolean;
  onAddPress?: () => void;
  onPress?: () => void;
  colors?: ColorScheme;
}


const ProductCard = ({
  imageUri,
  title,
  price,
  rating,
  reviewCount,
  variant = 'grid',
  isFavorite = false,
  onFavoritePress,
  showAddButton = false,
  onAddPress,
  onPress,
  colors = COLORS,
}: ProductCardProps) => {
  const isCarousel = variant === 'carousel';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.surfaceContainerLowest },
        isCarousel && styles.carouselCard,
      ]}
    >
      {/* IMAGE + FAVORITE HEART */}
      <View style={isCarousel ? styles.carouselImageWrapper : styles.gridImageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <Pressable style={styles.favoriteButton} onPress={onFavoritePress}>
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={16}
            color={isFavorite ? colors.tertiary : colors.onSurfaceVariant}
          />
        </Pressable>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* Grid variant shows rating ABOVE the title */}
        {!isCarousel && (
          <View style={styles.ratingRow}>
            <Icon name="star" size={12} color={colors.secondaryContainer} />
            <Text style={[styles.ratingText, { color: colors.onSurfaceVariant }]}>
              {rating}
              {reviewCount ? ` (${reviewCount} reviews)` : ''}
            </Text>
          </View>
        )}

        <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.primary }]}>${price.toFixed(2)}</Text>

          {/* Carousel variant shows rating NEXT TO the price instead */}
          {isCarousel && (
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color={colors.secondaryContainer} />
              <Text style={[styles.ratingText, { color: colors.onSurfaceVariant }]}>{rating}</Text>
            </View>
          )}

          {showAddButton && (
            <Pressable
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={onAddPress}
            >
              <Icon name="add" size={18} color={colors.onPrimary} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  carouselCard: {
    width: 200,
    flex: 0,
  },
  gridImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  carouselImageWrapper: {
    width: '100%',
    height: 192,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  addButton: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;