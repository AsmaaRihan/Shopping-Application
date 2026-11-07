import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductItem } from '../../service/slice/productSlice/product.types';
import Colors from '../../theme/colors';

const ProductListItem = ({ item, onPress }: { item: ProductItem; onPress: () => void }) => {
  return (
    <TouchableOpacity testID="product_Item_button" style={styles.button} onPress={onPress}>
      <View style={styles.cardView}>
        <Image style={styles.categoryImage} source={{ uri: item?.images?.[0] }} resizeMode="contain" />
        <Text style={styles.cardTextStyle}>{item.title}</Text>
        <Text style={styles.cardTextStyle}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: Colors.background,
    shadowColor: Colors.textSecondary,
    padding: 20,
    flex: 1,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTextStyle: { fontSize: 16, fontFamily: 'bold', textAlign: 'center' },
  categoryImage: { width: '100%', height: 80 },
  button: { flex: 1 },
});
