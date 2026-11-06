import api from '../config/axiosConfig';
import { postCartItem } from '../slice/cartSlice/cart.types';

export const addToCardService = async (products: postCartItem[]) => {
  const response = await api.post('carts/add', {
    userId: 1,
    products,
  });

  return response.data;
};

export const updateCartService = async (products: postCartItem[]) => {
  const response = await api.put('carts/1', {
    products,
  });

  return response.data;
};

export const getCartService = async () => {
  const response = await api.get('carts/1');

  return response.data;
};
