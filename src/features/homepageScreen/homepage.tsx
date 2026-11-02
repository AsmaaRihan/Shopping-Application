import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProducts,
  getProductsBySearch,
} from '../../service/actions/productsAction';
import type { AppDispatch, RootState } from '../../store/store';
import Colors from '../../theme/colors';
import ProductListItem from '../../components/productItem/productItem';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenNames, {
  type RootStackParamList,
} from '../../rootStack/rootStackType';
import NoResultFound from '../../components/NoResultFound/noResultFound';

const HomepageScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products);

  const [query, setQuery] = useState('');
  const isFetchingNextPage = useRef(false);

  useEffect(() => {
    if (_.isEmpty(query.trim())) {
      dispatch(getProducts(0));
    } else {
      dispatch(getProductsBySearch(query));
    }
  }, [dispatch, query]);

  const debouncedSearch = useMemo(
    () =>
      _.debounce((text: string) => {
        setQuery(text);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleNextPage = useCallback(() => {
    const { skip, limit, total } = products.productsData;
    const nextSkip = skip + limit;

    // A ref is needed: `isLoading` is stale until the next render.
    if (isFetchingNextPage.current || query.trim() || products.category) return;
    if (nextSkip >= total) return;

    isFetchingNextPage.current = true;
    dispatch(getProducts(nextSkip)).finally(() => {
      isFetchingNextPage.current = false;
    });
  }, [dispatch, products.productsData, products.category, query]);

  if (products.filteredProducts?.length === 0 && !products.isLoading) {
    return <NoResultFound />;
  }

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.filterMenuContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={handleChange}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate(ScreenNames.ProductsFilter)}
          >
            <Text style={styles.filterText}> Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products.filteredProducts ?? products.productsData.products}
        numColumns={2}
        keyExtractor={item => item?.title}
        key={'products_flat_list'}
        style={styles.flatListStyle}
        renderItem={({ item }) => {
          return (
            <ProductListItem
              key={item?.title}
              item={item}
              onPress={() =>
                navigation.navigate(ScreenNames.ProductsDetails, {
                  productId: item?.id,
                })
              }
            />
          );
        }}
        refreshing={products.isLoading}
        onRefresh={() => console.warn('Refreshing...')}
        onEndReachedThreshold={0.5}
        onEndReached={handleNextPage}
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
  filterMenu: {
    position: 'absolute',
    top: 42,
    right: 0,
    minWidth: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  filterOption: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  filterOptionText: {
    color: Colors.text,
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 18,
    color: Colors.text,
  },

  flatListStyle: {
    alignContent: 'stretch',
    padding: 10,
    paddingBottom: 30,
    marginBottom: 10,
  },
});
