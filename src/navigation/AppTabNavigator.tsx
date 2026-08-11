import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomNavBar, { NavTab } from '../components/BottomNavBar';
import { ColorScheme } from '../constants/theme';
import { UserProfile } from '../services/auth';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator<AppTabParamList>();

interface AppTabNavigatorProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onProductPress: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogoutPress: () => void;
  userProfile: UserProfile | null;
  colors: ColorScheme;
}

const tabRouteMapping: Record<NavTab, keyof AppTabParamList> = {
  home: 'Home',
  categories: 'Categories',
  cart: 'Cart',
  wishlist: 'Wishlist',
  profile: 'Profile',
};

const AppTabNavigator = ({
  favoriteIds,
  onToggleFavorite,
  onProductPress,
  isDarkMode,
  onToggleDarkMode,
  onLogoutPress,
  userProfile,
  colors,
}: AppTabNavigatorProps) => {
  const { cartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const activeRouteName = props.state.routeNames[props.state.index] as keyof AppTabParamList;
        // Find key in tabRouteMapping matching activeRouteName
        const activeTabKey = (Object.keys(tabRouteMapping) as NavTab[]).find(
          (key) => tabRouteMapping[key] === activeRouteName
        ) || 'home';

        return (
          <BottomNavBar
            activeTab={activeTabKey}
            onTabPress={(tabKey) => {
              const targetRouteName = tabRouteMapping[tabKey];
              props.navigation.navigate(targetRouteName);
            }}
            cartCount={cartCount}
            wishlistCount={wishlistItemsCount(favoriteIds)}
            colors={colors}
          />
        );
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen
            {...props}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onProductPress={onProductPress}
            userProfile={userProfile}
            onProfilePress={() => props.navigation.navigate('Profile')}
            colors={colors}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Categories">
        {(props) => (
          <ProductListScreen
            {...props}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onProductPress={onProductPress}
            colors={colors}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Cart">
        {(props) => <CartScreen {...props} colors={colors} />}
      </Tab.Screen>
      <Tab.Screen name="Wishlist">
        {(props) => (
          <WishlistScreen
            {...props}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onProductPress={onProductPress}
            colors={colors}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
            {...props}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogoutPress={onLogoutPress}
            userProfile={userProfile}
            colors={colors}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Simple helper to show favorites count or similar on tabs for demo
function wishlistItemsCount(favoriteIds: string[]) {
  return favoriteIds.length;
}

export default AppTabNavigator;
