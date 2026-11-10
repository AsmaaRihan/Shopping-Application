import api from '../config/axiosConfig';
import { getCategoriesService } from './categoriesApi';

jest.mock('../config/axiosConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockGet = (api as unknown as { get: jest.Mock }).get;

beforeEach(() => {
  jest.clearAllMocks();
  mockGet.mockResolvedValue({ data: {} });
});

describe('getCategoriesService', () => {
  it('GETs the categories endpoint and returns the axios response untouched', async () => {
    const response = { data: ['Beauty'] };
    mockGet.mockResolvedValue(response);

    await expect(getCategoriesService()).resolves.toBe(response);

    expect(mockGet).toHaveBeenCalledWith('products/categories');
  });

  it('propagates errors', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    await expect(getCategoriesService()).rejects.toThrow('Not found');
  });
});
