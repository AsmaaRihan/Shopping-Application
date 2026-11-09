import { createAsyncThunk } from '@reduxjs/toolkit';
import { addToCardService, fetchCartService, removeCartService, updateCartService } from '../APIs/cartAPI';
import { UpdateCartPayload } from '../slice/cartSlice/cartSlice.types';

export const getCart = createAsyncThunk('cart/getCart', async () => {
  try {
    return await fetchCartService();
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (product: UpdateCartPayload) => {
  try {
    return await addToCardService(product);
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const updateCartQunatity = createAsyncThunk('cart/update', async (product: UpdateCartPayload) => {
  try {
    return await updateCartService(product);
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (id: number) => {
  try {
    return await removeCartService(id);
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
