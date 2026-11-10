import { getProductDetailsService, getProductsService } from '../APIs/productsApi';
import { getProductDetails, getProducts } from './productsAction';

jest.mock('../APIs/productsApi', () => ({
  getProductDetailsService: jest.fn(),
  getProductsService: jest.fn(),
}));

const mockGetProductsService = getProductsService as jest.Mock;

const mockGetProductDetailsService = getProductDetailsService as jest.Mock;

// Run a thunk without a store and get back its final (fulfilled/rejected) action
const run = <T>(thunk: (dispatch: jest.Mock, getState: () => unknown, extra: undefined) => Promise<T>) =>
  thunk(jest.fn(), () => ({}), undefined);

describe('getProducts', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes the args to the service and returns response.data', async () => {
    const data = { products: [{ id: 1 }], pagination: { currentPage: 2, hasNextPage: true } };
    mockGetProductsService.mockResolvedValue({ data });

    const args = {
      nextPage: 2,
      query: 'laptop',
      category: 'electronics',
      sort: { sortBy: 'price', order: 'asc' },
    } as const;

    const result = await run(getProducts(args as never));

    expect(mockGetProductsService).toHaveBeenCalledTimes(1);
    expect(mockGetProductsService).toHaveBeenCalledWith(args);
    expect(getProducts.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(data);
  });

  it('works with no filters (browse mode)', async () => {
    mockGetProductsService.mockResolvedValue({ data: { products: [] } });

    const result = await run(getProducts({}));

    expect(mockGetProductsService).toHaveBeenCalledWith({});
    expect(getProducts.fulfilled.match(result)).toBe(true);
  });

  it('rejects with the original error message when the service fails', async () => {
    mockGetProductsService.mockRejectedValue(new Error('Network Error'));

    const result = await run(getProducts({ query: 'x' }));

    expect(getProducts.rejected.match(result)).toBe(true);
  });

  it('exposes the args on meta.arg (used by the reducers for page/append logic)', async () => {
    mockGetProductsService.mockResolvedValue({ data: { products: [] } });

    const result = await run(getProducts({ nextPage: 3 }));

    expect(result.meta.arg).toEqual({ nextPage: 3 });
  });
});

describe('getProductDetails', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls the service with the product id and returns response.data', async () => {
    const data = { id: 1, title: 'Phone' };
    mockGetProductDetailsService.mockResolvedValue({ data });

    const result = await run(getProductDetails(1));

    expect(mockGetProductDetailsService).toHaveBeenCalledWith(1);
    expect(getProductDetails.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(data);
  });

  it('rejects with the error message when the service fails', async () => {
    mockGetProductDetailsService.mockRejectedValue(new Error('Not found'));

    const result = await run(getProductDetails(999));

    expect(getProductDetails.rejected.match(result)).toBe(true);
  });
});
