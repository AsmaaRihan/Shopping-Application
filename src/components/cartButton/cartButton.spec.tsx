import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CartButton from './cartButton';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

test('navigates to the cart when pressed', async () => {
  const { getByTestId } = await render(<CartButton />);

  const goToCartButton = getByTestId('go_to_cart_button');

  fireEvent.press(goToCartButton);

  expect(mockNavigate).toHaveBeenCalled();
});
