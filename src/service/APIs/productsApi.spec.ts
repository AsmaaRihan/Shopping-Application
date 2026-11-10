import api from '../config/axiosConfig';
import { getProductDetailsService, getProductsService } from './productsApi';

jest.mock('../config/axiosConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockGet = (api as unknown as { get: jest.Mock }).get;

const paramsOfLastCall = () => mockGet.mock.calls[0][1].params;

beforeEach(() => {
  jest.clearAllMocks();
  mockGet.mockResolvedValue({ data: {} });
});

describe('getProductsService', () => {
  it('GETs /products and returns the axios response untouched', async () => {
    const response = { data: { products: [] } };
    mockGet.mockResolvedValue(response);

    await expect(getProductsService({})).resolves.toBe(response);

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet.mock.calls[0][0]).toBe('/products');
  });

  it('defaults page to 0 when nextPage is not provided', async () => {
    await getProductsService({});

    expect(paramsOfLastCall().page).toBe(0);
  });

  it('omits search, category, sortBy and order when not provided', async () => {
    await getProductsService({});

    const params = paramsOfLastCall();
    expect(params.search).toBeUndefined();
    expect(params.category).toBeUndefined();
    expect(params).not.toHaveProperty('sortBy');
    expect(params).not.toHaveProperty('order');
  });

  it('converts empty strings to undefined so axios drops them', async () => {
    await getProductsService({ query: '', category: '' });

    const params = paramsOfLastCall();
    expect(params.search).toBeUndefined();
    expect(params.category).toBeUndefined();
  });

  it('maps query to the search param and passes page and category', async () => {
    await getProductsService({ nextPage: 2, query: 'laptop', category: 'electronics' });

    expect(paramsOfLastCall()).toMatchObject({
      page: 2,
      search: 'laptop',
      category: 'electronics',
    });
  });

  it('spreads sort into top-level sortBy and order params', async () => {
    await getProductsService({ sort: { sortBy: 'price', order: 'desc' } });

    const params = paramsOfLastCall();
    expect(params.sortBy).toBe('price');
    expect(params.order).toBe('desc');
    expect(params).not.toHaveProperty('sort');
  });

  it('sends every param together', async () => {
    await getProductsService({
      nextPage: 3,
      query: 'phone',
      category: 'mobile',
      sort: { sortBy: 'title', order: 'asc' },
    });

    expect(paramsOfLastCall()).toEqual({
      page: 3,
      search: 'phone',
      category: 'mobile',
      sortBy: 'title',
      order: 'asc',
    });
  });

  it('propagates errors', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    await expect(getProductsService({})).rejects.toThrow('Network Error');
  });
});

describe('getProductDetailsService', () => {
  it('GETs /products/:id and returns the axios response untouched', async () => {
    const response = { data: { id: 1 } };
    mockGet.mockResolvedValue(response);

    await expect(getProductDetailsService(1)).resolves.toBe(response);

    expect(mockGet).toHaveBeenCalledWith('/products/1');
  });

  it('propagates errors', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    await expect(getProductDetailsService(999)).rejects.toThrow('Not found');
  });
});
