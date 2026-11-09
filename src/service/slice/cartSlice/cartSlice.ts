import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { CartState, ShoppingCart, AddToCartPayload, UpdateCartPayload } from './cart.types';

import { calculateCartTotals } from './utils';

const initialState: CartState = {
  shoppingCart: null,
  isLoading: false,
  isError: false,
};

const updateCartTotals = (cart: ShoppingCart) => {
  const totals = calculateCartTotals(cart.products);

  cart.total = totals.total;
  cart.totalProducts = totals.totalProducts;
  cart.totalQuantity = totals.totalQuantity;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      state.isError = false;

      if (!state.shoppingCart) {
        state.shoppingCart = {
          id: Date.now(),
          products: [],
          total: 0,
          totalProducts: 0,
          totalQuantity: 0,
        };
      }

      const cart = state.shoppingCart;

      const existingProduct = cart.products.find((item) => item.id === action.payload.id);

      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        cart.products.push(action.payload);
      }

      updateCartTotals(cart);
    },

    updateQuantity: (state, action: PayloadAction<UpdateCartPayload>) => {
      if (!state.shoppingCart) return;

      const { id, quantity } = action.payload;

      const cart = state.shoppingCart;

      if (quantity <= 0) {
        cart.products = cart.products.filter((item) => item.id !== id);
      } else {
        const product = cart.products.find((item) => item.id === id);

        if (product) {
          product.quantity = quantity;
        }
      }

      updateCartTotals(cart);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      if (!state.shoppingCart) return;

      state.shoppingCart.products = state.shoppingCart.products.filter((item) => item.id !== action.payload);

      updateCartTotals(state.shoppingCart);
    },

    clearCart: (state) => {
      if (!state.shoppingCart) return;

      state.shoppingCart.products = [];

      updateCartTotals(state.shoppingCart);
    },

    fetchCart: (state) => {
      state.isLoading = true;

      if (state.shoppingCart) {
        updateCartTotals(state.shoppingCart);
      }
      state.isLoading = false;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, fetchCart } = cartSlice.actions;

export default cartSlice.reducer;
