import React, { useState, useEffect } from 'react';
import { StatusBar, Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './src/context/NotificationContext';
import { CartProvider } from './src/context/CartContext';
import RootNavigator from './src/navigation/RootNavigator';
import { getColors } from './src/constants/theme';
import { UserProfile } from './src/services/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => Appearance.getColorScheme() === 'dark');
  const [hasManualOverride, setHasManualOverride] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!hasManualOverride) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, [hasManualOverride]);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prevIds) =>
      prevIds.includes(productId)
        ? prevIds.filter((id) => id !== productId)
        : [...prevIds, productId]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    setHasManualOverride(true);
  };

  const colors = getColors(isDarkMode);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <NotificationProvider>
              <NavigationContainer>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <RootNavigator
                  favoriteIds={favoriteIds}
                  onToggleFavorite={toggleFavorite}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={toggleDarkMode}
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                  colors={colors}
                />
              </NavigationContainer>
            </NotificationProvider>
          </CartProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;