import { createSlice } from '@reduxjs/toolkit';
import {
  getProducts,
  getProductsBySearch,
  getProductsCategories,
  getSortedProducts,
} from '../../actions/productsAction';
import { CategoryItem, Products } from './product.types';

const initialState: Products = {
  productsData: { products: [], limit: 0, total: 0, skip: 0 },
  filteredProducts: [],
  isLoading: true,
  isError: false,
  categories: [],
  isCategoriesLoading: false,
  isCategoriesError: false,
  category: '',
};

const ProductsSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    filterByCategory: (state, action) => {
      state.category = action.payload;
      // Category names ("Home Decoration") map to product slugs ("home-decoration").
      const slug = String(action.payload).toLowerCase().replace(/\s+/g, '-');
      state.filteredProducts = slug
        ? state.productsData.products.filter(p => p.category === slug)
        : state.productsData.products;
    },
    resetFilter: state => {
      state.category = '';

      state.filteredProducts = undefined;
    },
  },
  extraReducers: builder => {
    //Products
    builder.addCase(getProducts.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getProducts.rejected, state => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      const skip = action.payload.skip ?? 0;
      const products =
        skip > 0
          ? [...state.productsData.products, ...action.payload.products]
          : action.payload.products;

      state.productsData = { ...action.payload, products };
      state.filteredProducts = products;
      state.isLoading = false;
    });

    //Sorting
    builder.addCase(getSortedProducts.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getSortedProducts.rejected, state => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getSortedProducts.fulfilled, (state, action) => {
      state.productsData.products = action.payload.products;
      state.filteredProducts = action.payload.products;
      state.isLoading = false;
    });

    //Categories
    builder.addCase(getProductsCategories.pending, state => {
      state.isCategoriesLoading = true;
    });
    builder.addCase(getProductsCategories.rejected, state => {
      state.isCategoriesError = true;
      state.isCategoriesLoading = false;
    });
    builder.addCase(getProductsCategories.fulfilled, (state, action) => {
      state.categories = action.payload.map(
        (category: CategoryItem) => category.name,
      );
      state.isCategoriesLoading = false;
    });

    //SearchQuery
    builder.addCase(getProductsBySearch.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getProductsBySearch.rejected, state => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getProductsBySearch.fulfilled, (state, action) => {
      state.filteredProducts = action.payload.products;
      state.isLoading = false;
    });
  },
});

export const { filterByCategory, resetFilter } = ProductsSlice.actions;

export default ProductsSlice.reducer;
