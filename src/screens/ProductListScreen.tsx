import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import BottomNavBar, { NavTab } from '../components/BottomNavBar';
import { COLORS, SPACING, STATUSBAR_HEIGHT, ColorScheme } from '../constants/theme';


interface ProductListScreenProps {
  onTabPress: (tab: NavTab) => void;
  onProductPress: (productId: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
  colors?: ColorScheme;
}


const FILTERS = ['All Products', 'Sneakers', 'Running', 'Lifestyle'];

export const PRODUCTS = [
  {
    id: 'pl1',
    title: 'Apex Stealth Run',
    price: 189,
    rating: 4.9,
    category: 'Running',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdz_kq5eAEiUQtW3e_Xvs2fQfSL9oz_u6uJ87ny4sqWEVn5Wr3fdUq2jA4TyYwxgc-syoUjosfMAGx4J32P4ASJE5j3nP1qpSZJxMtX6ZGuvkWifg1qaizQf0-J-G7Sb_nsMtPmyxqxr9tUpFAcxr_xxeP8crTWtjaLvUxdaWLsaUdhchBb8vbGs8qFGyoqGJL1n75c94vsAuyfyKhYu2IoD0FeBDozKrQQuYlw54iKRneod3C1byobMpxwQ-4WH9UfUmcGaFYVh0',
  },
  {
    id: 'pl2',
    title: 'Luxe Lifestyle X',
    price: 145,
    rating: 4.8,
    category: 'Lifestyle',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtFNaFubhX6KmtU0AI0oqtJIEo-iXTSRGDvYwoLy4NJcJ6TYt3E1rrlcl7VnXY8ruksWys14qmycZRVFxSHnBIIVCK3i5UprjWYdYcsO9vNtXevyyB3lSFECvMJ0LQam5MZidPUY5xQOF8qx6RVXQTm1q8cOGRPEDekPOdy0XeWHneUU1eUyftnqVRjl7HjRRt4HfRFkACSFr16nsStrKoAeN0K2EyIDKSi4-FWxZGFplVlApBbxDaTZbg-8oxrsItSWgD8cntOzo',
  },
  {
    id: 'pl3',
    title: 'Velocity Pro',
    price: 210,
    rating: 4.7,
    category: 'Running',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD57fXxgsxAuaNj03OeRtkQjBjwRr0cgowLML8nc92e3GdftR4OJfN9YTPEqwn4t0XuIBT620ovOSqE7qK-iBCHU8wvCsKanCRDSFuusmoHq7Op0SbTCu_lOSjo5Sazc1ZnfxLJxVlUiSyCnIUExCK3zc6Ue6-mFkUNCXu76Q-bv27DGtCVSupB0FZCWiVwDB3q2BmQfTTd3R9EIz_ILR_FxTrzSDb3r_1Yqoa6S5oJWdQwkW96oUFMM2h1Z0PfV6tX55kMMZFO--o',
  },
  {
    id: 'pl4',
    title: 'Urban Classic',
    price: 120,
    rating: 5.0,
    category: 'Lifestyle',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhzM9cVjAowXnOEmoBRdgMhGQw-59tbg0PY3ze3DTROHnuNTm5luGP5xxbHjvaLxTBnpoqXoqmX2sc76IkL4hwfH6Efr73cZyKKFOiNeRtj9GXaex4JJb1UoCYQkvAryoYROBavqeZXU7Hs5-kndsGCSI450bW1cuacPBtbk5zfJpFZ-ZaL0FwaN2CmlECc0r5W1GFP5lPLQkYIS_SOdzH2SbevE-vLOoGNOSbudH-qBAmi2-9NadixqvDmjQL2dg8fr5W6OEQHI8',
  },
  {
    id: 'pl5',
    title: 'Dunk Master Elite',
    price: 195,
    rating: 4.6,
    category: 'Sneakers',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCyeSoN7gyswRulJSvPKNT58IBBW2aRSOLECAmFaZ3iTCO_OZiVg9rcuReNZjPdAZRYfKXDe0vqLu3Gsw1awerLiYNH017OC5HkI1ollK1YI56P-JzX4mCbrmWc4tjEWb0_eh-8jDS6su-ERgI1vsyNW923M1k6WCKE2FzFHDnmAZh_c4ufZUWX2l89pFfzqpiZ1lw2VfV39DitATFDoFUtmhEl6K6dXRUcZJEGcuqm8dv7uxUK-cTCQnAdGy5z8xK_WH4HHB1r4k8',
  },
  {
    id: 'pl6',
    title: 'Cloud Runner Air',
    price: 160,
    rating: 4.9,
    category: 'Running',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5yEwBqDgOg54fv2qNwS9EfTgr9e9hlIM6PVEx_0s6dQ8vrFR_Y3Y0l0OggTc3TvGS2XmQUgTSsz_YWCDtQdZDdrT7kZOjRofE7Pd5BYr5z26ZexH3lAkMytac7603hNAdkIcd5YVKG9AI5jPYG4EwtkKptERSZ8HsuPfI1sM1Pz2PycQRjUC3y_6Jhh7YJcZyhN7wr6Dlm_RCa-nUKXKQZCvkBjEnB6RPYwYtObfaV4OORVpXqEmoGLL_CA-cOB8tMnjsskxHqJE',
  },
];


type SortOption = 'default' | 'priceLowToHigh' | 'priceHighToLow';

const ProductListScreen = ({
  onTabPress,
  onProductPress,
  favoriteIds,
  onToggleFavorite,
  colors = COLORS,
}: ProductListScreenProps) => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Products');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesFilter = selectedFilter === 'All Products' || product.category === selectedFilter;
    const matchesSearch = product.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'priceLowToHigh') return a.price - b.price;
    if (sortOption === 'priceHighToLow') return b.price - a.price;
    return 0; // 'default': keep original order
  });

  const cycleSortOption = () => {
    if (sortOption === 'default') setSortOption('priceLowToHigh');
    else if (sortOption === 'priceLowToHigh') setSortOption('priceHighToLow');
    else setSortOption('default');
  };

  const sortLabel =
    sortOption === 'priceLowToHigh'
      ? 'Price: Low to High'
      : sortOption === 'priceHighToLow'
        ? 'Price: High to Low'
        : 'Sort';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Apex Premium" onBellPress={() => {}} colors={colors} />

      <FlatList
        data={sortedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search products..."
              onFilterPress={() => {}}
              colors={colors}
            />

            <ScrollableFilterRow
              filters={FILTERS}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
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
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No products match your search.
          </Text>
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
              onAddPress={() => {}}
              isFavorite={favoriteIds.includes(item.id)}
              onFavoritePress={() => onToggleFavorite(item.id)}
              onPress={() => onProductPress(item.id)}
              colors={colors}
            />
          </View>
        )}
      />

      <BottomNavBar activeTab="categories" onTabPress={onTabPress} cartCount={2} colors={colors} />
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
    paddingTop: STATUSBAR_HEIGHT,
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
});

export default ProductListScreen;