import api from '../config/axiosConfig';

export const getCategoriesService = () => {
  const res = api.get(`products/categories`);

  return res;
};
