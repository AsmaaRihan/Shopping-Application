import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductsBySearch } from '../../actions/productsAction';
import { Products } from './product.types';
import { applyFilters } from './utils';

const initialState: Products = {
  products: [],
  categories: [],
  pagination: {
    currentPage: 0,
    limit: -1,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isLoading: true,
  isError: false,
  isFetchingNextPage: false,
  filteredProducts: [],
  category: '',
  sort: '',
};

const ProductsSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    filterByCategory: (state, action) => {
      state.category = action.payload;

      applyFilters(state);
    },
    sortBy: (state, action) => {
      state.sort = action.payload;

      applyFilters(state);
    },

    resetFilter: (state) => {
      state.category = '';
      state.sort = '';
      state.filteredProducts = undefined;

      applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    //Products
    builder.addCase(getProducts.pending, (state, action) => {
      if (action.meta.arg !== undefined && action.meta.arg > 0) {
        state.isFetchingNextPage = true;
      } else {
        state.isLoading = true;
      }
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
      state.isFetchingNextPage = false;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products =
        action.meta.arg !== undefined && action.meta.arg > 0
          ? [...state.products, ...action.payload.products]
          : action.payload.products;
      state.categories = action.payload.categories;
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.isError = false;
      state.isFetchingNextPage = false;
    });

    //SearchQuery
    builder.addCase(getProductsBySearch.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductsBySearch.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getProductsBySearch.fulfilled, (state, action) => {
      state.filteredProducts = action.payload.products;
      state.isLoading = false;
    });
  },
});

export const { filterByCategory, resetFilter, sortBy } = ProductsSlice.actions;

export default ProductsSlice.reducer;
