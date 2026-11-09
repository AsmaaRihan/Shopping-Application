import { createSlice } from '@reduxjs/toolkit';

import type { CartState } from './cartSlice.types';
import { addToCart, getCart, removeFromCart, updateCartQunatity } from '../../actions/cartAction';

const initialState: CartState = {
  shoppingCart: null,
  isLoading: false,
  isError: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;

    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shoppingCart = action.payload;
    });
    builder.addCase(getCart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.shoppingCart = action.payload;
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // Update quantity
    builder.addCase(updateCartQunatity.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(updateCartQunatity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.shoppingCart = action.payload;
    });
    builder.addCase(updateCartQunatity.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    //  Remove from cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.shoppingCart = action.payload;
    });
    builder.addCase(removeFromCart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default cartSlice.reducer;
