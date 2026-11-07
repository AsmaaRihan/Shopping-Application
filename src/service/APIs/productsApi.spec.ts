import api from '../config/axiosConfig';
import {
  getProductDetailsService,
  getProductsBySearchService,
  getProductsCategoriesService,
  getProductsService,
  getSortedProductsService,
} from './productsApi';

jest.mock('../config/axiosConfig', () => ({
  get: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

test('requests products with the requested filters', async () => {
  mockedApi.get.mockResolvedValue({ data: [] });

  await getProductsService(20);
  await getProductDetailsService(4);
  await getSortedProductsService('sortBy=price&order=asc');
  await getProductsCategoriesService();
  await getProductsBySearchService('phone');

  expect(mockedApi.get).toHaveBeenNthCalledWith(1, '/products', { params: { skip: 20 } });
  expect(mockedApi.get).toHaveBeenNthCalledWith(2, 'products/4');
  expect(mockedApi.get).toHaveBeenNthCalledWith(3, 'products?sortBy=price&order=asc');
  expect(mockedApi.get).toHaveBeenNthCalledWith(4, 'products/categories');
  expect(mockedApi.get).toHaveBeenNthCalledWith(5, 'products/search?q=phone');
});
