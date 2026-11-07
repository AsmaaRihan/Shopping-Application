import reducer from './productDetailsSlice';
import { getProductDetails } from '../../actions/productsAction';

test('stores product details after a successful request', () => {
  const product = { id: 1, title: 'Phone', price: 100 };

  const state = reducer(undefined, getProductDetails.fulfilled(product, 'request-id', 1));

  expect(state.productDetails).toEqual(product);

  expect(state.isLoading).toBe(false);
  expect(state.isError).toBe(false);
});

test('marks product details as loading', () => {
  const state = reducer(undefined, getProductDetails.pending('request-id', 1));

  expect(state.isLoading).toBe(true);
});
