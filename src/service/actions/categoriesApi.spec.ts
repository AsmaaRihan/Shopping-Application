import { getCategories } from './categoriesApi';
import { getCategoriesService } from '../APIs/categoriesApi';

jest.mock('../APIs/categoriesApi', () => ({
  getCategoriesService: jest.fn(),
}));

const mockGetCategoriesService = getCategoriesService as jest.Mock;

// Run a thunk without a store and get back its final (fulfilled/rejected) action
const run = <T>(thunk: (dispatch: jest.Mock, getState: () => unknown, extra: undefined) => Promise<T>) =>
  thunk(jest.fn(), () => ({}), undefined);

describe('getCategories', () => {
  const data = ['Beauty', 'Home'];
  beforeEach(() => jest.clearAllMocks());

  it('calls the service to get the categories and returns response.data', async () => {
    mockGetCategoriesService.mockResolvedValue({ data });

    const result = await run(getCategories());

    expect(mockGetCategoriesService).toHaveBeenCalledWith();
    expect(getCategories.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(data);
  });

  it('rejects with the error message when the service fails', async () => {
    mockGetCategoriesService.mockRejectedValue(new Error('Not found'));

    const result = await run(getCategories());

    expect(getCategories.rejected.match(result)).toBe(true);
  });
});
