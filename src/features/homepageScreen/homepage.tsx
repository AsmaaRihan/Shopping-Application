import { useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../service/actions/productsAction';
import type { AppDispatch, RootState } from '../../store/store';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenNames, { type RootStackParamList } from '../../rootStack/rootStackType';
import { useTranslation } from 'react-i18next';
import ErrorCard from '../../components/errorCard/errorCard';
import { useDebounce } from '../../hooks/useDebounce';
import Loader from '../../components/loader/loader';
import ProductListItem from '../../components/productItem/productItem';
import NoResultFound from '../../components/NoResultFound/noResultFound';
import { setSearchWord } from '../../service/slice/productSlice/productsSlice';

const HomepageScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const productsData = useSelector((state: RootState) => state.products);

  const { products, isError, isLoading, isFetchingNextPage, pagination } = productsData;

  const query = useSelector((state: RootState) => state.products.query);

  const category = useSelector((state: RootState) => state.products.category);

  const sort = useSelector((state: RootState) => state.products.sort);

  const debouncedQuery = useDebounce(query.trim(), 500);

  const isDebouncing = query.trim() !== debouncedQuery;

  const canLoadMore = useRef(false);

  const fetchProducts = useCallback(
    async (nextPage = 0) => {
      await dispatch(
        getProducts({
          query: debouncedQuery,
          nextPage,
          category,
          sort,
        }),
      );
    },
    [dispatch, debouncedQuery, category, sort],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNextPage = useCallback(() => {
    if (
      !canLoadMore.current ||
      products.length === 0 ||
      isLoading ||
      isFetchingNextPage ||
      isDebouncing ||
      !pagination.hasNextPage
    ) {
      return;
    }

    canLoadMore.current = false;

    fetchProducts(pagination.currentPage + 1);
  }, [fetchProducts, products.length, isLoading, isFetchingNextPage, isDebouncing, pagination]);

  const handleChange = (text: string) => {
    dispatch(setSearchWord(text));
  };

  const onChooseFilterBy = () => navigation.navigate(ScreenNames.ProductsFilter);

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (isError) {
      return (
        <ErrorCard
          refetch={() => fetchProducts(0)}
          title={t('productsError.title')}
          description={t('productsError.description')}
        />
      );
    }

    if (products?.length === 0 && !isLoading) {
      return <NoResultFound />;
    }

    return (
      <FlatList
        style={styles.list}
        data={products}
        contentContainerStyle={styles.listContent}
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
          canLoadMore.current = true;
        }}
        onEndReachedThreshold={0.1}
        onEndReached={handleNextPage}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <Loader size={20} />
            </View>
          ) : undefined
        }
      />
    );
  };

  return (
    <View style={styles.container}>
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

      {renderContent()}
    </View>
  );
};

export default HomepageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
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
