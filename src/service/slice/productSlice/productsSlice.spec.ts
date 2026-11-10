import reducer, { filterByCategory, resetFilter, setSearchWord, sortBy } from './productsSlice'; // adjust file name
import { getProducts } from '../../actions/productsAction';
import { Products } from './product.types';

const emptyPagination = {
  currentPage: 0,
  limit: -1,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialState = {
  products: [],
  categories: [],
  pagination: emptyPagination,
  isLoading: true,
  isFetchingNextPage: false,
  isError: false,
  category: '',
  sort: undefined,
  query: '',
};

// Adjust to match your ProductItem / Products types
const p1 = { id: 1, title: 'Phone' } as never;

const p2 = { id: 2, title: 'Laptop' } as never;

const p3 = { id: 3, title: 'Tablet' } as never;

const pagination = {
  ...emptyPagination,
  currentPage: 1,
  limit: 10,
  totalItems: 30,
  totalPages: 3,
  hasNextPage: true,
};

const response = (products: unknown[], extra: Record<string, unknown> = {}) => ({
  products,
  categories: ['a', 'b'],
  pagination,
  ...extra,
});

describe('ProductsSlice', () => {
  describe('initial state', () => {
    it('returns the initial state for an unknown action', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('plain reducers', () => {
    it('filterByCategory sets the category', () => {
      expect(reducer(initialState, filterByCategory('electronics')).category).toBe('electronics');
    });

    it('sortBy sets the sort object', () => {
      const sort = { sortBy: 'price', order: 'asc' };
      expect(reducer(initialState, sortBy(sort)).sort).toEqual(sort);
    });

    it('setSearchWord sets the query', () => {
      expect(reducer(initialState, setSearchWord('laptop')).query).toBe('laptop');
    });

    it('resetFilter clears category, sort and query', () => {
      const state = reducer(
        {
          ...initialState,
          category: 'electronics',
          sort: { sortBy: 'price', order: 'asc' } as never,
          query: 'laptop',
        },
        resetFilter(),
      );

      expect(state.category).toBe('');
      expect(state.sort).toBeUndefined();
      expect(state.query).toBe('');
    });

    it('resetFilter leaves products and pagination untouched', () => {
      const state = reducer({ ...initialState, products: [p1] as never, pagination }, resetFilter());

      expect(state.products).toEqual([p1]);
      expect(state.pagination).toEqual(pagination);
    });
  });

  describe('getProducts.pending', () => {
    it('first page (nextPage undefined): sets isLoading', () => {
      const state = reducer({ ...initialState, isLoading: false }, getProducts.pending('id', {}));

      expect(state.isLoading).toBe(true);
      expect(state.isFetchingNextPage).toBe(false);
    });

    it('nextPage = 0: sets isLoading', () => {
      const state = reducer(
        { ...initialState, isLoading: false },
        getProducts.pending('id', { nextPage: 0 }),
      );

      expect(state.isLoading).toBe(true);
      expect(state.isFetchingNextPage).toBe(false);
    });

    it('nextPage > 0: sets isFetchingNextPage and not isLoading', () => {
      const state = reducer(
        { ...initialState, isLoading: false },
        getProducts.pending('id', { nextPage: 1 }),
      );

      expect(state.isFetchingNextPage).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('keeps the existing products while loading', () => {
      const state = reducer({ ...initialState, products: [p1] as never }, getProducts.pending('id', {}));

      expect(state.products).toEqual([p1]);
    });

    it('does not clear a previous error (current behavior)', () => {
      const state = reducer({ ...initialState, isError: true }, getProducts.pending('id', {}));

      expect(state.isError).toBe(true);
    });

    it('a fresh load does not reset a stuck isFetchingNextPage (current behavior)', () => {
      const state = reducer({ ...initialState, isFetchingNextPage: true }, getProducts.pending('id', {}));

      expect(state.isFetchingNextPage).toBe(true);
    });
  });

  describe('getProducts.fulfilled', () => {
    it('first page: replaces products and stores categories and pagination', () => {
      const state = reducer(
        { ...initialState, products: [p3] as never },
        getProducts.fulfilled(response([p1, p2]) as never, 'id', {}),
      );

      expect(state.products).toEqual([p1, p2]);
      expect(state.categories).toEqual(['a', 'b']);
      expect(state.pagination).toEqual(pagination);
    });

    it('nextPage = 0: replaces instead of appending', () => {
      const state = reducer(
        { ...initialState, products: [p3] as never },
        getProducts.fulfilled(response([p1]) as never, 'id', { nextPage: 0 }),
      );

      expect(state.products).toEqual([p1]);
    });

    it('nextPage > 0: appends to the existing products', () => {
      const state = reducer(
        { ...initialState, products: [p1] as never },
        getProducts.fulfilled(response([p2, p3]) as never, 'id', { nextPage: 1 }),
      );

      expect(state.products).toEqual([p1, p2, p3]);
    });

    it('resets loading flags and clears the error', () => {
      const state = reducer(
        { ...initialState, isLoading: true, isFetchingNextPage: true, isError: true },
        getProducts.fulfilled(response([p1]) as never, 'id', {}),
      );

      expect(state.isLoading).toBe(false);
      expect(state.isFetchingNextPage).toBe(false);
      expect(state.isError).toBe(false);
    });

    it('an empty result gives an empty list (search with no matches)', () => {
      const state = reducer(
        { ...initialState, products: [p1] as never },
        getProducts.fulfilled(
          response([], { pagination: { ...pagination, hasNextPage: false } }) as never,
          'id',
          {
            query: 'zzz',
          },
        ),
      );

      expect(state.products).toEqual([]);
      expect(state.pagination.hasNextPage).toBe(false);
    });

    it('overwrites categories with the payload value (undefined if the API omits it)', () => {
      const state = reducer(
        { ...initialState, categories: ['keep'] as never },
        getProducts.fulfilled({ products: [], pagination } as never, 'id', {}),
      );

      // Documents current behavior: categories are wiped when missing from the response
      expect(state.categories).toBeUndefined();
    });

    it('does not modify filter state', () => {
      const sort = { sortBy: 'price', order: 'asc' } as never;

      const state = reducer(
        { ...initialState, category: 'electronics', sort, query: 'phone' },
        getProducts.fulfilled(response([p1]) as never, 'id', {}),
      );

      expect(state.category).toBe('electronics');
      expect(state.sort).toBe(sort);
      expect(state.query).toBe('phone');
    });
  });

  describe('getProducts.rejected', () => {
    it('sets isError and clears both loading flags', () => {
      const state = reducer(
        { ...initialState, isLoading: true, isFetchingNextPage: true },
        getProducts.rejected(new Error('fail'), 'id', {}),
      );

      expect(state.isError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.isFetchingNextPage).toBe(false);
    });

    it('keeps the previously loaded products', () => {
      const state = reducer(
        { ...initialState, products: [p1] as never },
        getProducts.rejected(new Error('fail'), 'id', {}),
      );

      expect(state.products).toEqual([p1]);
    });

    it('treats an aborted request as an error (current behavior)', () => {
      const abortError = Object.assign(new Error('Aborted'), { name: 'AbortError' });

      const state = reducer(
        initialState,
        getProducts.rejected(abortError, 'id', {}, undefined, { aborted: true } as never),
      );

      expect(state.isError).toBe(true);
    });
  });

  describe('pagination flow', () => {
    it('page 1, then page 2 appended, then isFetchingNextPage cleared', () => {
      let state = reducer(initialState, getProducts.pending('id-1', {}));
      state = reducer(state, getProducts.fulfilled(response([p1, p2]) as never, 'id-1', {}));
      expect(state.products).toEqual([p1, p2]);

      state = reducer(state, getProducts.pending('id-2', { nextPage: 1 }));
      expect(state.isFetchingNextPage).toBe(true);

      state = reducer(state, getProducts.fulfilled(response([p3]) as never, 'id-2', { nextPage: 1 }));
      expect(state.products).toEqual([p1, p2, p3]);
      expect(state.isFetchingNextPage).toBe(false);
    });

    it('a new search after paging replaces the list', () => {
      let state: Products = { ...initialState, products: [p1, p2, p3] as never };

      state = reducer(state, getProducts.pending('id', { query: 'phone' }));
      state = reducer(state, getProducts.fulfilled(response([p1]) as never, 'id', { query: 'phone' }));

      expect(state.products).toEqual([p1]);
    });
  });
});
