import api from '../config/axiosConfig';

export const getProductsService = (skip = 0) => {
  const res = api.get('/products', { params: { skip } });

  return res;
};

export const getProductDetailsService = (productId: number) => {
  const res = api.get(`products/${productId}`);

  return res;
};

export const getSortedProductsService = (value: string) => {
  const res = api.get(`products?${value}`);

  return res;
};

export const getProductsCategoriesService = () => {
  const res = api.get('products/categories');

  return res;
};

export const getProductsBySearchService = (value: string) => {
  const res = api.get(`products/search?q=${value}`);

  return res;
};
