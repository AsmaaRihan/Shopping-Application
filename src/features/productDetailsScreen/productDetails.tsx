import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QuantitySelector from '../../components/quantitySelector/quantitySelector';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProductDetails } from '../../service/actions/productsAction';
import Loader from '../../components/loader/loader';
import Colors from '../../theme/colors';
import AddToCartModal from '../../components/addToCartModel/addToCartModal';
import ErrorCard from '../../components/errorCard/errorCard';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../service/actions/cartAction';

type ProductDetailsProps = {
  route: {
    params: {
      productId: number;
    };
  };
};

const ProductDetails = ({ route }: ProductDetailsProps) => {
  const { productId } = route.params;

  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const productData = useSelector((state: RootState) => state.productDetails);

  const isCartError = useSelector((state: RootState) => state.cart.isError);

  const isCartLoading = useSelector((state: RootState) => state.cart.isLoading);

  const { isError, isLoading, productDetails: product } = productData;

  const fetchProductDetails = useCallback(
    async () => dispatch(getProductDetails(productId)),
    [dispatch, productId],
  );

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const [quantity, setQuantity] = useState(1);

  const [showCartActions, setShowCartActions] = useState(false);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const availableStock = product?.stock ?? 0;

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;

    if (availableStock < 1 || quantity > availableStock) {
      Alert.alert(t('product.outOfStock'), t('product.outOfStockMessage'));

      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        quantity,
      }),
    );

    setIsAddingToCart(true);
  };

  useEffect(() => {
    if (!isAddingToCart || isCartLoading) return;

    setIsAddingToCart(false);

    if (!isCartError) {
      setShowCartActions(true);
    }
  }, [isAddingToCart, isCartLoading, isCartError]);

  const toggleModal = () => setShowCartActions((previous) => !previous);

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !product) {
    return (
      <ErrorCard
        title={t('product.loadError')}
        description={t('common.tryAgain')}
        refetch={fetchProductDetails}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="contain" />

        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>

          {/* <Text style={styles.rating}>⭐ {product.rating} / 5</Text> */}

          <Text style={styles.price}>${product.price}</Text>

          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>{t('product.selectSizeColor')}</Text>

          <Text style={styles.sectionTitle}>{t('product.quantity')}</Text>

          <QuantitySelector quantity={quantity} max={availableStock} onChange={setQuantity} />

          <TouchableOpacity
            testID="add-to-cart-button"
            style={[styles.addButton, (availableStock <= 0 || isAddingToCart) && styles.disabledButton]}
            onPress={handleAddToCart}
            disabled={availableStock <= 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator testID="add-to-cart-loader" color={Colors.textTeritary} />
            ) : (
              <Text style={styles.addButtonText}>
                {availableStock <= 0 ? t('product.outOfStock') : t('product.addToCart')}
              </Text>
            )}
          </TouchableOpacity>

          {isCartError ? (
            <Text testID="cart-add-error" style={styles.cartAddError}>
              {t('product.addToCartError')}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <AddToCartModal isVisible={showCartActions} toggleModal={toggleModal} />
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    height: 300,
    width: '100%',
    backgroundColor: Colors.surface,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  rating: {
    marginTop: 10,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.textSecondary,
  },

  addButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: Colors.textTeritary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartAddError: {
    color: Colors.error,
    marginTop: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 25,
  },
});
