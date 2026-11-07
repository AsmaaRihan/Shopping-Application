import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import CartScreen from './cartScreen';
import { updateCart } from '../../service/actions/cartActions';

const mockGoBack = jest.fn();

const mockDispatch = jest.fn((action: unknown): unknown => Promise.resolve({ action }));

const baseShoppingCart = {
  id: 1,
  userId: 1,
  total: 10,
  discountedTotal: 10,
  totalProducts: 1,
  totalQuantity: 1,
  products: [
    {
      id: 1,
      title: 'Test product',
      price: 10,
      quantity: 1,
      total: 10,
      discountPercentage: 0,
      discountedPrice: 10,
      thumbnail: 'test-image',
    },
  ],
};

let mockCart = {
  shoppingCart: baseShoppingCart as typeof baseShoppingCart | null,
  isLoading: false,
  isError: false,
};

jest.mock('../../service/actions/cartActions', () => ({
  updateCart: jest.fn(() => 'updateCart'),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector({ cart: mockCart }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'cart.title': 'My Cart',
        'cart.emptyTitle': 'Your cart is empty',
        'cart.checkoutTitle': 'Checkout',
        'cart.checkoutMessage': 'Proceeding to checkout!',
        'cart.updateErrorMessage': 'Please try again.',
        'common.tryAgain': 'Try again',
      }[key] ?? key),
  }),
}));

describe('CartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCart = { shoppingCart: baseShoppingCart, isLoading: false, isError: false };
  });

  it('renders the cart screen with formatted products', async () => {
    const { getByText, getAllByText } = await render(<CartScreen />);

    expect(getByText('My Cart')).toBeTruthy();
    expect(getByText('Test product')).toBeTruthy();
    expect(getAllByText('€10.00').length).toBeGreaterThan(0);
  });

  it('renders the empty state when there is no cart', async () => {
    mockCart = { ...mockCart, shoppingCart: null };

    const { getByText, getByTestId } = await render(<CartScreen />);

    expect(getByText('Your cart is empty')).toBeTruthy();
    expect(getByTestId('cart-checkout-button')).toBeDisabled();
  });

  it('increases the quantity and syncs the cart', async () => {
    const { getByTestId } = await render(<CartScreen />);

    await fireEvent.press(getByTestId('increaseQuantityButton'));

    expect(updateCart).toHaveBeenCalledWith([{ id: 1, quantity: 2 }]);
    expect(mockDispatch).toHaveBeenCalledWith('updateCart');
  });

  it('removes the item when the quantity drops to zero', async () => {
    const { getByTestId, getByText } = await render(<CartScreen />);

    await fireEvent.press(getByTestId('decreaseQuantityButton'));

    expect(updateCart).toHaveBeenCalledWith([]);
    expect(getByText('Your cart is empty')).toBeTruthy();
  });

  it('removes the item from the delete action', async () => {
    const { getByTestId, getByText } = await render(<CartScreen />);

    const removeItemButton = getByTestId('remove-cart-item-1');
    await fireEvent.press(removeItemButton);

    expect(updateCart).toHaveBeenCalledWith([]);
    expect(getByText('Your cart is empty')).toBeTruthy();
  });

  it('navigates back from the header action', async () => {
    const { getByTestId } = await render(<CartScreen />);

    const goBackButton = getByTestId('cart-back-button');
    await fireEvent.press(goBackButton);

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('opens the checkout alert', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByTestId } = await render(<CartScreen />);

    const checkoutBtn = getByTestId('cart-checkout-button');
    await fireEvent.press(checkoutBtn);

    expect(alertSpy).toHaveBeenCalledWith('Checkout', 'Proceeding to checkout!');

    alertSpy.mockRestore();
  });

  it('shows the error card and retries the sync when the cart update fails', async () => {
    mockCart = { ...mockCart, isError: true };

    const { getByTestId } = await render(<CartScreen />);

    const errorCard = getByTestId('errorCard');

    const retryBtn = getByTestId('errorCardRetryButton');

    expect(errorCard).toBeTruthy();

    await fireEvent.press(retryBtn);

    expect(updateCart).toHaveBeenCalledWith([{ id: 1, quantity: 1 }]);
    expect(mockDispatch).toHaveBeenCalledWith('updateCart');
  });
});
