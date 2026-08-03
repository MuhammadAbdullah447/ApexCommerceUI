import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import BottomNavBar, { NavTab } from '../components/BottomNavBar';
import { COLORS, SPACING, RADIUS, STATUSBAR_HEIGHT, ColorScheme } from '../constants/theme';


interface HomeScreenProps {
  onTabPress: (tab: NavTab) => void;
  onProductPress: (productId: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
  colors?: ColorScheme;
}


const CATEGORIES = ['All', 'Shoes', 'Apparel', 'Watches', 'Accessories'];

export const NEW_ARRIVALS = [
  {
    id: 'na1',
    title: 'Apex Velocity Runner',
    price: 189,
    rating: 4.9,
    category: 'Shoes',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Vjq8SjWN24xKUn07IZoGnNCGM3_R_s_wxqHRIX_Kd49CZmG0SwHCYKQjHmLTPlBj46zt2mvclmw3BqTPFWDiLC-q2Mjy3E05aThFZ7AfFwVQ1Y2Nce1c3xM88IDe-xru11VH5_4mYumZwjnYapvgLphWBG1YYz7e-I4-eCSidtmjs8F0oGgjqXgYuEY07bSnYEswhZloYxElpMRRd6LkW8bKmpjq7Xa9aGayx5HJyglWxSh8FV9KxTXFtINKOqjkbXvH-g3laHE',
  },
  {
    id: 'na2',
    title: 'Midnight Horizon X',
    price: 450,
    rating: 4.8,
    category: 'Watches',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDITYergCZBOaS0AyO-ppD-FLKD5pi98DZ7c1cX3EH647oOFYKSmYzO4V3OCeGe9M2qWDDalIMKsKMYzrtRU3VIt6u2hyeFLN9UmAaDccpHhhrnM8PVo8aO8Ingg3YSd5aBKwp6avjwXbOjVaP23S8W6aJS71LQ69hZbiBAHNr80sBhvsM-Ogx9I9gIJu0w_k1ZKazedXgEt0ie0RWQDCphQqa5v_4DGga7FYtXacjejIw5IL-AdM_L8vHQ_KLtCegKjIfYmAe-etQ',
  },
  {
    id: 'na3',
    title: 'Urban Tech Shell',
    price: 295,
    rating: 4.7,
    category: 'Apparel',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHbLWFJ5sxZ30fALW5nAQtNCO62xz5t9kRYQ2tkufGHDJKNv8V9yyELJ8fNKhdn1XgU1OJT05Zez_opoJVdCvfxs1UGUAbMMy3XeDtRjJ0nST1gTdw0dwYu_MC0jFBnhRRc0yTnUDF_apB2u-HtBwaRtQxR2w60rTj6ph1w0PWDvdvw4p7fpHeQ7cldgKMHFnlKZgbabGCNF5wDRYB5UQjjGQIERqadKBwVrQp0cplxsVKFzyd85zJ6TTUEdqBPCuVcG0cDH6HsBQ',
  },
];

export const POPULAR_PRODUCTS = [
  {
    id: 'pp1',
    title: 'Apex Sonic Max',
    price: 349,
    rating: 4.9,
    reviewCount: 124,
    category: 'Accessories',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8RHAsYfTpUU14HkPwZassPK9SBdBjMdkABYE9TqDBMdsKqmHcSkoAZHJ-jtpVDasK1Fi_wyIzJ3Nt1WW3b8g0jJ4OsedWqmMshp4fq0PidIJjE72iAeP-0JNbCFTpA58COeHG-ON7bNRDj2uNopSg8OOM8gBnH8ooj6dvXHwrZvsK71s3luLBEWS540UM4hYOUDjQ8gFmRr7KWdRfvRrGiFWutAjF-Z8bldjvkYLcSGZXd1IXM64FiqzVyETbLfZbcQhrghaVj0s',
  },
  {
    id: 'pp2',
    title: 'Heritage Leather Duffel',
    price: 220,
    rating: 5.0,
    reviewCount: 42,
    category: 'Accessories',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGl_npX0uCpXSO-vtk5r1GBH2UDxccg-5NIPnmC4rsmSoiqrZjS2Yk3siDk5xQWj8hghzXUHlxU6C73BTlU-7JOxuf0BHG6s2srM405uwS-PqyerFxHNWEd4aRq3LLRfKe8YX16qOoiyS1uT7vOQH-KkYXTLSbe7MyX4kBuMVgt-DdlexAuIQRZFb4HvF3AKKrpmhTfzJXxQzMas2ZjKeTe1VVLOqCTKHLlYrUxEOeyqDtGc8xHrxBaCW_1UIwAcf6IkKs9m74KjE',
  },
  {
    id: 'pp3',
    title: 'Apex Gear V3',
    price: 499,
    rating: 4.8,
    reviewCount: 215,
    category: 'Watches',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKUzgxvQqjNBEQfveEllW8lYvze0UgLePZE6xzrbWSTsL7MTTROyUSHxtJ187VFISb5bAcflG6pvvghzu1m-gc9-ugB0l31qq4G0wOyrsproFIaTBLA3tcMcbJVIUB3i_qbVeKlpqE1OuFp_ogGih2jNLued2xKgRpE36pzA0t6IBnnU1EyvHFBn9oxSk4Nk5q4I0Tgqsg7fdwEpw4NKrZPtOZRizah9JhT38ATCf2xg2VtgTfaj3B-EHxQH8gntDGxe6U3a9XIf8',
  },
  {
    id: 'pp4',
    title: 'Solstice Amber Shades',
    price: 155,
    rating: 4.7,
    reviewCount: 89,
    category: 'Accessories',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBwQgbcTg-ZsdlcfJz1pXCNBjxFuizaRu07-Us5ZZwh9kSFXVUzs09Dvw46hjWB1v5ZgXpCQKeWRzs9rmrjYvlg92oWeDO6I4-ukSEZ2wZeY1Oni5dsoX7XdPQwVm5O99Qq0vnxwzAGbFzXvLm3Txu3JNn7KCQP3_kgT6tvn5r-v319CR5ZurZkjB4cw5zXwNa9LeJft_1Gdis5ebuuOBM7LSf1Tk2IsBf4GXwxw19xV_x3NVxeLUUChgbw557mtJkz7YnuuXcXl1Y',
  },
];


const HomeScreen = ({
  onTabPress,
  onProductPress,
  favoriteIds,
  onToggleFavorite,
  colors = COLORS,
}: HomeScreenProps) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const matchesFilters = (product: { title: string; category: string }) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const filteredNewArrivals = NEW_ARRIVALS.filter(matchesFilters);
  const filteredPopularProducts = POPULAR_PRODUCTS.filter(matchesFilters);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Apex Premium"
        userName="Alex"
        avatarUri="https://lh3.googleusercontent.com/aida-public/AB6AXuA9uu6dLXSE1ar5IzJroX3YaV3d0Vffw0UgLeww5P2MT2e_mQWKWj9sWwmgJ3Hgz5xHY6eMArPYRe0unbPqd1L5Gpxmffa5VvbU8Ca0y_HwIeu4o7pCoPgrMtvKNDO1LZAAKd-v9Sv9EzePW4U4TU3Xf-lTmpuH_N_dMgrs8rnCr3kMvJRTBG4Gcg7JGtCDGlyQLSTnvxCxji6ZB8KPa2bKzntiLNq4Z1E-elKWnio6kyH3jpF9WcUB-wEIlrx2w6sAQOcD4m6Tb6s"
        onBellPress={() => {}}
        colors={colors}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search premium products..."
          onFilterPress={() => {}}
          colors={colors}
        />

