import { store } from './store';

test('configures the product and cart reducers', () => {
  const state = store.getState();

  expect(state.products).toBeDefined();
  expect(state.productDetails).toBeDefined();
  expect(state.cart).toBeDefined();
});
