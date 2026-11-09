import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../service/actions/productsAction';
import type { AppDispatch, RootState } from '../../store/store';
import Colors from '../../theme/colors';
import ProductListItem from '../../components/productItem/productItem';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenNames, { type RootStackParamList } from '../../rootStack/rootStackType';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/loader/loader';
import ErrorCard from '../../components/errorCard/errorCard';

const HomepageScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const productsData = useSelector((state: RootState) => state.products);

  const { isError, isLoading, products, isFetchingNextPage } = productsData;

  const [query, setQuery] = useState('');

  const hasUserScrolledRef = useRef(false);

  const fetchProducts = useCallback(
    async (nextPage = 0) => {
      await dispatch(getProducts(nextPage));
    },
    [dispatch],
  );

  useEffect(() => {
    fetchProducts(0);
  }, [fetchProducts]);

  const handleNextPage = useCallback(() => {
    const { currentPage, hasNextPage } = productsData.pagination;

    if (!hasUserScrolledRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchProducts(currentPage + 1);
  }, [fetchProducts, isFetchingNextPage, productsData.pagination]);

  const handleChange = (text: string) => {
    setQuery(text);
  };
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <ErrorCard
        refetch={fetchProducts}
        title={t('productsError.title')}
        description={t('productsError.description')}
      />
    );
  }

  // if (products.filteredProducts?.length === 0 && !isLoading) {
  //   return <NoResultFound />;
  // }

  const onChooseFilterBy = () => navigation.navigate(ScreenNames.ProductsFilter);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.filterMenuContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('home.searchProducts')}
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={handleChange}
            returnKeyType="search"
          />
          <TouchableOpacity testID="filter_by_button" style={styles.filterButton} onPress={onChooseFilterBy}>
            <Text style={styles.filterText}> {t('home.filter')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductListItem
            item={item}
            onPress={() =>
              navigation.navigate(ScreenNames.ProductsDetails, {
                productId: item.id,
              })
            }
          />
        )}
        onScrollBeginDrag={() => {
          hasUserScrolledRef.current = true;
        }}
        onEndReachedThreshold={0.5}
        onEndReached={handleNextPage}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <Loader size={20} />
            </View>
          ) : undefined
        }
      />
    </View>
  );
};

export default HomepageScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterMenuContainer: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  filterText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  searchInput: {
    flex: 5,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },

  footerLoader: {
    paddingVertical: 25,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