        {/* Promo Banner */}
        <View style={styles.banner}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQkfCBXpoUdlENLyYVbiZBmCNwR7cFwU_1DVd1soKXYDNYUf11XHRH-cM1kTjq10CcgC4hUCWRLxTKe_Bz5RShe-KwPF9ZaqL9YPhZR_aDjjgsovN4rzeQQK4aHpbUJBC4j--CB90fl6zroGxmoWN65kmcpGs2nh_5shkonb-OaYK25uhnNOiS1cYBMVXZF6e27Oom93ZEQ0CSBorn3UmcVkODlgM07PeH30lCYCVtD6NxtA4FV4PhwZdSUOmKk2j_taS2OlbloNg',
            }}
            style={styles.bannerImage}
          />
          {/* Flat semi-transparent overlay standing in for the design's gradient */}
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerLabel}>SEASONAL DROP</Text>
            <Text style={styles.bannerTitle}>New Collection</Text>
            <Text style={styles.bannerSubtitle}>
              Get up to <Text style={styles.bannerBold}>30% OFF</Text>
            </Text>
            <Pressable style={[styles.shopNowButton, { backgroundColor: colors.white }]}>
              <Text style={[styles.shopNowText, { color: colors.primary }]}>Shop Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionTitle title="Categories" onViewAllPress={() => {}} colors={colors} />
          <View style={styles.categoryRow}>
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <SectionTitle title="New Arrivals" colors={colors} />
          {filteredNewArrivals.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              No products match your search.
            </Text>
          ) : (
            <View style={styles.grid}>
              {filteredNewArrivals.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ProductCard
                    variant="grid"
                    imageUri={item.imageUri}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    isFavorite={favoriteIds.includes(item.id)}
                    onFavoritePress={() => onToggleFavorite(item.id)}
                    onPress={() => onProductPress(item.id)}
                    colors={colors}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Popular Products (small fixed grid — plain View + map, see Step 4 note) */}
        <View style={styles.section}>
          <SectionTitle title="Popular Products" colors={colors} />
          {filteredPopularProducts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              No products match your search.
            </Text>
          ) : (
            <View style={styles.grid}>
              {filteredPopularProducts.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ProductCard
                    variant="grid"
                    imageUri={item.imageUri}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    reviewCount={item.reviewCount}
                    isFavorite={favoriteIds.includes(item.id)}
                    onFavoritePress={() => onToggleFavorite(item.id)}
                    onPress={() => onProductPress(item.id)}
                    colors={colors}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavBar activeTab="home" onTabPress={onTabPress} cartCount={2} colors={colors} />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  banner: {
    height: 192,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.lg,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(37, 99, 235, 0.55)',
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 4,
  },
  bannerBold: {
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    paddingVertical: SPACING.lg,
  },
  shopNowButton: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    marginTop: SPACING.xl,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.gutter,
  },
  gridItem: {
    width: '47%',
  },
});

export default HomeScreen;