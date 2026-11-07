import { formatShoppingCart } from './utils';
import type { ShoppingCart } from '../../service/slice/cartSlice/cart.types';

const cart: ShoppingCart = {
  id: 1,
  userId: 1,
  total: 30,
  discountedTotal: 27,
  totalProducts: 2,
  totalQuantity: 3,
  products: [
    {
      id: 1,
      title: 'First product',
      price: 10,
      quantity: 1,
      total: 10,
      discountPercentage: 0,
      discountedPrice: 10,
      thumbnail: 'first-image',
    },
    {
      id: 2,
      title: 'Newest product',
      price: 20,
      quantity: 2,
      total: 40,
      discountPercentage: 0,
      discountedPrice: 40,
      thumbnail: 'newest-image',
    },
  ],
};

test('formats cart products newest first', () => {
  expect(formatShoppingCart(cart)).toEqual([
    {
      id: 2,
      name: 'Newest product',
      variant: '',
      price: 20,
      quantity: 2,
      image: 'newest-image',
    },
    {
      id: 1,
      name: 'First product',
      variant: '',
      price: 10,
      quantity: 1,
      image: 'first-image',
    },
  ]);
});

test('does not mutate the API cart products', () => {
  formatShoppingCart(cart);

  expect(cart.products[0].id).toBe(1);
  expect(cart.products[1].id).toBe(2);
});
