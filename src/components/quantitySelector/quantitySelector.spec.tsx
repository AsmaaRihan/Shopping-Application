import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import QuantitySelector from './quantitySelector';

test('emits the next quantity for increment and decrement actions', async () => {
  const onChange = jest.fn();

  const { getByTestId } = await render(<QuantitySelector quantity={2} max={5} onChange={onChange} />);

  const decreaseButton = getByTestId('decreaseQuantityButton');

  const increaseButton = getByTestId('increaseQuantityButton');

  await fireEvent.press(decreaseButton);
  await fireEvent.press(increaseButton);

  expect(onChange).toHaveBeenNthCalledWith(1, 1);

  expect(onChange).toHaveBeenNthCalledWith(2, 3);
});
