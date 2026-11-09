import api from '../config/axiosConfig';
import { UpdateCartPayload } from '../slice/cartSlice/cartSlice.types';

export const fetchCartService = async () => {
  const response = await api.get('/cart');

  return response.data;
};

export const addToCardService = async (product: UpdateCartPayload) => {
  const response = await api.post('cart/add', {
    ...product,
  });

  return response.data;
};

export const updateCartService = async ({ id, quantity }: UpdateCartPayload) => {
  const response = await api.patch(`cart/update/${id}`, {
    quantity,
  });

  return response.data;
};

export const removeCartService = async (id: number) => {
  const response = await api.delete(`cart/remove/${id}`);

  return response.data;
};
