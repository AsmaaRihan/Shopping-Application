import reducer from './productDetailsSlice'; // adjust to your file name
import { getProductDetails } from '../../actions/productsAction';

const initialState = {
  isLoading: false,
  isError: false,
};

// Adjust the fields to match ProductItem
const product = { id: 1, title: 'Phone', price: 100 } as never;

const otherProduct = { id: 2, title: 'Laptop', price: 900 } as never;

describe('ProductDetailsSlice', () => {
  describe('initial state', () => {
    it('returns the initial state for an unknown action', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('starts without product details', () => {
      expect(reducer(undefined, { type: 'unknown' }).productDetails).toBeUndefined();
    });
  });

  describe('getProductDetails.pending', () => {
    it('sets isLoading to true', () => {
      const state = reducer(initialState, getProductDetails.pending('req-id', 1));

      expect(state.isLoading).toBe(true);
    });

    it('keeps the existing product while loading', () => {
      const state = reducer(
        { ...initialState, productDetails: product },
        getProductDetails.pending('req-id', 2),
      );

      expect(state.productDetails).toBe(product);
    });

    it('does not clear a previous error', () => {
      const state = reducer({ ...initialState, isError: true }, getProductDetails.pending('req-id', 1));

      // Documents current behavior: pending leaves isError untouched
      expect(state.isError).toBe(true);
    });
  });

  describe('getProductDetails.fulfilled', () => {
    it('stores payload.product (not the whole payload) and stops loading', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        getProductDetails.fulfilled({ product }, 'req-id', 1),
      );

      expect(state.productDetails).toEqual(product);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(false);
    });

    it('replaces the previous product', () => {
      const state = reducer(
        { ...initialState, productDetails: product },
        getProductDetails.fulfilled({ product: otherProduct }, 'req-id', 2),
      );

      expect(state.productDetails).toEqual(otherProduct);
    });

    it('clears a previous error', () => {
      const state = reducer(
        { ...initialState, isError: true },
        getProductDetails.fulfilled({ product }, 'req-id', 1),
      );

      expect(state.isError).toBe(false);
    });
  });

  describe('getProductDetails.rejected', () => {
    it('sets isError and stops loading', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        getProductDetails.rejected(new Error('Not found'), 'req-id', 999),
      );

      expect(state.isError).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('keeps the previously loaded product', () => {
      const state = reducer(
        { ...initialState, productDetails: product },
        getProductDetails.rejected(new Error('fail'), 'req-id', 2),
      );

      expect(state.productDetails).toBe(product);
    });
  });

  describe('recovery', () => {
    it('a successful request after a failure ends with a clean state', () => {
      let state = reducer(initialState, getProductDetails.rejected(new Error('fail'), 'id-1', 1));
      expect(state.isError).toBe(true);

      state = reducer(state, getProductDetails.pending('id-2', 1));
      state = reducer(state, getProductDetails.fulfilled({ product }, 'id-2', 1));

      expect(state).toEqual({ productDetails: product, isLoading: false, isError: false });
    });
  });
});
