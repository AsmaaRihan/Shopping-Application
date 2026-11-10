// cartSlice.test.ts
import reducer from './cartSlice';
import type { CartState } from './cartSlice.types';
import { addToCart, getCart, removeFromCart, updateCartQunatity } from '../../actions/cartAction';

const initialState: CartState = {
  shoppingCart: null,
  isLoading: false,
  isError: false,
};

describe('cartSlice', () => {
  const cart = { items: [{ id: 1, quantity: 2 }], total: 20 } as never;

  const previousCart = { items: [], total: 0 } as never;

  describe('initial state', () => {
    it('returns the initial state for an unknown action', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  // All four thunks have identical reducer behavior, so one table covers them
  describe.each([
    { name: 'getCart', thunk: getCart, arg: undefined },
    { name: 'addToCart', thunk: addToCart, arg: { id: 1, quantity: 2 } },
    { name: 'updateCartQunatity', thunk: updateCartQunatity, arg: { id: 1, quantity: 3 } },
    { name: 'removeFromCart', thunk: removeFromCart, arg: 5 },
  ] as const)('$name', ({ thunk, arg }) => {
    // The arg types differ per thunk, so the action creators are cast once here
    const t = thunk as any;

    it('pending: sets isLoading and clears a previous error', () => {
      const state = reducer({ ...initialState, isError: true }, t.pending('req-id', arg));

      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });

    it('pending: keeps the existing cart while loading', () => {
      const state = reducer({ ...initialState, shoppingCart: previousCart }, t.pending('req-id', arg));

      expect(state.shoppingCart).toBe(previousCart);
    });

    it('fulfilled: stores the payload as the cart and stops loading', () => {
      const state = reducer({ ...initialState, isLoading: true }, t.fulfilled(cart, 'req-id', arg));

      expect(state.shoppingCart).toEqual(cart);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(false);
    });

    it('fulfilled: replaces the previous cart instead of merging', () => {
      const state = reducer(
        { ...initialState, shoppingCart: previousCart },
        t.fulfilled(cart, 'req-id', arg),
      );

      expect(state.shoppingCart).toEqual(cart);
    });

    it('rejected: sets isError, stops loading, and keeps the old cart', () => {
      const state = reducer(
        { ...initialState, isLoading: true, shoppingCart: previousCart },
        t.rejected(new Error('fail'), 'req-id', arg),
      );

      expect(state.isError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.shoppingCart).toBe(previousCart);
    });
  });

  describe('recovery', () => {
    it('a successful request after a failure clears the error', () => {
      let state = reducer(initialState, getCart.rejected(new Error('fail'), 'id-1', undefined));
      expect(state.isError).toBe(true);

      state = reducer(state, getCart.pending('id-2', undefined));
      expect(state.isError).toBe(false);

      state = reducer(state, getCart.fulfilled(cart, 'id-2', undefined));
      expect(state).toEqual({ shoppingCart: cart, isLoading: false, isError: false });
    });
  });
});
