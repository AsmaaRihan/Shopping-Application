import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../../service/actions/cartActions';
import { formatShoppingCart } from './utils';
import QuantitySelector from '../../components/quantitySelector/quantitySelector';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const shoppingCart = useSelector((state: RootState) => state.cart.shoppingCart);

  const fromatedShoppingItems = shoppingCart ? formatShoppingCart(shoppingCart) : [];
  const [items, setItems] = useState(fromatedShoppingItems);
  const [isUpdating, setIsUpdating] = useState(false);

  const syncCart = async (nextItems: typeof items) => {
    setItems(nextItems);
    setIsUpdating(true);

    try {
      await dispatch(
        updateCart(nextItems.map((item) => ({ id: item.id, quantity: item.quantity }))),
      ).unwrap();
    } catch {
      Alert.alert('Unable to update cart', 'Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateQuantity = (id: number, amount: number) => {
    const nextItems = items
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
      .filter((item) => item.quantity > 0);

    syncCart(nextItems);
  };

  const removeItem = (id: number) => {
    syncCart(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5.99;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;

  const onBack = () => {
    if (isUpdating) {
      return;
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} disabled={isUpdating}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.count}>{items.length} items</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.muted}>Add some products to get started.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.product}>
              <Image source={{ uri: item.image }} style={styles.productImage} />

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.variant}>{item.variant}</Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>

                <QuantitySelector
                  quantity={item.quantity}
                  min={0}
                  onChange={(nextQuantity) => updateQuantity(item.id, nextQuantity - item.quantity)}
                />
              </View>

              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.muted}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.muted}>Shipping</Text>
            <Text style={styles.free}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{formatPrice(total)}</Text>
          </View>
        </View>

        <View style={styles.delivery}>
          <Text style={styles.deliveryIcon}>🚚</Text>
          <Text style={styles.deliveryText}>Free delivery on orders over €100</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, items.length === 0 && styles.disabledButton]}
          disabled={items.length === 0}
          onPress={() => Alert.alert('Checkout', 'Proceeding to checkout!')}
        >
          <Text style={styles.checkoutText}>Checkout →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  back: {
    fontSize: 32,
    color: Colors.black,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  count: {
    fontSize: 13,
    color: '#777',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  product: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#EEE',
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  variant: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 9,
    color: '#222',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  deleteText: {
    color: '#999',
    fontSize: 17,
  },
  summary: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 18,
    color: '#222',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  muted: {
    color: '#888',
    fontSize: 14,
  },
  summaryValue: {
    color: '#222',
    fontWeight: '600',
  },
  free: {
    color: '#20A56B',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: '#222',
  },
  delivery: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF8F0',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  deliveryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  deliveryText: {
    color: '#23875A',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    color: '#888',
    fontSize: 12,
  },
  footerPrice: {
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
    color: '#222',
  },
  checkoutButton: {
    backgroundColor: '#242424',
    paddingHorizontal: 28,
    paddingVertical: 17,
    borderRadius: 12,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 55,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 15,
  },
});
