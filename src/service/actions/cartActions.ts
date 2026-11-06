import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCartItem } from '../slice/cartSlice/cart.types';
import { addToCardService, getCartService, updateCartService } from '../APIs/cartAPI';

export const getCart = createAsyncThunk('cart/getCart', async () => {
  const response = getCartService();

  return response;
});

export const addToCart = createAsyncThunk('cart/addToCart', async (products: postCartItem[]) => {
  const response = addToCardService(products);
  return response;
});

export const updateCart = createAsyncThunk('cart/update', async (products: postCartItem[]) => {
  const response = updateCartService(products);
  return response;
});
