import {
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
import { addToCart } from '../../service/actions/cartActions';
import ScreenNames, {
  type RootStackParamList,
} from '../../rootStack/rootStackType';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const productData = useSelector((state: RootState) => state.productDetails);
  const cart = useSelector((state: RootState) => state.cart.shoppingCart);

  const { isError, isLoading, productDetails: product } = productData;

  const fetchProductDetails = useCallback(
    async () => dispatch(getProductDetails(productId)),
    [dispatch, productId],
  );

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const [quantity, setQuantity] = useState(1);

  const availableStock = product?.stock ?? 0;
  const cartItemCount = cart?.totalQuantity ?? 0;

  const handleAddToCart = () => {
    if (availableStock < 1 || quantity > availableStock) {
      Alert.alert('Out of stock', 'Please select another option.');
      return;
    }
    dispatch(addToCart([{ id: product?.id ?? 0, quantity }]));
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text>Unable to load product.</Text>
        <TouchableOpacity onPress={() => fetchProductDetails()}>
          <Text>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate(ScreenNames.Cart)}
          accessibilityLabel="Open cart"
        >
          <Text style={styles.cartButtonText}>Cart</Text>
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>

        <Text style={styles.rating}>⭐ {product.rating} / 5</Text>

        <Text style={styles.price}>${product.price}</Text>

        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.sectionTitle}>Select size and color</Text>

        <Text style={styles.sectionTitle}>Quantity</Text>

        <QuantitySelector
          quantity={quantity}
          max={availableStock}
          onChange={setQuantity}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToCart}
          disabled={availableStock <= 0}
        >
          <Text style={styles.addButtonText}>
            {availableStock <= 0 ? 'Out of stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
  banner: {
    position: 'relative',
  },
  cartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.black,
  },
  cartButtonText: {
    color: Colors.textTeritary,
    fontWeight: '700',
  },
  cartBadge: {
    minWidth: 22,
    height: 22,
    marginLeft: 8,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  cartBadgeText: {
    color: Colors.textTeritary,
    fontSize: 12,
    fontWeight: '700',
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
    color: '#777',
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#555',
  },
  stock: {
    marginTop: 15,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quantity: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: Colors.black,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.textTeritary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 25,
  },
});
