import { SortingOptions } from '../../../features/productFilterScreen/filters.types';
import type { Products } from './product.types';
import { applyFilters } from './utils';

const productsState = (overrides: Partial<Products> = {}): Products =>
  ({
    productsData: {
      products: [
        {
          id: 1,
          title: 'Banana',
          price: 20,
          category: 'home-decoration',
        },
        {
          id: 2,
          title: 'Apple',
          price: 10,
          category: 'groceries',
        },
        {
          id: 3,
          title: 'Carrot',
          price: 30,
          category: 'groceries',
        },
      ],
    },
    category: '',
    sort: '',
    filteredProducts: [],
    ...overrides,
  } as Products);

test('filters products by category', () => {
  const state = productsState({
    category: 'Groceries',
  });

  applyFilters(state);

  expect(state.filteredProducts).toHaveLength(2);
  expect(state.filteredProducts?.map((product) => product.id)).toEqual([2, 3]);
});

test('converts category names to slugs when filtering', () => {
  const state = productsState({
    category: 'Home Decoration',
  });

  applyFilters(state);

  expect(state.filteredProducts?.map((product) => product.id)).toEqual([1]);
});

test('sorts products by price ascending', () => {
  const state = productsState({
    sort: SortingOptions.sort_price_asc,
  });

  applyFilters(state);

  expect(state.filteredProducts?.map((product) => product.price)).toEqual([10, 20, 30]);
});

test('sorts products by price descending', () => {
  const state = productsState({
    sort: SortingOptions.sort_price_dec,
  });

  applyFilters(state);

  expect(state.filteredProducts?.map((product) => product.price)).toEqual([30, 20, 10]);
});

test('sorts products by name ascending', () => {
  const state = productsState({
    sort: SortingOptions.sort_name_asc,
  });

  applyFilters(state);

  expect(state.filteredProducts?.map((product) => product.title)).toEqual(['Apple', 'Banana', 'Carrot']);
});

test('sorts products by name descending', () => {
  const state = productsState({
    sort: SortingOptions.sort_name_dec,
  });

  applyFilters(state);

  expect(state.filteredProducts?.map((product) => product.title)).toEqual(['Carrot', 'Banana', 'Apple']);
});

test('returns all products when no category is selected', () => {
  const state = productsState();

  applyFilters(state);

  expect(state.filteredProducts).toHaveLength(3);
});

test('does not mutate the original API products array', () => {
  const state = productsState({
    sort: SortingOptions.sort_price_asc,
  });

  const originalProducts = [...state.productsData.products];

  applyFilters(state);

  expect(state.productsData.products).toEqual(originalProducts);
  expect(state.productsData.products.map((product) => product.id)).toEqual([1, 2, 3]);
});

test('returns an empty array when no products match the category', () => {
  const state = productsState({
    category: 'electronics',
  });

  applyFilters(state);

  expect(state.filteredProducts).toEqual([]);
});
