import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import ProductFilter from './productFilter';
import { filterByCategory } from '../../service/slice/productSlice/productsSlice';

const mockGoBack = jest.fn();

const mockDispatch = jest.fn();

let mockProducts = {
  categories: ['Beauty'],
  category: '',
  isCategoriesLoading: false,
  isCategoriesError: false,
};

const mockReact = React;

const mockText = Text;

const mockView = View;

const mockTouchableOpacity = TouchableOpacity;

jest.mock('../../components/radioButton/radioButton', () => {
  return ({
    options,
    selectedOption,
    setSelectedOption,
  }: {
    options: string[];
    selectedOption: string;
    setSelectedOption: (value: string) => void;
  }) =>
    mockReact.createElement(
      mockView,
      { testID: 'radioButtons' },
      options.map((option) =>
        mockReact.createElement(
          mockTouchableOpacity,
          {
            key: option,
            testID: `radioOption-${option}`,
            onPress: () => setSelectedOption(option),
          },
          mockReact.createElement(mockText, null, selectedOption === option ? `${option} selected` : option),
        ),
      ),
    );
});

jest.mock('../../service/actions/categoriesApi', () => ({
  getCategories: jest.fn(() => 'getCategories'),
}));

jest.mock('../../service/slice/productSlice/productsSlice', () => ({
  filterByCategory: jest.fn(() => 'filterByCategory'),
  sortBy: jest.fn(() => 'sortBy'),
  resetFilter: jest.fn(() => 'resetFilter'),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      products: mockProducts,
      categories: {
        categories: mockProducts.categories,
        isLoading: mockProducts.isCategoriesLoading,
        isError: mockProducts.isCategoriesError,
      },
    }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'filter.title': 'Filter Products',
        'common.category': 'Category',
        'common.sortBy': 'Sort by',
        'common.reset': 'Reset',
        'common.applyFilter': 'Apply Filter',
      }[key] ?? key),
  }),
}));

describe('ProductFilterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockProducts = {
      categories: ['Beauty'],
      category: '',
      isCategoriesLoading: false,
      isCategoriesError: false,
    };
  });

  it('renders the loader while the categories are loading', async () => {
    mockProducts = { ...mockProducts, isCategoriesLoading: true };

    const { getByTestId, queryByTestId } = await render(<ProductFilter />);

    expect(getByTestId('loader')).toBeTruthy();
    expect(queryByTestId('select_category_filter_button')).toBeNull();
  });

  it('renders filter actions and resets the filter', async () => {
    const { getByText } = await render(<ProductFilter />);

    expect(getByText('Filter Products')).toBeTruthy();
    expect(getByText('Category')).toBeTruthy();
    expect(getByText('Apply Filter')).toBeTruthy();

    await fireEvent.press(getByText('Reset'));

    expect(mockDispatch).toHaveBeenCalledWith('resetFilter');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should handle apply category filter', async () => {
    const { getByTestId } = await render(<ProductFilter />);

    const categoryByBtn = getByTestId('select_category_filter_button');

    await fireEvent.press(categoryByBtn);

    await fireEvent.press(getByTestId('radioOption-Beauty'));

    await fireEvent.press(getByTestId('apply_filter_button'));

    expect(filterByCategory).toHaveBeenCalledWith('Beauty');
    expect(mockDispatch).toHaveBeenCalledWith('filterByCategory');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('switches between the category and sort tabs', async () => {
    const { getByTestId, queryByTestId } = await render(<ProductFilter />);

    const radioBtn = getByTestId('radioOption-Beauty');

    const sortByBtn = getByTestId('select_sort_filter_button');

    const categoryByBtn = getByTestId('select_category_filter_button');

    expect(radioBtn).toBeTruthy();

    await fireEvent.press(sortByBtn);

    expect(queryByTestId('radioOption-Beauty')).toBeNull();
    expect(getByTestId('radioOption-Price: Low to High')).toBeTruthy();

    await fireEvent.press(categoryByBtn);

    expect(getByTestId('radioOption-Beauty')).toBeTruthy();
    expect(queryByTestId('radioOption-Price: Low to High')).toBeNull();
  });

  it('marks the selected sort option', async () => {
    const { getByTestId, getByText } = await render(<ProductFilter />);

    await fireEvent.press(getByTestId('select_sort_filter_button'));

    await fireEvent.press(getByTestId('radioOption-Name: A to Z'));

    expect(getByText('Name: A to Z selected')).toBeTruthy();
  });

  it('does not sort when no sort option is selected', async () => {
    const { getByTestId } = await render(<ProductFilter />);

    await fireEvent.press(getByTestId('select_sort_filter_button'));

    await fireEvent.press(getByTestId('apply_filter_button'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
