import reducer from './categoriesSlice';
import { getCategories } from '../../actions/categoriesApi';

const initialState = {
  categories: [],
  isLoading: true,
  isError: false,
};

describe('CategoriesSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('sets isLoading when categories are requested', () => {
    const state = reducer(
      { ...initialState, isLoading: false, isError: true },
      getCategories.pending('request-id'),
    );

    expect(state.isLoading).toBe(true);
    expect(state.isError).toBe(true);
  });

  it('stores categories and clears loading and error flags when fulfilled', () => {
    const state = reducer(
      { ...initialState, isLoading: true, isError: true },
      getCategories.fulfilled({ categories: ['Beauty', 'Home'] }, 'request-id'),
    );

    expect(state.categories).toEqual(['Beauty', 'Home']);
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
  });

  it('sets the error flag and stops loading when rejected', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      getCategories.rejected(new Error('Not found'), 'request-id'),
    );

    expect(state.isError).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('keeps existing categories when the request fails', () => {
    const state = reducer(
      { ...initialState, categories: ['Beauty'], isLoading: true },
      getCategories.rejected(new Error('Not found'), 'request-id'),
    );

    expect(state.categories).toEqual(['Beauty']);
  });
});
