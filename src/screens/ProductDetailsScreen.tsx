import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import Button from '../components/Button';
import { COLORS, SPACING, RADIUS, ColorScheme } from '../constants/theme';
import Toast from '../components/Toast';
import BottomSheet from '../components/BottomSheet';
import { useProductDetails, useProducts } from '../hooks/useProducts';
import { getApiErrorMessage } from '../utils/errorUtils';

interface ProductDetails {
  id: string;
  category: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
}

interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  imageUri: string;
}

interface ProductDetailsScreenProps {
  productId?: string;
  product?: ProductDetails;
  onBackPress: () => void;
  onSharePress?: () => void;
  onBellPress?: () => void;
  onAddToCart?: (productItem?: { id: string; title: string; price: number; imageUri: string }) => void;
  onBuyNow?: () => void;
  onRelatedProductPress?: (productId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  colors?: ColorScheme;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const DEFAULT_PRODUCT: ProductDetails = {
  id: 'na1',
  category: 'PERFORMANCE SERIES',
  title: 'Apex Velocity Runner',
  price: 189,
  rating: 4.5,
  reviewCount: 1248,
  description:
    'Engineered for elite marathoners and daily commuters alike, the Apex Velocity Runner redefines high-performance footwear. Featuring our proprietary carbon-infused ReactX foam and a dual-layer breathable mesh upper, these shoes provide unparalleled energy return and a glove-like fit. The aerodynamic silhouette minimizes drag while the reinforced heel counter ensures stability at any pace.',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAGJyGhgtVLj2BaO3CqVzgaayJtFGuaF6tD6r1rjrYhUPxZR3Svwqd-8wnAOKbWp582YrO2JVr9Byx138UEmxXhc8r7AbufEnE13n3D_arbwa8piaYwSgsu-22l8Sh316U_JnzJZkKqJcDGEHxa4LjDRWznYAOeSHdw1SG6YtyqcLSYx9rF58FbUS9NRq13w9m_cOffDAi7WWt7mn35AQTH0sQUDypIhJxZxbw71QZSYHE_kzPMC3vC6UzXBmOm6KbS5w4QSJvgZjM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuALPIEZIxJh4cmmM2VYF00wgMFJ_k-dO5Y3pqQYXH4uuQOuErpApsITRay5zXslpbONxs14C4sRPkHgLxQ9QC09vhrr3e0nuhhfZXgtqo0PUNk0FLFEGOQFwzPqCsBfADl_f5njdUVHBtwG_bklKEt8TObcMrSbO3tIP-Z6aAn_uIEMLCjqfyeyQRC6ITjAFUIqeq_XlFzcmvJfENGMsDnNTsI1F7r17P1CBjQfhmS0kPs0RdvzXtU39uO6vJAmJkhaL-Jg7JQstCo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_FxDYsHJTDGiZXk0sXbjSSXmr5OBQj72l_tY524VZgKJ0rATHjrbru-qjycmvlyWupCoazZX9Yjfctqr-2u5932Ghb1V81HIRveyXT-uTGZC9EW08PaB27dLMQQlO_jFBroFoh-0Egm3KOd-DvucpVuArSbtXraZ_Hv9cx78PPSp4ZAatjv1-HBEbQAJIfnv5oHsxYQN773WDiP2vnuvTs-HyD1ReT-ZiGAszzdfFhVgN3f59sx2lK915zccPTCsyMc0vpfEmo0A',
  ],
};

const COLORS_LIST = ['#2563EB', '#131B2E', '#C3C6D7', '#E11D48'];
const SIZES = ['8', '9', '10', '11', '12'];

const ProductDetailsScreen = ({
  productId,
  product: fallbackProduct = DEFAULT_PRODUCT,
  onBackPress,
  onSharePress,
  onBellPress,
  onAddToCart,
  onBuyNow,
  onRelatedProductPress,
  isFavorite = false,
  onToggleFavorite,
  colors = COLORS,
}: ProductDetailsScreenProps) => {
  const productQuery = useProductDetails(productId);
  const relatedQuery = useProducts({ limit: 6 });

  const fetchedProduct = productQuery.data?.product;
  const activeProduct: ProductDetails = fetchedProduct
    ? {
        id: fetchedProduct.id,
        category: fetchedProduct.category,
        title: fetchedProduct.title,
        price: fetchedProduct.price,
        rating: fetchedProduct.rating,
        reviewCount: fetchedProduct.reviewCount || 124,
        description: fetchedProduct.description || fallbackProduct.description,
        images: fetchedProduct.images && fetchedProduct.images.length > 0 ? fetchedProduct.images : [fetchedProduct.imageUri],
      }
    : fallbackProduct;

  const relatedProducts: RelatedProduct[] = relatedQuery.data?.mappedProducts
    ? relatedQuery.data.mappedProducts
        .filter((p) => p.id !== activeProduct.id)
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          imageUri: p.imageUri,
        }))
    : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS_LIST[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Apex Premium"
        showBackButton
        onBackPress={onBackPress}
        onSharePress={onSharePress}
        onBellPress={onBellPress}
        colors={colors}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE GALLERY */}
        <View style={styles.gallery}>
          {productQuery.isPending ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : productQuery.isError ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.md }}>
              <Icon name="error-outline" size={40} color={colors.error} />
              <Text style={{ color: colors.onSurface, marginTop: SPACING.xs, textAlign: 'center' }}>
                {getApiErrorMessage(productQuery.error)}
              </Text>
              <Pressable
                style={{ marginTop: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: colors.primary }}
                onPress={() => productQuery.refetch()}
              >
                <Text style={{ color: colors.primary }}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <FlatList
                data={activeProduct.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(uri, index) => `${activeProduct.id}-${index}`}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width,
                  );
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                )}
              />

              <View style={styles.dotsRow}>
                {activeProduct.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { backgroundColor: colors.outlineVariant },
                      index === activeImageIndex && { backgroundColor: colors.primary },
                    ]}
                  />
                ))}
              </View>
            </>
          )}

          <Pressable
            style={[styles.favoriteButton, { backgroundColor: colors.surfaceContainerLowest }]}
            onPress={onToggleFavorite}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavorite ? colors.tertiary : colors.onSurfaceVariant}
            />
          </Pressable>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={[styles.category, { color: colors.primary }]}>{activeProduct.category}</Text>
              <Text style={[styles.title, { color: colors.onSurface }]}>{activeProduct.title}</Text>
            </View>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${activeProduct.price.toFixed(2)}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <StarRating rating={activeProduct.rating} colors={colors} />
            <Text style={[styles.reviewCount, { color: colors.onSurfaceVariant }]}>
              ({activeProduct.reviewCount.toLocaleString()} Reviews)
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionBlock}>
            <Text
              style={[styles.description, { color: colors.onSurfaceVariant }]}
              numberOfLines={isDescriptionExpanded ? undefined : 3}
            >
              {activeProduct.description}
            </Text>
            <Pressable onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
              <Text style={[styles.readMore, { color: colors.primary }]}>
                {isDescriptionExpanded ? 'Read Less' : 'Read More'}
              </Text>
            </Pressable>
          </View>

          {/* Color Selection */}
          <View style={styles.selectionSection}>
            <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>COLOR</Text>
            <View style={styles.colorRow}>
              {COLORS_LIST.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    selectedColor === color && { borderWidth: 2, borderColor: colors.primary },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.selectionSection}>
            <View style={styles.sizeHeaderRow}>
              <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>
                SIZE (US)
              </Text>
              <Pressable onPress={() => setShowSizeGuide(true)}>
                <Text style={[styles.sizeGuideLink, { color: colors.primary }]}>Size Guide</Text>
              </Pressable>
            </View>
            <View style={styles.sizeRow}>
              {SIZES.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <Pressable
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={[
                      styles.sizeChip,
                      { borderColor: colors.outlineVariant },
                      isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        { color: isSelected ? colors.white : colors.onSurface },
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>QUANTITY</Text>
            <View style={[styles.quantityStepper, { backgroundColor: colors.surfaceContainer }]}>
              <Pressable style={styles.stepperButton} onPress={decreaseQuantity}>
                <Icon name="remove" size={18} color={colors.onSurface} />
              </Pressable>
              <Text style={[styles.quantityValue, { color: colors.onSurface }]}>{quantity}</Text>
              <Pressable style={styles.stepperButton} onPress={increaseQuantity}>
                <Icon name="add" size={18} color={colors.onSurface} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Related Products */}
        <View style={styles.relatedSection}>
          <Text style={[styles.relatedTitle, { color: colors.onSurface }]}>Related Products</Text>
          <FlatList
            data={relatedProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ width: SPACING.gutter }} />}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.relatedCard, { backgroundColor: colors.surfaceContainerLow }]}
                onPress={() => onRelatedProductPress?.(item.id)}
              >
                <Image source={{ uri: item.imageUri }} style={styles.relatedImage} />
                <View style={styles.relatedContent}>
                  <Text
                    style={[styles.relatedName, { color: colors.onSurface }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.relatedPrice, { color: colors.primary }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surfaceContainerLowest, borderTopColor: colors.outlineVariant }]}>
        <View style={styles.footerButton}>
          <Button
            label="Add to Cart"
            onPress={() => {
              setToastMessage(`${activeProduct.title} added to cart!`);
              setToastVisible(true);
              onAddToCart?.({
                id: activeProduct.id,
                title: activeProduct.title,
                price: activeProduct.price,
                imageUri: activeProduct.images[0] || '',
              });
            }}
            variant="outline"
            colors={colors}
          />
        </View>
        <View style={styles.footerButton}>
          <Button
            label="Buy Now"
            onPress={() => {
              setToastMessage(`Proceeding to checkout with ${quantity}x ${activeProduct.title}!`);
              setToastVisible(true);
              onBuyNow?.();
            }}
            variant="primary"
            colors={colors}
          />
        </View>
      </View>

      {/* Size Guide Bottom Sheet */}
      <BottomSheet
        visible={showSizeGuide}
        title="Size Guide"
        onClose={() => setShowSizeGuide(false)}
        colors={colors}
      >
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetSubtitle, { color: colors.onSurfaceVariant }]}>
            US Size conversions for footwear and apparel
          </Text>
          <View style={styles.sheetTable}>
            <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: colors.outlineVariant }]}>
              <Text style={[styles.tableHeaderCell, { color: colors.onSurface }]}>US</Text>
              <Text style={[styles.tableHeaderCell, { color: colors.onSurface }]}>EU</Text>
              <Text style={[styles.tableHeaderCell, { color: colors.onSurface }]}>UK</Text>
              <Text style={[styles.tableHeaderCell, { color: colors.onSurface }]}>Inches</Text>
            </View>
            {[
              { us: '7.0', eu: '40', uk: '6.5', in: '9.6"' },
              { us: '8.0', eu: '41', uk: '7.5', in: '10.0"' },
              { us: '9.0', eu: '42', uk: '8.5', in: '10.3"' },
              { us: '10.0', eu: '43', uk: '9.5', in: '10.6"' },
              { us: '11.0', eu: '44', uk: '10.5', in: '11.0"' },
              { us: '12.0', eu: '45', uk: '11.5', in: '11.3"' },
            ].map((row, index) => (
              <View key={index} style={[styles.tableRow, { borderBottomColor: colors.outlineVariant }]}>
                <Text style={[styles.tableCell, { color: colors.onSurface }]}>{row.us}</Text>
                <Text style={[styles.tableCell, { color: colors.onSurface }]}>{row.eu}</Text>
                <Text style={[styles.tableCell, { color: colors.onSurface }]}>{row.uk}</Text>
                <Text style={[styles.tableCell, { color: colors.onSurface }]}>{row.in}</Text>
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>

      {/* Toast Alert Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onDismiss={() => setToastVisible(false)}
        colors={colors}
      />
    </SafeAreaView>
  );
};


const StarRating = ({ rating, colors }: { rating: number; colors: ColorScheme }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  const stars = [1, 2, 3, 4, 5].map((position) => {
    if (position <= fullStars) return 'star';
    if (position === fullStars + 1 && hasHalfStar) return 'star-half';
    return 'star-border';
  });

  return (
    <View style={styles.starRow}>
      {stars.map((iconName, index) => (
        <Icon key={index} name={iconName} size={16} color={colors.secondaryContainer} />
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gallery: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: '100%',
    resizeMode: 'cover',
  },
  dotsRow: {
    position: 'absolute',
    bottom: SPACING.lg,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  content: {
    paddingHorizontal: SPACING.marginMobile,
    marginTop: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleColumn: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  starRow: {
    flexDirection: 'row',
  },
  reviewCount: {
    fontSize: 12, 
  },
  descriptionBlock: {
    marginTop: SPACING.lg,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  readMore: {
    marginTop: SPACING.xs,
    fontSize: 12,
    fontWeight: '700',
  },
  selectionSection: {
    marginTop: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  sizeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sizeGuideLink: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  sizeChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  sizeChipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantitySection: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gutter,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: 4,
  },
  stepperButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    width: 48,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  relatedSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.marginMobile,
    paddingBottom: SPACING.lg,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  relatedCard: {
    width: 160,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  relatedContent: {
    padding: SPACING.sm,
  },
  relatedName: {
    fontSize: 12,
    fontWeight: '700',
  },
  relatedPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl + SPACING.md,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
  sheetContent: {
    paddingVertical: 10,
  },
  sheetSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  sheetTable: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderRow: {
    backgroundColor: '#f9fafb',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProductDetailsScreen;