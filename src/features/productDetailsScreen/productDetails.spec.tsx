import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import ProductDetails from './productDetails';

const mockDispatch = jest.fn((action: unknown): unknown => Promise.resolve({ action }));

const baseProductDetails = {
  id: 1,
  title: 'Phone',
  price: 100,
  stock: 5,
  rating: 4,
  description: 'A phone',
  thumbnail: 'image',
};

let mockState = {
  cart: {
    shoppingCart: { products: [] as { id: number; quantity: number }[] },
    isLoading: false,
    isError: false,
  },
  productDetails: {
    productDetails: baseProductDetails as typeof baseProductDetails | null,
    isLoading: false,
    isError: false,
  },
};

const mockReact = React;

const mockText = Text;

const mockTouchableOpacity = TouchableOpacity;

jest.mock('../../service/actions/productsAction', () => ({
  getProductDetails: jest.fn(() => 'getProductDetails'),
}));

jest.mock('../../components/quantitySelector/quantitySelector', () => {
  return ({ quantity, onChange }: { quantity: number; onChange: (value: number) => void }) =>
    mockReact.createElement(
      mockTouchableOpacity,
      { testID: 'set-over-stock', onPress: () => onChange(quantity + 1) },
      mockReact.createElement(mockText, null, quantity),
    );
});

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector(mockState),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: jest.fn() }),
}));

jest.mock('../../components/addToCartModel/addToCartModal', () => {
  return ({ isVisible, toggleModal }: { isVisible: boolean; toggleModal: () => void }) =>
    isVisible
      ? mockReact.createElement(
          mockTouchableOpacity,
          { testID: 'toggle-cart-modal', onPress: toggleModal },
          mockReact.createElement(mockText, null, 'Cart actions'),
        )
      : null;
});

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'product.selectSizeColor': 'Select size and color',
        'product.quantity': 'Quantity',
        'product.addToCart': 'Add to Cart',
        'product.outOfStock': 'Out of stock',
        'product.outOfStockMessage': 'This product is unavailable',
        'product.addToCartError': "Couldn't add this item to the cart. Please try again.",
        'cart.updateErrorTitle': 'Cart update failed',
        'cart.updateErrorMessage': 'Please try again',
        'common.tryAgain': 'Try again',
        'common.cancel': 'Cancel',
      }[key] ?? key),
  }),
}));

describe('ProductDetailsScreen', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockDispatch.mockImplementation((action: unknown) => Promise.resolve({ action }));
    mockState = {
      ...mockState,
      cart: {
        shoppingCart: { products: [] },
        isLoading: false,
        isError: false,
      },
      productDetails: {
        productDetails: baseProductDetails,
        isLoading: false,
        isError: false,
      },
    };
  });

  it('renders the loader while the product details are loading', async () => {
    mockState = {
      ...mockState,
      productDetails: { ...mockState.productDetails, isLoading: true },
    };

    const { getByTestId, queryByText } = await render(
      <ProductDetails route={{ params: { productId: 1 } }} />,
    );

    expect(getByTestId('loader')).toBeTruthy();
    expect(queryByText('Phone')).toBeNull();
  });

  it('renders the error card and refetches when the product fails to load', async () => {
    mockState = {
      ...mockState,
      productDetails: { ...mockState.productDetails, isError: true },
    };

    const { getByTestId, queryByText } = await render(
      <ProductDetails route={{ params: { productId: 1 } }} />,
    );

    expect(getByTestId('errorCard')).toBeTruthy();
    expect(queryByText('Phone')).toBeNull();

    mockDispatch.mockClear();

    await fireEvent.press(getByTestId('errorCardRetryButton'));

    expect(mockDispatch).toHaveBeenCalledWith('getProductDetails');
  });

  it('renders the error card when no product is returned', async () => {
    mockState = {
      ...mockState,
      productDetails: { ...mockState.productDetails, productDetails: null },
    };

    const { getByTestId, queryByTestId } = await render(
      <ProductDetails route={{ params: { productId: 1 } }} />,
    );

    expect(getByTestId('errorCard')).toBeTruthy();
    expect(queryByTestId('add-to-cart-button')).toBeNull();
  });

  it('renders product details and dispatches add to cart', async () => {
    const { getByText, getByTestId } = await render(<ProductDetails route={{ params: { productId: 1 } }} />);

    expect(getByText('Phone')).toBeTruthy();
    expect(getByText('Add to Cart')).toBeTruthy();

    const addToCartButton = getByTestId('add-to-cart-button');
    await fireEvent.press(addToCartButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows an inline cart error without a retry action', async () => {
    mockState = {
      ...mockState,
      cart: { ...mockState.cart, isError: true },
    };

    const { getByTestId, queryByTestId, getByText } = await render(
      <ProductDetails route={{ params: { productId: 1 } }} />,
    );

    expect(getByTestId('cart-add-error')).toBeTruthy();
    expect(getByText("Couldn't add this item to the cart. Please try again.")).toBeTruthy();
    expect(queryByTestId('errorCardRetryButton')).toBeNull();
  });

  it('toggles cart actions after adding an item', async () => {
    const { getByTestId, queryByTestId } = await render(
      <ProductDetails route={{ params: { productId: 1 } }} />,
    );

    const addToCartButton = getByTestId('add-to-cart-button');
    await fireEvent.press(addToCartButton);

    const cartModal = getByTestId('toggle-cart-modal');

    expect(cartModal).toBeTruthy();

    await fireEvent.press(cartModal);
    expect(queryByTestId('toggle-cart-modal')).toBeNull();
  });

  it('shows an alert when the requested quantity exceeds stock', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockState = {
      ...mockState,
      productDetails: {
        ...mockState.productDetails,
        productDetails: { ...baseProductDetails, stock: 1 },
      },
    };

    const { getByTestId } = await render(<ProductDetails route={{ params: { productId: 1 } }} />);

    const addToCartButton = getByTestId('add-to-cart-button');

    await fireEvent.press(getByTestId('set-over-stock'));
    await fireEvent.press(addToCartButton);

    expect(alertSpy).toHaveBeenCalledWith('Out of stock', 'This product is unavailable');
    alertSpy.mockRestore();
  });
});
