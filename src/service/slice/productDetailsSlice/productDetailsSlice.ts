import { createSlice } from '@reduxjs/toolkit';
import { getProductDetails } from '../../actions/productsAction';
import { ProductItem } from '../productSlice/product.types';

type ProductDetailsType = {
  productDetails?: ProductItem;
  isLoading: boolean;
  isError: boolean;
};

const initialState: ProductDetailsType = {
  isLoading: false,
  isError: false,
};

const ProductDetailsSlice = createSlice({
  name: 'ProductsDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Products Details
    builder.addCase(getProductDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductDetails.rejected, (state) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.productDetails = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

export default ProductDetailsSlice.reducer;
