import api from '../config/axiosConfig';
import { addToCardService, fetchCartService, removeCartService, updateCartService } from './cartAPI';

jest.mock('../config/axiosConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

beforeEach(() => jest.clearAllMocks());

describe('fetchCartService', () => {
  it('GETs /cart and returns response.data', async () => {
    const data = { items: [{ id: 1, quantity: 2 }], total: 20 };
    mockApi.get.mockResolvedValue({ data });

    await expect(fetchCartService()).resolves.toEqual(data);

    expect(mockApi.get).toHaveBeenCalledTimes(1);
    expect(mockApi.get).toHaveBeenCalledWith('/cart');
  });

  it('propagates errors', async () => {
    mockApi.get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchCartService()).rejects.toThrow('Network Error');
  });
});

describe('addToCardService', () => {
  // Adjust the fields to match UpdateCartPayload
  const product = { id: 1, quantity: 2 } as never;

  it('POSTs the product to cart/add and returns response.data', async () => {
    const data = { items: [], total: 0 };
    mockApi.post.mockResolvedValue({ data });

    await expect(addToCardService(product)).resolves.toEqual(data);

    expect(mockApi.post).toHaveBeenCalledWith('cart/add', { id: 1, quantity: 2 });
  });

  it('propagates errors', async () => {
    mockApi.post.mockRejectedValue(new Error('Server error'));

    await expect(addToCardService(product)).rejects.toThrow('Server error');
  });
});

describe('updateCartService', () => {
  it('PATCHes cart/update/:id with only the quantity in the body', async () => {
    const data = { items: [], total: 0 };
    mockApi.patch.mockResolvedValue({ data });

    await expect(updateCartService({ id: 7, quantity: 3 } as never)).resolves.toEqual(data);

    expect(mockApi.patch).toHaveBeenCalledWith('cart/update/7', { quantity: 3 });
  });

  it('does not send the id in the body', async () => {
    mockApi.patch.mockResolvedValue({ data: {} });

    await updateCartService({ id: 7, quantity: 3 } as never);

    const body = mockApi.patch.mock.calls[0][1];
    expect(body).not.toHaveProperty('id');
  });

  it('propagates errors', async () => {
    mockApi.patch.mockRejectedValue(new Error('Server error'));

    await expect(updateCartService({ id: 7, quantity: 3 } as never)).rejects.toThrow('Server error');
  });
});

describe('removeCartService', () => {
  it('DELETEs cart/remove/:id and returns response.data', async () => {
    const data = { items: [], total: 0 };
    mockApi.delete.mockResolvedValue({ data });

    await expect(removeCartService(5)).resolves.toEqual(data);

    expect(mockApi.delete).toHaveBeenCalledWith('cart/remove/5');
  });

  it('propagates errors', async () => {
    mockApi.delete.mockRejectedValue(new Error('Not found'));

    await expect(removeCartService(5)).rejects.toThrow('Not found');
  });
});
