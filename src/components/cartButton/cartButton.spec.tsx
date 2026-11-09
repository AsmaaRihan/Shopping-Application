import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CartButton from './cartButton';
import { baseShoppingCart } from '../../features/cartScreen/cartScreen.mock';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  })),
}));

const mockDispatch = jest.fn((action: unknown): unknown => Promise.resolve({ action }));

const mockCart = {
  shoppingCart: baseShoppingCart as typeof baseShoppingCart | null,
  isLoading: false,
  isError: false,
};

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector({ cart: mockCart }),
}));

test('navigates to the cart when pressed', async () => {
  const { getByTestId } = await render(<CartButton />);

  const goToCartButton = getByTestId('go_to_cart_button');

  fireEvent.press(goToCartButton);

  expect(mockNavigate).toHaveBeenCalled();
});
