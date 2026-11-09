import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import HomepageScreen from './homepage';
import ScreenNames from '../../rootStack/rootStackType';

const mockDispatch = jest.fn();

const mockNavigate = jest.fn();

jest.mock('../../service/actions/productsAction', () => ({
  getProducts: jest.fn(() => 'getProducts'),
  getProductsBySearch: jest.fn(() => 'getProductsBySearch'),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      products: {
        productsData: {
          products: [{ id: 1, title: 'Phone', price: 100, images: ['image'] }],
          limit: 10,
          total: 1,
          skip: 0,
        },
        filteredProducts: [{ id: 1, title: 'Phone', price: 100, images: ['image'] }],
        isLoading: false,
        isError: false,
        categories: [],
        isCategoriesLoading: false,
        isCategoriesError: false,
        category: '',
      },
    }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'home.searchProducts': 'Search products...',
        'home.filter': 'Filter',
      }[key] ?? key),
  }),
}));

describe('HomepageScreen', () => {
  it('renders products and the search/filter controls', async () => {
    const { getByPlaceholderText, getByText } = await render(<HomepageScreen />);

    expect(getByPlaceholderText('Search products...')).toBeTruthy();
    expect(getByText('Filter')).toBeTruthy();
    expect(getByText('Phone')).toBeTruthy();
  });

  it('navigates to the filter screen when pressing the filter button', async () => {
    const { getByTestId } = await render(<HomepageScreen />);

    const filterBy = getByTestId('filter_by_button');
    await fireEvent.press(filterBy);

    expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.ProductsFilter);
  });
});
