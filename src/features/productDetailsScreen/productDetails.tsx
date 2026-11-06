import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuantitySelector from '../../components/quantitySelector/quantitySelector';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProductDetails } from '../../service/actions/productsAction';
import Loader from '../../components/loader/loader';
import Colors from '../../theme/colors';
import { addToCart, updateCart } from '../../service/actions/cartActions';
import AddToCartModal from '../../components/addToCartModel/addToCartModal';

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
  const productData = useSelector((state: RootState) => state.productDetails);
  const shoppingCart = useSelector((state: RootState) => state.cart.shoppingCart);
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

  const availableStock = product?.stock ?? 0;

  const handleAddToCart = async () => {
    if (isCartLoading || shoppingCart === null) {
      return;
    }

    if (availableStock < 1 || quantity > availableStock) {
      Alert.alert('Out of stock', 'Please select another option.');
      return;
    }
    const cartProducts = shoppingCart?.products ?? [];
    const updatedProducts = [
      ...cartProducts
        .filter((cartProduct) => cartProduct.id !== productId)
        .map((cartProduct) => ({ id: cartProduct.id, quantity: cartProduct.quantity })),
      { id: productId, quantity },
    ];

    try {
      if (cartProducts.length === 0) {
        await dispatch(addToCart([{ id: productId, quantity }])).unwrap();
      } else {
        await dispatch(updateCart(updatedProducts)).unwrap();
      }
      setShowCartActions(true);
    } catch {
      Alert.alert('Unable to update cart', 'Please try again.');
    }
  };

  const toggleModal = () => setShowCartActions(!showCartActions);

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
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="contain" />

        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>

          <Text style={styles.rating}>⭐ {product.rating} / 5</Text>

          <Text style={styles.price}>${product.price}</Text>

          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Select size and color</Text>

          <Text style={styles.sectionTitle}>Quantity</Text>

          <QuantitySelector quantity={quantity} max={availableStock} onChange={setQuantity} />

          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} disabled={availableStock <= 0}>
            <Text style={styles.addButtonText}>{availableStock <= 0 ? 'Out of stock' : 'Add to Cart'}</Text>
          </TouchableOpacity>
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
