import api from '../config/axiosConfig';
import { addToCardService, getCartService, updateCartService } from './cartAPI';

jest.mock('../config/axiosConfig', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

beforeEach(() => {
  jest.clearAllMocks();
});

test('adds products to a cart', async () => {
  mockedApi.post.mockResolvedValue({ data: { id: 1 } });

  await expect(addToCardService([{ id: 2, quantity: 1 }])).resolves.toEqual({ id: 1 });
  expect(mockedApi.post).toHaveBeenCalledWith('carts/add', {
    userId: 1,
    products: [{ id: 2, quantity: 1 }],
  });
});

test('updates and gets the cart', async () => {
  mockedApi.put.mockResolvedValue({ data: { id: 1 } });
  mockedApi.get.mockResolvedValue({ data: { id: 1 } });

  await updateCartService([{ id: 2, quantity: 3 }]);
  await getCartService();

  expect(mockedApi.put).toHaveBeenCalledWith('carts/1', {
    products: [{ id: 2, quantity: 3 }],
  });
  expect(mockedApi.get).toHaveBeenCalledWith('carts/1');
});
