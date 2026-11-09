import { sortingValues } from '../../../features/productFilterScreen/filters.types';

export interface ProductItem {
  id: number;
  title: string;
  price: number;
  description: string;
  stock: number;
  thumbnail: string;
  category: string;
}

export interface Products {
  products: ProductItem[];
  pagination: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  categories: string[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  category: string;
  sort?: sortingValues;
  query: string;
}
