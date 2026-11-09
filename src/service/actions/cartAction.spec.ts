import { addToCardService, getCartService, updateCartService } from '../APIs/cartAPI';
import { addToCart, getCart, updateCart } from './cartActions';

jest.mock('@reduxjs/toolkit', () => ({
  createAsyncThunk: (_type: string, handler: (value: never) => Promise<unknown>) => handler,
}));

jest.mock('../APIs/cartAPI', () => ({
  addToCardService: jest.fn(),
  getCartService: jest.fn(),
  updateCartService: jest.fn(),
}));

beforeEach(() => {
  (addToCardService as jest.Mock).mockResolvedValue({ id: 1 });
  (getCartService as jest.Mock).mockResolvedValue({ id: 1 });
  (updateCartService as jest.Mock).mockResolvedValue({ id: 1 });
});

test('delegates cart operations to the API services', async () => {
  (addToCardService as jest.Mock).mockResolvedValue({ id: 1 });
  (getCartService as jest.Mock).mockResolvedValue({ id: 1 });
  (updateCartService as jest.Mock).mockResolvedValue({ id: 1 });

  await expect(addToCart([{ id: 1, quantity: 2 }])).resolves.toEqual({ id: 1 });
  await expect(getCart()).resolves.toEqual({ id: 1 });
  await expect(updateCart([{ id: 1, quantity: 3 }])).resolves.toEqual({ id: 1 });
});

const expectRejection = async (promise: unknown, message: string) => {
  let thrown: Error | undefined;

  try {
    await promise;
  } catch (error) {
    thrown = error as Error;
  }

  expect(thrown?.message).toBe(message);
};

test('rethrows the service error for each cart operation', async () => {
  (addToCardService as jest.Mock).mockImplementation(() => Promise.reject(new Error('add failed')));
  (getCartService as jest.Mock).mockImplementation(() => Promise.reject(new Error('get failed')));
  (updateCartService as jest.Mock).mockImplementation(() => Promise.reject(new Error('update failed')));

  await expectRejection(addToCart([{ id: 1, quantity: 2 }]), 'add failed');
  await expectRejection(getCart(), 'get failed');
  await expectRejection(updateCart([{ id: 1, quantity: 3 }]), 'update failed');
});
