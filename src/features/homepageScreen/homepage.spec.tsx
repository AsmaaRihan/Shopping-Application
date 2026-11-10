import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import HomepageScreen from './homepage';
import ScreenNames from '../../rootStack/rootStackType';
import { getProducts } from '../../service/actions/productsAction';
import { resetFilter, setSearchWord } from '../../service/slice/productSlice/productsSlice';

const mockDispatch = jest.fn(() => Promise.resolve());

const mockNavigate = jest.fn();

const mockGetProducts = getProducts as jest.Mock;

const baseProduct = {
  id: 1,
  title: 'Phone',
  price: 100,
  description: 'A phone',
  stock: 5,
  thumbnail: 'image',
  category: 'electronics',
};

const createProductsState = () => ({
  products: [baseProduct],
  categories: [],
  pagination: {
    currentPage: 0,
    limit: 10,
    totalItems: 20,
    totalPages: 2,
    hasNextPage: true,
    hasPreviousPage: false,
  },
  isLoading: false,
  isFetchingNextPage: false,
  isError: false,
  category: '',
  sort: undefined,
  query: '',
});

let mockState = { products: createProductsState() };

jest.mock('../../service/actions/productsAction', () => {
  const actual = jest.requireActual('../../service/actions/productsAction');

  const mockedGetProducts = Object.assign(
    jest.fn(() => 'getProducts'),
    actual.getProducts,
  );

  return {
    ...actual,
    getProducts: mockedGetProducts,
  };
});

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector(mockState),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'home.searchProducts': 'Search products...',
        'home.filter': 'Filter',
        'productsError.title': 'Products unavailable',
        'productsError.description': 'Please try again.',
        'noResults.title': 'No products found',
        'noResults.description': 'Try another search.',
        'noResults.reset': 'Reset filters',
      }[key] ?? key),
  }),
}));

describe('HomepageScreen', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockGetProducts.mockClear();
    mockState = { products: createProductsState() };
  });

  it('fetches and renders products with the search and filter controls', async () => {
    const { getByPlaceholderText, getByText } = await render(<HomepageScreen />);

    expect(mockGetProducts).toHaveBeenCalledWith({
      query: '',
      nextPage: 0,
      category: '',
      sort: undefined,
    });
    expect(getByPlaceholderText('Search products...')).toBeTruthy();
    expect(getByText('Filter')).toBeTruthy();
    expect(getByText('Phone')).toBeTruthy();
  });

  it('dispatches the search term and navigates to the filter screen', async () => {
    const { getByPlaceholderText, getByTestId } = await render(<HomepageScreen />);

    await fireEvent.changeText(getByPlaceholderText('Search products...'), 'tablet');
    await fireEvent.press(getByTestId('filter_by_button'));

    expect(mockDispatch).toHaveBeenCalledWith(setSearchWord('tablet'));
    expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.ProductsFilter);
  });

  it('navigates to product details when selecting a product', async () => {
    const { getByTestId } = await render(<HomepageScreen />);

    await fireEvent.press(getByTestId('product_Item_button'));

    expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.ProductsDetails, {
      productId: baseProduct.id,
    });
  });

  it('fetches the next page when the list reaches the end after scrolling', async () => {
    const { getByTestId } = await render(<HomepageScreen />);

    const list = getByTestId('products-list');

    mockGetProducts.mockClear();

    await act(async () => {
      list.props.onScrollBeginDrag();
      list.props.onEndReached();
      list.props.onEndReached();
    });

    expect(mockGetProducts).toHaveBeenCalledTimes(1);
    expect(mockGetProducts).toHaveBeenCalledWith({
      query: '',
      nextPage: 1,
      category: '',
      sort: undefined,
    });
  });

  it('renders the loader while products are loading', async () => {
    mockState = {
      products: {
        ...createProductsState(),
        isLoading: true,
      },
    };

    const { getByTestId, queryByText } = await render(<HomepageScreen />);

    expect(getByTestId('loader')).toBeTruthy();
    expect(queryByText('Phone')).toBeNull();
  });

  it('renders the error card and refetches products', async () => {
    mockState = {
      products: {
        ...createProductsState(),
        isError: true,
      },
    };

    const { getByTestId } = await render(<HomepageScreen />);
    mockGetProducts.mockClear();

    await fireEvent.press(getByTestId('errorCardRetryButton'));

    expect(mockGetProducts).toHaveBeenCalledWith({
      query: '',
      nextPage: 0,
      category: '',
      sort: undefined,
    });
  });

  it('renders the empty state and resets the search filters', async () => {
    mockState = {
      products: {
        ...createProductsState(),
        products: [],
        pagination: {
          ...createProductsState().pagination,
          hasNextPage: false,
        },
      },
    };

    const { getByTestId } = await render(<HomepageScreen />);

    await fireEvent.press(getByTestId('reset-filter-button'));

    expect(mockDispatch).toHaveBeenCalledWith(resetFilter());
  });
});
