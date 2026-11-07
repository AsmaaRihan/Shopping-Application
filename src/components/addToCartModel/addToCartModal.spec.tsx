import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import AddToCartModal from './addToCartModal';

const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace }),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'cartModal.title': 'Added to cart',
        'cartModal.message': 'Would you like to resume shopping or continue to checkout?',
        'cartModal.viewCart': 'View Cart',
        'cartModal.continueShopping': 'Continue shopping',
      }[key] ?? key),
  }),
}));

beforeEach(() => {
  mockReplace.mockClear();
});

test('renders the cart actions when visible', async () => {
  const { getByTestId, getByText } = await render(<AddToCartModal isVisible toggleModal={jest.fn()} />);

  const ViewCartButton = getByTestId('view_cart_button');

  expect(getByText('Added to cart')).toBeTruthy();
  expect(ViewCartButton).toBeTruthy();
  expect(getByText('Continue shopping')).toBeTruthy();
});

test('replaces the current screen and closes when viewing the cart', async () => {
  const toggleModal = jest.fn();

  const { getByTestId } = await render(<AddToCartModal isVisible toggleModal={toggleModal} />);

  const ViewCartButton = getByTestId('view_cart_button');
  fireEvent.press(ViewCartButton);

  expect(mockReplace).toHaveBeenCalledWith('CartScreen');
  expect(toggleModal).toHaveBeenCalledTimes(1);
});

test('closes without navigation when continuing shopping', async () => {
  const toggleModal = jest.fn();

  const { getByTestId } = await render(<AddToCartModal isVisible toggleModal={toggleModal} />);

  const continueShoppingButton = getByTestId('continue_shopping_button');

  fireEvent.press(continueShoppingButton);

  expect(toggleModal).toHaveBeenCalledTimes(1);
  expect(mockReplace).not.toHaveBeenCalled();
});
