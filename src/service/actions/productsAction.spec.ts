import {
  getProductDetailsService,
  getProductsBySearchService,
  getProductsCategoriesService,
  getProductsService,
  getSortedProductsService,
} from '../APIs/productsApi';
import {
  getProductDetails,
  getProducts,
  getProductsBySearch,
  getProductsCategories,
  getSortedProducts,
} from './productsAction';

jest.mock('@reduxjs/toolkit', () => ({
  createAsyncThunk: (_type: string, handler: (value: never) => Promise<unknown>) => handler,
}));

jest.mock('../APIs/productsApi', () => ({
  getProductDetailsService: jest.fn(),
  getProductsBySearchService: jest.fn(),
  getProductsCategoriesService: jest.fn(),
  getProductsService: jest.fn(),
  getSortedProductsService: jest.fn(),
}));

test('delegates product operations to the API services', async () => {
  const response = { data: { products: [] } };
  (getProductDetailsService as jest.Mock).mockResolvedValue(response);
  (getProductsBySearchService as jest.Mock).mockResolvedValue(response);
  (getProductsCategoriesService as jest.Mock).mockResolvedValue(response);
  (getProductsService as jest.Mock).mockResolvedValue(response);
  (getSortedProductsService as jest.Mock).mockResolvedValue(response);

  await expect(getProductDetails(1)).resolves.toEqual(response.data);
  await expect(getProductsBySearch('phone')).resolves.toEqual(response.data);
  await expect(getProductsCategories()).resolves.toEqual(response.data);
  await expect(getProducts(10)).resolves.toEqual(response.data);
  await expect(getSortedProducts('sortBy=price')).resolves.toEqual(response.data);
});
