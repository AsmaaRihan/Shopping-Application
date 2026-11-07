import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCartItem } from '../slice/cartSlice/cart.types';
import { addToCardService, getCartService, updateCartService } from '../APIs/cartAPI';

export const getCart = createAsyncThunk('cart/getCart', async () => {
  try {
    return await getCartService();
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (products: postCartItem[]) => {
  try {
    return await addToCardService(products);
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const updateCart = createAsyncThunk('cart/update', async (products: postCartItem[]) => {
  try {
    return await updateCartService(products);
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
