import React, { useCallback, useEffect } from 'react';
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
import QuantitySelector from '../../components/quantitySelector/quantitySelector';
import { useTranslation } from 'react-i18next';
import ErrorCard from '../../components/errorCard/errorCard';
import { getCart, removeFromCart, updateCartQunatity } from '../../service/actions/cartAction';
import Loader from '../../components/loader/loader';

const CartScreen = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const cartData = useSelector((state: RootState) => state.cart);

  const { isError, isLoading, shoppingCart } = cartData;

  const cartItems = shoppingCart?.products ?? [];

  const subtotal = shoppingCart?.total ?? 0;

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5.99;

  const total = subtotal + shipping;

  const formatPrice = (price: number) => `€${price?.toFixed(2)}`;

  const onBack = () => {
    navigation.goBack();
  };

  const fetchCart = useCallback(async () => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (isError) {
      return (
        <ErrorCard
          title={t('cartError.title')}
          description={t('cartError.description')}
          refetch={fetchCart}
        />
      );
    }

    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {cartItems.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>{t('cart.emptyTitle')}</Text>
              <Text style={styles.muted}>{t('cart.emptyDescription')}</Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.product}>
                {item?.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.productImage} />}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.title}</Text>
                  <Text style={styles.price}>{formatPrice(item.price)}</Text>

                  <QuantitySelector
                    quantity={item.quantity}
                    min={0}
                    onChange={(nextQuantity) =>
                      dispatch(
                        updateCartQunatity({
                          id: item.id,
                          quantity: nextQuantity,
                        }),
                      )
                    }
                  />
                </View>

                <TouchableOpacity
                  testID={`remove-cart-item-${item.id}`}
                  onPress={() => dispatch(removeFromCart(item.id))}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={styles.summary}>
            <View style={styles.summaryHeader}>
              <Text style={styles.sectionTitle}>{t('cart.orderSummary')}</Text>
              <Text style={styles.count}>{cartItems.length} items</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.muted}>{t('cart.subtotal')}</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.muted}>{t('cart.shipping')}</Text>
              <Text style={styles.free}>{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{t('cart.total')}</Text>
              <Text style={styles.totalPrice}>{formatPrice(total)}</Text>
            </View>
          </View>

          <View style={styles.delivery}>
            <Text style={styles.deliveryIcon}>🚚</Text>
            <Text style={styles.deliveryText}>{t('cart.deliveryMessage')}</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>{t('cart.totalAmount')}</Text>
            <Text style={styles.footerPrice}>{formatPrice(total)}</Text>
          </View>

          <TouchableOpacity
            testID="cart-checkout-button"
            style={[styles.checkoutButton, cartItems.length === 0 && styles.disabledButton]}
            disabled={cartItems.length === 0}
            onPress={() => Alert.alert(t('cart.checkoutTitle'), t('cart.checkoutMessage'))}
          >
            <Text style={styles.checkoutText}>{t('cart.checkout')}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity testID="cart-back-button" onPress={onBack}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cart.title')}</Text>
      </View>
      {renderContent()}
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
    color: Colors.text,
    marginLeft: 10,
  },
  count: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  product: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 110,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 9,
    color: Colors.text,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  deleteText: {
    color: Colors.textSecondary,
    fontSize: 17,
  },
  summary: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 18,
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  muted: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.text,
    fontWeight: '600',
  },
  free: {
    color: Colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.text,
  },
  delivery: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  deliveryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  deliveryText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  footerPrice: {
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
    color: Colors.text,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 17,
    borderRadius: 12,
  },
  checkoutText: {
    color: Colors.textTeritary,
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
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
});
