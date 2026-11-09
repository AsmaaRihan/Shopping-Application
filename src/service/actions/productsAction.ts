import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductDetailsService,
  getProductsBySearchService,
  getProductsCategoriesService,
  getProductsService,
  getSortedProductsService,
} from '../APIs/productsApi';

export const getProducts = createAsyncThunk('products', async (nextPage?: number) => {
  try {
    const response = await getProductsService(nextPage);

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const getProductDetails = createAsyncThunk('products/product', async (productId: number) => {
  try {
    const response = await getProductDetailsService(productId);

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const getSortedProducts = createAsyncThunk('products/sortBy', async (value: string) => {
  try {
    const response = await getSortedProductsService(value);

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const getProductsCategories = createAsyncThunk('products/categories', async () => {
  try {
    const response = await getProductsCategoriesService();

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const getProductsBySearch = createAsyncThunk('products/searchBy', async (value: string) => {
  try {
    const response = await getProductsBySearchService(value);

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
