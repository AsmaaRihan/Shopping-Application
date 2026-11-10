import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategoriesService } from '../APIs/categoriesApi';

export const getCategories = createAsyncThunk('products/categories', async () => {
  try {
    const response = await getCategoriesService();

    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
