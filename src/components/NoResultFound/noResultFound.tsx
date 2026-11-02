import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resetFilter } from '../../service/slice/productSlice/productsSlice';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store/store';

const NoResultFound = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>

      <Text style={styles.emptyTitle}>No products found</Text>

      <Text style={styles.emptyDescription}>
        We couldn't find any products matching your search. Try a different
        keyword or adjust your filters.
      </Text>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => dispatch(resetFilter())}
      >
        <Text> Reset Your Filter</Text>
      </TouchableOpacity>
    </View>
  );
};
export default NoResultFound;
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 21,
  },
  resetButton: { paddingTop: 20 },
});
