import { createSlice } from '@reduxjs/toolkit';
import { getCategories } from '../../actions/categoriesApi';

interface CategoriesState {
  categories: string[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: true,
  isError: false,
};

const CategoriesSlice = createSlice({
  name: 'Categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Products
    builder.addCase(getCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload.categories;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

export default CategoriesSlice.reducer;
