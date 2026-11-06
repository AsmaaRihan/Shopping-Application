import { createSlice } from '@reduxjs/toolkit';
import { addToCart, getCart, updateCart } from '../../actions/cartActions';
import { ShoppingCart } from './cart.types';

type ShoppingCartType = {
  shoppingCart: ShoppingCart | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: ShoppingCartType = {
  shoppingCart: null,
  isLoading: false,
  isError: false,
};

const CartSlice = createSlice({
  name: 'Cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get cart
    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCart.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.shoppingCart = action.payload;
      state.isLoading = false;
    });

    //Add To Cart
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.shoppingCart = action.payload;
      state.isLoading = false;
    });

    //Update Cart
    builder.addCase(updateCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCart.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.shoppingCart = action.payload;
      state.isLoading = false;
    });
  },
});

export default CartSlice.reducer;
