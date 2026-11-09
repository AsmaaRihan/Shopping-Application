import { describe, it, expect } from '@jest/globals';

import cartReducer from './cartSlice';
import { addToCart, getCart, removeFromCart, updateCartQunatity } from '../../actions/cartAction';

import type { CartState } from './cartSlice.types';

const mockCart = {
  id: 'cart-123',
  cartItems: [
    {
      id: 'item-123',
      quantity: 2,
      product: {
        id: 'product-123',
        name: 'React Handbook',
      },
    },
  ],
} as unknown as CartState['shoppingCart'];

const initialState: CartState = {
  shoppingCart: null,
  isLoading: false,
  isError: false,
};

describe('cartSlice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe.each([
    ['getCart', getCart],
    ['addToCart', addToCart],
    ['updateCartQunatity', updateCartQunatity],
    ['removeFromCart', removeFromCart],
  ])('%s', (_, asyncAction) => {
    const requestId = 'request-123';

    const args = {} as never;

    it('should set isLoading to true and clear isError when pending', () => {
      const state = cartReducer(
        {
          ...initialState,
          isError: true,
        },
        asyncAction.pending(requestId, args),
      );

      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });

    it('should update shoppingCart when fulfilled', () => {
      const pendingState = cartReducer(initialState, asyncAction.pending(requestId, args));

      const state = cartReducer(pendingState, asyncAction.fulfilled(mockCart, requestId, args));

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.shoppingCart).toEqual(mockCart);
    });

    it('should set isError to true when rejected', () => {
      const pendingState = cartReducer(initialState, asyncAction.pending(requestId, args));

      const state = cartReducer(
        pendingState,
        asyncAction.rejected(new Error('Something went wrong'), requestId, args),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.shoppingCart).toBeNull();
    });
  });
});
