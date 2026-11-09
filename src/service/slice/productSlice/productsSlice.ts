import { createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../../actions/productsAction';
import { Products } from './product.types';

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
  isFetchingNextPage: false,
  isError: false,
  category: '',
  sort: undefined,
  query: '',
};

const ProductsSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    filterByCategory: (state, action) => {
      state.category = action.payload;
    },
    sortBy: (state, action) => {
      state.sort = action.payload;
    },
    setSearchWord: (state, action) => {
      state.query = action.payload;
    },

    resetFilter: (state) => {
      state.category = '';
      state.sort = undefined;
      state.query = '';
    },
  },
  extraReducers: (builder) => {
    //Products
    builder.addCase(getProducts.pending, (state, action) => {
      if (action.meta.arg.nextPage !== undefined && action.meta.arg.nextPage > 0) {
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
        action.meta.arg.nextPage !== undefined && action.meta.arg.nextPage > 0
          ? [...state.products, ...action.payload.products]
          : action.payload.products;
      state.categories = action.payload.categories;
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.isError = false;
      state.isFetchingNextPage = false;
    });
  },
});

export const { filterByCategory, resetFilter, sortBy, setSearchWord } = ProductsSlice.actions;

export default ProductsSlice.reducer;
