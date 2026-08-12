import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import AppTabNavigator from './AppTabNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { ColorScheme } from '../constants/theme';
import { NEW_ARRIVALS, POPULAR_PRODUCTS } from '../screens/HomeScreen';
import { PRODUCTS } from '../screens/ProductListScreen';
import { UserProfile } from '../services/auth';
import { useCart } from '../context/CartContext';
import { deleteSecureItem } from '../services/storage/secureStore';

const ALL_PRODUCTS = [...NEW_ARRIVALS, ...POPULAR_PRODUCTS, ...PRODUCTS];

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userProfile: UserProfile | null;
  setUserProfile: (user: UserProfile | null) => void;
  colors: ColorScheme;
}

const RootNavigator = ({
  favoriteIds,
  onToggleFavorite,
  isDarkMode,
  onToggleDarkMode,
  userProfile,
  setUserProfile,
  colors,
}: RootNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash">
        {(props) => (
          <SplashScreen
            {...props}
            onFinish={() => props.navigation.replace('Login')}
            colors={colors}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onLoginSuccess={(user) => {
              setUserProfile(user);
              props.navigation.replace('MainTabs');
            }}
            onSignUpPress={() => props.navigation.navigate('Signup')}
            colors={colors}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Signup">
        {(props) => <SignupScreen {...props} colors={colors} />}
      </Stack.Screen>

      <Stack.Screen name="ForgotPassword">
        {(props) => <ForgotPasswordScreen {...props} colors={colors} />}
      </Stack.Screen>

      <Stack.Screen name="OTPVerification">
        {(props) => <OTPVerificationScreen {...props} colors={colors} />}
      </Stack.Screen>

      <Stack.Screen name="MainTabs">
        {(props) => (
          <AppTabNavigator
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onProductPress={(id) => props.navigation.navigate('ProductDetails', { productId: id })}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogoutPress={async () => {
              await deleteSecureItem('auth_access_token');
              setUserProfile(null);
              props.navigation.replace('Login');
            }}
            userProfile={userProfile}
            colors={colors}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductDetails">
        {(props) => {
          const productId = props.route.params?.productId;
          const tappedProduct = ALL_PRODUCTS.find((item) => item.id === productId);
          const productDetails = tappedProduct
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

          const { addToCart } = useCart();

          return (
            <ProductDetailsScreen
              {...props}
              product={productDetails}
              onBackPress={() => props.navigation.goBack()}
              isFavorite={productId ? favoriteIds.includes(productId) : false}
              onToggleFavorite={() => {
                if (productId) {
                  onToggleFavorite(productId);
                }
              }}
              onAddToCart={() => {
                if (tappedProduct) {
                  addToCart({
                    id: tappedProduct.id,
                    title: tappedProduct.title,
                    price: tappedProduct.price,
                    imageUri: tappedProduct.imageUri,
                  });
                }
              }}
              colors={colors}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="Notifications">
        {(props) => <NotificationsScreen {...props} colors={colors} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default RootNavigator;
