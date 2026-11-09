import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductsBySearch, getProductsCategories } from '../../actions/productsAction';
import { CategoryItem, Products } from './product.types';
import { applyFilters } from './utils';

const initialState: Products = {
  productsData: { products: [], limit: 0, total: 0, skip: 0 },
  filteredProducts: [],
  isLoading: true,
  isError: false,
  isFetchingNextPage: false,
  categories: [],
  isCategoriesLoading: false,
  isCategoriesError: false,
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
    builder.addCase(getProducts.pending, (state) => {
      const skip = state.productsData.skip ?? 0;
      if (skip > 0) {
        state.isFetchingNextPage = true;
      } else if (state.productsData.products.length === 0) {
        state.isLoading = true;
      }
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      const skip = action.payload.skip ?? 0;

      const products =
        skip > 0 ? [...state.productsData.products, ...action.payload.products] : action.payload.products;

      state.productsData = { ...action.payload, products };
      state.filteredProducts = products;
      state.isLoading = false;
      state.isFetchingNextPage = false;
    });

    //Categories
    builder.addCase(getProductsCategories.pending, (state) => {
      state.isCategoriesLoading = true;
    });
    builder.addCase(getProductsCategories.rejected, (state) => {
      state.isCategoriesError = true;
      state.isCategoriesLoading = false;
    });
    builder.addCase(getProductsCategories.fulfilled, (state, action) => {
      state.categories = action.payload.map((category: CategoryItem) => category.name);
      state.isCategoriesLoading = false;
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
