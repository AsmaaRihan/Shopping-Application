import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProductDetailsService, getProductsService } from '../APIs/productsApi';
import { sortingValues } from '../../features/productFilterScreen/filters.types';

export const getProducts = createAsyncThunk(
  'products',
  async (args: { nextPage?: number; query?: string; category?: String; sort?: sortingValues }) => {
    try {
      const response = await getProductsService(args);

      return response.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },
);

export const getProductDetails = createAsyncThunk('products/product', async (productId: number) => {
  try {
    const response = await getProductDetailsService(productId);

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
