import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsCategories, getSortedProducts } from '../../service/actions/productsAction';
import type { AppDispatch, RootState } from '../../store/store';
import Colors from '../../theme/colors';
import { filterByCategory, resetFilter } from '../../service/slice/productSlice/productsSlice';
import { useNavigation } from '@react-navigation/native';
import RadioButtons from '../../components/radioButton/radioButton';
import { FilterOptions, sortMap, sortOptions } from './filters.types';
import Loader from '../../components/loader/loader';
import { useTranslation } from 'react-i18next';

const ProductFilter = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const categories = useSelector((state: RootState) => state.products);

  const [selectedCategory, setSelectedCategory] = useState(categories.category);

  const [selectedSortBy, setSelectedSortBy] = useState('');

  const [activeTab, setActiveTab] = useState<FilterOptions>('category');

  useEffect(() => {
    dispatch(getProductsCategories());
  }, [dispatch]);

  const renderOptionView = () => {
    if (activeTab === 'category') {
      return (
        <RadioButtons
          options={categories.categories}
          selectedOption={selectedCategory}
          setSelectedOption={setSelectedCategory}
        />
      );
    }

    if (activeTab === 'sort') {
      return (
        <RadioButtons
          options={sortOptions}
          selectedOption={selectedSortBy}
          setSelectedOption={setSelectedSortBy}
        />
      );
    }
  };

  if (categories.isCategoriesLoading) {
    return <Loader />;
  }

  const onSelectResetFilter = () => {
    dispatch(resetFilter());
    navigation.goBack();
  };

  const handleApplySort = () => {
    const sort = sortMap[selectedSortBy];
    if (!sort) {
      return;
    }

    dispatch(getSortedProducts(`sortBy=${sort.sortBy}&order=${sort.order}`));
  };

  const onSelectApplyFilter = () => {
    if (activeTab === 'category') {
      dispatch(filterByCategory(selectedCategory));
    } else {
      handleApplySort();
    }
    navigation.goBack();
  };

  const onSelectCategory = () => {
    setActiveTab('category');
  };

  const onSelectSortBy = () => {
    setActiveTab('sort');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.filterText}>{t('filter.title')}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          testID="select_category_filter_button"
          style={styles.buttonStyle}
          onPress={onSelectCategory}
        >
          <Text style={styles.buttonText}>{t('common.category')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="select_sort_filter_button"
          style={styles.buttonStyle}
          onPress={onSelectSortBy}
        >
          <Text style={styles.buttonText}>{t('common.sortBy')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.filterContainer}>
        {renderOptionView()}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.buttonStyle, styles.resetButton]} onPress={onSelectResetFilter}>
            <Text style={[styles.buttonText, styles.resetbuttonText]}>{t('common.reset')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="apply_filter_button"
            style={[styles.buttonStyle, styles.primaryButton]}
            onPress={onSelectApplyFilter}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>{t('common.applyFilter')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    margin: 10,
    padding: 8,
  },
  filterText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '600',
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonStyle: {
    margin: 5,
    padding: 15,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetbuttonText: {
    color: Colors.textTeritary,
  },
  resetButton: { backgroundColor: Colors.black },
  primaryButton: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  primaryButtonText: { color: Colors.textTeritary },
});
