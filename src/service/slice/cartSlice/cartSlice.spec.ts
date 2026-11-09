import reducer, { addToCart, updateQuantity, removeFromCart, clearCart, fetchCart } from './cartSlice';

import type { CartState, ShoppingCart } from './cart.types';

const initialState: CartState = {
  shoppingCart: null,
  isLoading: false,
  isError: false,
};

const product = {
  id: 1,
  title: 'First product',
  price: 20,
  thumbnail: 'first-image',
  quantity: 2,
};

const secondProduct = {
  id: 2,
  title: 'Second product',
  price: 30,
  thumbnail: 'second-image',
  quantity: 1,
};

const cart: ShoppingCart = {
  id: 1,
  products: [product, secondProduct],
  total: 70,
  totalProducts: 2,
  totalQuantity: 3,
};

const stateWithCart: CartState = {
  shoppingCart: cart,
  isLoading: false,
  isError: false,
};

it('starts with an empty cart state', () => {
  const state = reducer(undefined, { type: 'unknown' });

  expect(state).toEqual(initialState);
});

it('creates a cart and adds a product', () => {
  const state = reducer(initialState, addToCart(product));

  expect(state.shoppingCart).not.toBeNull();

  expect(state.shoppingCart?.products).toEqual([product]);

  expect(state.shoppingCart?.total).toBe(40);
  expect(state.shoppingCart?.totalProducts).toBe(1);
  expect(state.shoppingCart?.totalQuantity).toBe(2);

  expect(state.isError).toBe(false);
});

it('adds a product to an existing cart', () => {
  const state = reducer(
    stateWithCart,
    addToCart({
      id: 3,
      title: 'Third product',
      price: 10,
      thumbnail: 'third-image',
      quantity: 2,
    }),
  );

  expect(state.shoppingCart?.products).toHaveLength(3);
  expect(state.shoppingCart?.total).toBe(90);
  expect(state.shoppingCart?.totalProducts).toBe(3);
  expect(state.shoppingCart?.totalQuantity).toBe(5);
});

it('updates product quantity directly', () => {
  const state = reducer(
    stateWithCart,
    updateQuantity({
      id: 1,
      quantity: 5,
    }),
  );

  expect(state.shoppingCart?.products[0].quantity).toBe(5);
  expect(state.shoppingCart?.total).toBe(130);
  expect(state.shoppingCart?.totalQuantity).toBe(6);
});

it('removes product when updated quantity is zero', () => {
  const state = reducer(
    stateWithCart,
    updateQuantity({
      id: 1,
      quantity: 0,
    }),
  );

  expect(state.shoppingCart?.products).toHaveLength(1);
  expect(state.shoppingCart?.products[0].id).toBe(2);

  expect(state.shoppingCart?.total).toBe(30);
  expect(state.shoppingCart?.totalProducts).toBe(1);
  expect(state.shoppingCart?.totalQuantity).toBe(1);
});

it('removes a product from the cart', () => {
  const state = reducer(stateWithCart, removeFromCart(1));

  expect(state.shoppingCart?.products).toEqual([secondProduct]);
  expect(state.shoppingCart?.total).toBe(30);
  expect(state.shoppingCart?.totalProducts).toBe(1);
  expect(state.shoppingCart?.totalQuantity).toBe(1);
});

it('clears all products but keeps the cart ID', () => {
  const state = reducer(stateWithCart, clearCart());

  expect(state.shoppingCart?.id).toBe(1);
  expect(state.shoppingCart?.products).toEqual([]);
  expect(state.shoppingCart?.total).toBe(0);
  expect(state.shoppingCart?.totalProducts).toBe(0);
  expect(state.shoppingCart?.totalQuantity).toBe(0);
});

it('refetches cart and recalculates totals', () => {
  const state = reducer(
    {
      ...stateWithCart,
      shoppingCart: {
        ...cart,
        total: 999,
        totalProducts: 999,
        totalQuantity: 999,
      },
      isError: true,
    },
    fetchCart(),
  );

  expect(state.shoppingCart?.total).toBe(70);
  expect(state.shoppingCart?.totalProducts).toBe(2);
  expect(state.shoppingCart?.totalQuantity).toBe(3);

  expect(state.isLoading).toBe(false);
});

it('refetches an empty cart without errors', () => {
  const state = reducer(initialState, fetchCart());

  expect(state.shoppingCart).toBeNull();
  expect(state.isLoading).toBe(false);
  expect(state.isError).toBe(false);
});

it('does nothing when removing a product from an empty cart', () => {
  const state = reducer(initialState, removeFromCart(1));

  expect(state).toEqual(initialState);
});
