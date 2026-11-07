import reducer from './cartSlice';
import { getCart, updateCart } from '../../actions/cartActions';

test('starts with an empty cart state', () => {
  const state = reducer(undefined, { type: 'unknown' });

  expect(state.shoppingCart).toBeNull();
  expect(state.isLoading).toBe(false);
  expect(state.isError).toBe(false);
});

test('stores a loaded cart and clears loading state', () => {
  const cart = { id: 1, products: [], total: 0 };

  const state = reducer(
    { shoppingCart: null, isLoading: true, isError: false },
    getCart.fulfilled(cart, 'request-id'),
  );

  expect(state.shoppingCart).toEqual(cart);

  expect(state.isLoading).toBe(false);
});

test('stores an updated cart', () => {
  const cart = { id: 1, products: [], total: 0 };

  const state = reducer(
    { shoppingCart: null, isLoading: true, isError: false },
    updateCart.fulfilled(cart, 'request-id', []),
  );

  expect(state.shoppingCart).toEqual(cart);

  expect(state.isLoading).toBe(false);
});
