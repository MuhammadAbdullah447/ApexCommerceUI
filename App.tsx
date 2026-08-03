import React, { useState, useEffect } from 'react';
import { StatusBar, Alert, Appearance} from 'react-native';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen, { NEW_ARRIVALS, POPULAR_PRODUCTS } from './src/screens/HomeScreen';
import ProductListScreen, { PRODUCTS } from './src/screens/ProductListScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { NavTab } from './src/components/BottomNavBar';
import { getColors } from './src/constants/theme';


type Screen = 'splash' | 'login' | 'home' | 'productList' | 'productDetails' | 'profile';


const ALL_PRODUCTS = [...NEW_ARRIVALS, ...POPULAR_PRODUCTS, ...PRODUCTS];

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(() => Appearance.getColorScheme() === 'dark');

  const [hasManualOverride, setHasManualOverride] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!hasManualOverride) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, [hasManualOverride]);

  
  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleTabPress = (tab: NavTab) => {
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'categories') {
      setCurrentScreen('productList');
    } else if (tab === 'profile') {
      setCurrentScreen('profile');
    }
    
  };

  const handleProductPress = (productId: string) => {
    setPreviousScreen(currentScreen === 'productDetails' ? previousScreen : currentScreen);
    setSelectedProductId(productId);
    setCurrentScreen('productDetails');
  };

  const handleBackFromDetails = () => {
    setCurrentScreen(previousScreen);
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const handleAddToCart = () => {
    Alert.alert('Added to Cart', `${selectedProductDetails?.title ?? 'Item'} was added to your cart.`);
  };

  const handleBuyNow = () => {
    Alert.alert('Proceeding to Checkout', `Buying ${selectedProductDetails?.title ?? 'this item'} now.`);
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prevIds) =>
      prevIds.includes(productId)
        ? prevIds.filter((id) => id !== productId)
        : [...prevIds, productId],
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    setHasManualOverride(true);
  };

 
  const tappedProduct = ALL_PRODUCTS.find((item) => item.id === selectedProductId);

  const selectedProductDetails = tappedProduct
    ? {
        id: tappedProduct.id,
        category: 'PERFORMANCE SERIES',
        title: tappedProduct.title,
        price: tappedProduct.price,
        rating: tappedProduct.rating,
        reviewCount: 1248,
        description:
          'Engineered for elite marathoners and daily commuters alike, this piece redefines high-performance quality. Featuring premium materials and thoughtful construction, it delivers comfort and durability for everyday use.',
        images: [tappedProduct.imageUri],
      }
    : undefined;

    const colors = getColors(isDarkMode);

  
  return (
    <>
      <StatusBar barStyle="dark-content" />

      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} colors={colors} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSignUpPress={() => {}}
          colors={colors}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onTabPress={handleTabPress}
          onProductPress={handleProductPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          colors={colors}
        />
      )}

      {currentScreen === 'productList' && (
        <ProductListScreen
          onTabPress={handleTabPress}
          onProductPress={handleProductPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          colors={colors}
        />
      )}

      {currentScreen === 'productDetails' && (
        <ProductDetailsScreen
          product={selectedProductDetails}
          onBackPress={handleBackFromDetails}
          onSharePress={() => {}}
          onBellPress={() => {}}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onRelatedProductPress={handleProductPress}
          isFavorite={selectedProductId ? favoriteIds.includes(selectedProductId) : false}
          onToggleFavorite={() => selectedProductId && toggleFavorite(selectedProductId)}
          colors={colors}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onTabPress={handleTabPress}
          onLogoutPress={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          colors={colors}
        />
      )}
    </>
  );
};

export default App;