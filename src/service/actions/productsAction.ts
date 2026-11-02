import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductsCategoriesService,
  getProductsBySearchService,
  getProductsService,
  getSortedProductsService,
  getProductDetailsService,
} from '../APIs/productsApi';

export const getProducts = createAsyncThunk(
  'products',
  async (skip?: number) => {
    const response = await getProductsService(skip);
    return response.data;
  },
);

export const getProductDetails = createAsyncThunk(
  'products/product',
  async (productId: number) => {
    const response = await getProductDetailsService(productId);
    return response.data;
  },
);

export const getSortedProducts = createAsyncThunk(
  'products/sortBy',
  async (value: string) => {
    const response = await getSortedProductsService(value);
    return response.data;
  },
);

export const getProductsCategories = createAsyncThunk(
  'products/categories',
  async () => {
    const response = await getProductsCategoriesService();
    return response.data;
  },
);

export const getProductsBySearch = createAsyncThunk(
  'products/searchBy',
  async (value: string) => {
    const response = await getProductsBySearchService(value);
    return response.data;
  },
);
