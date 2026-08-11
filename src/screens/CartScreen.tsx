import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '../navigation/types';
import { useCart, CartItem } from '../context/CartContext';

type CartScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Cart'>;

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
  colors?: ColorScheme;
}

const CartScreen = ({ navigation, colors = COLORS }: CartScreenProps) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const insets = useSafeAreaInsets();

  const handleCheckout = () => {
    setToastMessage('Order placed successfully!');
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={[styles.itemCard, { backgroundColor: colors.surfaceContainerLowest }]}>
        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        
        <View style={styles.itemDetails}>
          <Text style={[styles.itemTitle, { color: colors.onSurface }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
          
          <View style={styles.quantityContainer}>
            <Pressable
              style={[styles.qtyButton, { backgroundColor: colors.surfaceContainerLow }]}
              onPress={() => updateQuantity(item.id, -1)}
            >
              <Icon name="remove" size={16} color={colors.onSurface} />
            </Pressable>
            
            <Text style={[styles.qtyText, { color: colors.onSurface }]}>
              {item.quantity}
            </Text>
            
            <Pressable
              style={[styles.qtyButton, { backgroundColor: colors.surfaceContainerLow }]}
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Icon name="add" size={16} color={colors.onSurface} />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            removeFromCart(item.id);
            setToastMessage(`${item.title} removed from cart`);
          }}
        >
          <Icon name="delete-outline" size={24} color={colors.error} />
        </Pressable>
      </View>
    );
  };

  const shipping = cartItems.length > 0 ? 15 : 0;
  const tax = cartItems.reduce((sum, item) => sum + item.price * 0.08 * item.quantity, 0);
  const total = cartTotal + shipping + tax;

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Shopping Cart" colors={colors} />
      
      {cartItems.length === 0 ? (
        <View style={styles.content}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceContainerLow }]}>
            <Icon name="shopping-cart" size={64} color={colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: colors.onSurface }]}>Your Cart is Empty</Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Looks like you haven't added anything to your cart yet. Explore our premium collections to find something special.
          </Text>
          
          <Button 
            label="Start Shopping" 
            onPress={() => navigation.navigate('Categories')} 
            variant="primary" 
            colors={colors}
            style={styles.button}
          />
        </View>
      ) : (
        <View style={styles.flexContainer}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 220 }
            ]}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
          />

          <View
            style={[
              styles.summaryContainer,
              {
                backgroundColor: colors.surfaceContainerLowest,
                borderTopColor: colors.outlineVariant,
                paddingBottom: insets.bottom > 0 ? insets.bottom : SPACING.md,
              },
            ]}
          >
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.onSurface }]}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: colors.onSurface }]}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>Estimated Tax (8%)</Text>
              <Text style={[styles.summaryValue, { color: colors.onSurface }]}>${tax.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.onSurface }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
            </View>

            <Button
              label="Proceed to Checkout"
              onPress={handleCheckout}
              variant="primary"
              colors={colors}
              style={styles.checkoutButton}
            />
          </View>
        </View>
      )}

      <Toast
        visible={!!toastMessage}
        message={toastMessage}
        onDismiss={() => setToastMessage('')}
        colors={colors}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    position: 'relative',
  },
  content: {
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
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
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
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 16,
    textAlign: 'center',
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutButton: {
    width: '100%',
  },
});

export default CartScreen;
