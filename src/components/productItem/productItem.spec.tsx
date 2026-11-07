import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ProductListItem from './productItem';

test('renders a product and invokes its press handler', async () => {
  const onPress = jest.fn();

  const { getByTestId } = await render(
    <ProductListItem
      item={{ id: 1, title: 'Product', price: 20, images: ['image'] } as never}
      onPress={onPress}
    />,
  );

  const productItem = getByTestId('product_Item_button');

  fireEvent.press(productItem);

  expect(onPress).toHaveBeenCalledTimes(1);
});
