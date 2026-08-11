import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '../navigation/types';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import BottomNavBar, { NavTab } from '../components/BottomNavBar';
import { COLORS, SPACING, RADIUS, ColorScheme } from '../constants/theme';
import FilterBottomSheet, { FilterOptions } from '../components/FilterBottomSheet';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';


interface ProductListScreenProps {
  onProductPress: (productId: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
  colors?: ColorScheme;
  route?: RouteProp<AppTabParamList, 'Categories'>;
  navigation?: BottomTabNavigationProp<AppTabParamList, 'Categories'>;
}


const FILTERS = ['All Products', 'Sneakers', 'Running', 'Lifestyle'];

export const PRODUCTS = [
  {
    id: 'pl1',
    title: 'Apex Stealth Run',
    price: 189,
    rating: 4.9,
    category: 'Running',
    inStock: true,
    collection: 'Seasonal Drop',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdz_kq5eAEiUQtW3e_Xvs2fQfSL9oz_u6uJ87ny4sqWEVn5Wr3fdUq2jA4TyYwxgc-syoUjosfMAGx4J32P4ASJE5j3nP1qpSZJxMtX6ZGuvkWifg1qaizQf0-J-G7Sb_nsMtPmyxqxr9tUpFAcxr_xxeP8crTWtjaLvUxdaWLsaUdhchBb8vbGs8qFGyoqGJL1n75c94vsAuyfyKhYu2IoD0FeBDozKrQQuYlw54iKRneod3C1byobMpxwQ-4WH9UfUmcGaFYVh0',
  },
  {
    id: 'pl2',
    title: 'Luxe Lifestyle X',
    price: 145,
    rating: 4.8,
    category: 'Lifestyle',
    inStock: true,
    collection: 'New Collection',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtFNaFubhX6KmtU0AI0oqtJIEo-iXTSRGDvYwoLy4NJcJ6TYt3E1rrlcl7VnXY8ruksWys14qmycZRVFxSHnBIIVCK3i5UprjWYdYcsO9vNtXevyyB3lSFECvMJ0LQam5MZidPUY5xQOF8qx6RVXQTm1q8cOGRPEDekPOdy0XeWHneUU1eUyftnqVRjl7HjRRt4HfRFkACSFr16nsStrKoAeN0K2EyIDKSi4-FWxZGFplVlApBbxDaTZbg-8oxrsItSWgD8cntOzo',
  },
  {
    id: 'pl3',
    title: 'Velocity Pro',
    price: 210,
    rating: 4.7,
    category: 'Running',
    inStock: false,
    collection: 'Seasonal Drop',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD57fXxgsxAuaNj03OeRtkQjBjwRr0cgowLML8nc92e3GdftR4OJfN9YTPEqwn4t0XuIBT620ovOSqE7qK-iBCHU8wvCsKanCRDSFuusmoHq7Op0SbTCu_lOSjo5Sazc1ZnfxLJxVlUiSyCnIUExCK3zc6Ue6-mFkUNCXu76Q-bv27DGtCVSupB0FZCWiVwDB3q2BmQfTTd3R9EIz_ILR_FxTrzSDb3r_1Yqoa6S5oJWdQwkW96oUFMM2h1Z0PfV6tX55kMMZFO--o',
  },
  {
    id: 'pl4',
    title: 'Urban Classic',
    price: 120,
    rating: 5.0,
    category: 'Lifestyle',
    inStock: true,
    collection: 'New Collection',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhzM9cVjAowXnOEmoBRdgMhGQw-59tbg0PY3ze3DTROHnuNTm5luGP5xxbHjvaLxTBnpoqXoqmX2sc76IkL4hwfH6Efr73cZyKKFOiNeRtj9GXaex4JJb1UoCYQkvAryoYROBavqeZXU7Hs5-kndsGCSI450bW1cuacPBtbk5zfJpFZ-ZaL0FwaN2CmlECc0r5W1GFP5lPLQkYIS_SOdzH2SbevE-vLOoGNOSbudH-qBAmi2-9NadixqvDmjQL2dg8fr5W6OEQHI8',
  },
  {
    id: 'pl5',
    title: 'Dunk Master Elite',
    price: 195,
    rating: 4.6,
    category: 'Sneakers',
    inStock: true,
    collection: 'Seasonal Drop',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCyeSoN7gyswRulJSvPKNT58IBBW2aRSOLECAmFaZ3iTCO_OZiVg9rcuReNZjPdAZRYfKXDe0vqLu3Gsw1awerLiYNH017OC5HkI1ollK1YI56P-JzX4mCbrmWc4tjEWb0_eh-8jDS6su-ERgI1vsyNW923M1k6WCKE2FzFHDnmAZh_c4ufZUWX2l89pFfzqpiZ1lw2VfV39DitATFDoFUtmhEl6K6dXRUcZJEGcuqm8dv7uxUK-cTCQnAdGy5z8xK_WH4HHB1r4k8',
  },
  {
    id: 'pl6',
    title: 'Cloud Runner Air',
    price: 160,
    rating: 4.9,
    category: 'Running',
    inStock: false,
    collection: 'New Collection',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5yEwBqDgOg54fv2qNwS9EfTgr9e9hlIM6PVEx_0s6dQ8vrFR_Y3Y0l0OggTc3TvGS2XmQUgTSsz_YWCDtQdZDdrT7kZOjRofE7Pd5BYr5z26ZexH3lAkMytac7603hNAdkIcd5YVKG9AI5jPYG4EwtkKptERSZ8HsuPfI1sM1Pz2PycQRjUC3y_6Jhh7YJcZyhN7wr6Dlm_RCa-nUKXKQZCvkBjEnB6RPYwYtObfaV4OORVpXqEmoGLL_CA-cOB8tMnjsskxHqJE',
  },
];


type SortOption = 'default' | 'priceLowToHigh' | 'priceHighToLow';

const ProductListScreen = ({
  onProductPress,
  favoriteIds,
  onToggleFavorite,
  colors = COLORS,
  route,
  navigation,
}: ProductListScreenProps) => {
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All Products',
    priceSort: 'none',
    inStockOnly: false,
    minRating: 0,
  });
  const [collectionFilter, setCollectionFilter] = useState<string | undefined>(route?.params?.collection);
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (route?.params?.reset) {
      setSearchText('');
      setCollectionFilter(undefined);
      setFilters({
        category: 'All Products',
        priceSort: 'none',
        inStockOnly: false,
        minRating: 0,
      });
      navigation?.setParams({ reset: undefined });
    }
  }, [route?.params?.reset, navigation]);

  useEffect(() => {
    setCollectionFilter(route?.params?.collection);
  }, [route?.params?.collection]);

  const derivedProducts = [...PRODUCTS]
    .filter((product) => {
      if (collectionFilter && product.collection !== collectionFilter) {
        return false;
      }
      const matchesCategory =
        filters.category === 'All Products' || product.category === filters.category;
      const matchesSearch =
        product.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesStock = !filters.inStockOnly || product.inStock;
      const matchesRating = product.rating >= filters.minRating;

      return matchesCategory && matchesSearch && matchesStock && matchesRating;
    })
    .sort((a, b) => {
      if (filters.priceSort === 'lowToHigh') return a.price - b.price;
      if (filters.priceSort === 'highToLow') return b.price - a.price;
      return 0;
    });

  const cycleSortOption = () => {
    setFilters((prev) => {
      let nextSort: FilterOptions['priceSort'] = 'none';
      if (prev.priceSort === 'none') nextSort = 'lowToHigh';
      else if (prev.priceSort === 'lowToHigh') nextSort = 'highToLow';
      return { ...prev, priceSort: nextSort };
    });
  };

  const sortLabel =
    filters.priceSort === 'lowToHigh'
      ? 'Price: Low to High'
      : filters.priceSort === 'highToLow'
        ? 'Price: High to Low'
        : 'Sort';

  const isFilterActive =
    filters.priceSort !== 'none' || filters.inStockOnly || filters.minRating > 0;

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <Header title="Apex Premium" colors={colors} />

      <FlatList
        data={derivedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SearchBar
              ref={searchInputRef}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                if (text) {
                  setCollectionFilter(undefined);
                }
              }}
              placeholder="Search products..."
              onFilterPress={() => setFilterSheetVisible(true)}
              isFilterActive={isFilterActive}
              colors={colors}
            />

            <ScrollableFilterRow
              filters={FILTERS}
              selectedFilter={filters.category}
              onSelectFilter={(cat) => {
                setFilters((prev) => ({ ...prev, category: cat }));
                setCollectionFilter(undefined);
              }}
              colors={colors}
            />

            <View style={styles.sortRow}>
              <Pressable style={styles.sortButton} onPress={cycleSortOption}>
                <Icon name="swap-vert" size={16} color={colors.primary} />
                <Text style={[styles.sortButtonText, { color: colors.primary }]}>{sortLabel}</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptySearchContainer}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: colors.surfaceContainerLow }]}>
              <Icon name="search-off" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No Products Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              We couldn't find any products matching your search term. Try checking your spelling or resetting filters.
            </Text>
            <Pressable
              style={[styles.clearSearchButton, { borderColor: colors.primary }]}
              onPress={() => {
                setSearchText('');
                setCollectionFilter(undefined);
                setFilters({
                  category: 'All Products',
                  priceSort: 'none',
                  inStockOnly: false,
                  minRating: 0,
                });
                searchInputRef.current?.focus();
              }}
            >
              <Text style={[styles.clearSearchText, { color: colors.primary }]}>Clear Search & Filters</Text>
            </Pressable>
          </View>
        }
        
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard
              variant="grid"
              imageUri={item.imageUri}
              title={item.title}
              price={item.price}
              rating={item.rating}
              showAddButton
              onAddPress={() => {
                addToCart(item);
                setToastMessage(`${item.title} added to cart!`);
              }}
              isFavorite={favoriteIds.includes(item.id)}
              onFavoritePress={() => onToggleFavorite(item.id)}
              onPress={() => onProductPress(item.id)}
              colors={colors}
            />
          </View>
        )}
      />

      <FilterBottomSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        categories={FILTERS}
        currentFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={() =>
          setFilters({
            category: 'All Products',
            priceSort: 'none',
            inStockOnly: false,
            minRating: 0,
          })
        }
        colors={colors}
      />
      <Toast
        visible={!!toastMessage}
        message={toastMessage}
        onDismiss={() => setToastMessage('')}
        colors={colors}
      />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};


interface ScrollableFilterRowProps {
  filters: string[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  colors?: ColorScheme;
}

const ScrollableFilterRow = ({
  filters,
  selectedFilter,
  onSelectFilter,
  colors = COLORS,
}: ScrollableFilterRowProps) => {
  return (
    <View style={styles.filterRow}>
      {filters.map((filter) => (
        <CategoryChip
          key={filter}
          label={filter}
          isSelected={selectedFilter === filter}
          onPress={() => onSelectFilter(filter)}
          colors={colors}
        />
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.marginMobile,
    paddingBottom: SPACING.xl,
  },
  headerBlock: {
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    rowGap: SPACING.sm,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: SPACING.gutter,
  },
  emptyText: {
    fontSize: 14,
    paddingVertical: SPACING.lg,
    textAlign: 'center',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.md,
  },
  emptyIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  clearSearchButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductListScreen;