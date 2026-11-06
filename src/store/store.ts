import { configureStore } from '@reduxjs/toolkit';
import ProductReducer from '../service/slice/productSlice/productsSlice';
import ProductDetailsReducer from '../service/slice/productDetailsSlice/productDetailsSlice';
import CartReducer from '../service/slice/cartSlice/cartSlice';

export const store = configureStore({
  reducer: {
    products: ProductReducer,
    productDetails: ProductDetailsReducer,
    cart: CartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
