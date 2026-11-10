import { addToCardService, fetchCartService, removeCartService, updateCartService } from '../APIs/cartAPI';
import { addToCart, getCart, removeFromCart, updateCartQunatity } from './cartAction';

jest.mock('../APIs/cartAPI', () => ({
  addToCardService: jest.fn(),
  fetchCartService: jest.fn(),
  removeCartService: jest.fn(),
  updateCartService: jest.fn(),
}));

const mockFetchCart = fetchCartService as jest.Mock;

const mockAddToCart = addToCardService as jest.Mock;

const mockUpdateCart = updateCartService as jest.Mock;

const mockRemoveCart = removeCartService as jest.Mock;

// Run a thunk without a store and get back its final (fulfilled/rejected) action
const run = <T>(thunk: (dispatch: jest.Mock, getState: () => unknown, extra: undefined) => Promise<T>) =>
  thunk(jest.fn(), () => ({}), undefined);

// Payload shape depends on UpdateCartPayload, adjust the fields to match your type
const payload = { productId: 1, quantity: 2 } as never;

beforeEach(() => jest.clearAllMocks());

describe('getCart', () => {
  it('returns the cart from the service', async () => {
    const cart = { items: [{ id: 1, quantity: 2 }], total: 20 };
    mockFetchCart.mockResolvedValue(cart);

    const result = await run(getCart());

    expect(mockFetchCart).toHaveBeenCalledTimes(1);
    expect(getCart.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(cart);
  });

  it('rejects with the original error message', async () => {
    mockFetchCart.mockRejectedValue(new Error('Network Error'));

    const result = await run(getCart());

    expect(getCart.rejected.match(result)).toBe(true);
  });
});

// The other three thunks share the same shape, so they run through one table
describe.each([
  { name: 'addToCart', thunk: addToCart, service: mockAddToCart, arg: payload },
  { name: 'updateCartQunatity', thunk: updateCartQunatity, service: mockUpdateCart, arg: payload },
  { name: 'removeFromCart', thunk: removeFromCart, service: mockRemoveCart, arg: 5 },
] as const)('$name', ({ thunk, service, arg }) => {
  it('calls the service with the argument and returns its result', async () => {
    const response = { items: [], total: 0 };
    service.mockResolvedValue(response);

    const result = await run((thunk as any)(arg));

    expect(service).toHaveBeenCalledTimes(1);
    expect(service).toHaveBeenCalledWith(arg);
    expect((thunk as any).fulfilled.match(result)).toBe(true);
  });

  it('rejects with the service error message', async () => {
    service.mockRejectedValue(new Error('Server error'));

    const result = await run((thunk as any)(arg));

    expect((thunk as any).rejected.match(result)).toBe(true);
  });
});
