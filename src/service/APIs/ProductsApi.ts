import { sortingValues } from '../../features/productFilterScreen/filters.types';
import api from '../config/axiosConfig';

export const getProductsService = ({
  nextPage = 0,
  query = undefined,
  category = undefined,
  sort = undefined,
}: {
  nextPage?: number;
  query?: string;
  category?: String;
  sort?: sortingValues;
}) => {
  const res = api.get('/products', {
    params: {
      page: nextPage,
      search: query || undefined,
      category: category || undefined,
      ...(sort || undefined),
    },
  });

  return res;
};

export const getProductDetailsService = (productId: number) => {
  const res = api.get(`/products/${productId}`);

  return res;
};
