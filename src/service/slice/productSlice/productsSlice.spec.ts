import { ProductItem } from './product.types';
import reducer, { filterByCategory, resetFilter } from './productsSlice';

test('filters products by category slug', () => {
  const products: ProductItem[] = [
    {
      id: 1,
      title: 'Essence Mascara Lash Princess',
      description:
        'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
      category: 'beauty',
      price: 9.99,
      discountPercentage: 10.48,
      rating: 2.56,
      stock: 99,
      tags: ['beauty', 'mascara'],
    },

    {
      id: 6,
      title: 'Calvin Klein CK One',
      description:
        "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
      category: 'fragrances',
      price: 49.99,
      discountPercentage: 1.89,
      rating: 4.37,
      stock: 29,
      tags: ['fragrances', 'perfumes'],
    },
  ];

  const baseState = {
    productsData: {
      products: products,
      limit: 2,
      total: 2,
      skip: 0,
    },
    filteredProducts: products,
    isLoading: false,
    isError: false,
    categories: [],
    isCategoriesLoading: false,
    isCategoriesError: false,
    category: '',
  };

  const state = reducer(baseState, filterByCategory('Beauty'));

  expect(state.category).toBe('Beauty');
  expect(state.filteredProducts).toHaveLength(1);

  expect(state.filteredProducts?.[0].id).toBe(1);

  const multiWordState = reducer(baseState, filterByCategory('Home Decoration'));

  expect(multiWordState.category).toBe('Home Decoration');
  expect(multiWordState.filteredProducts).toHaveLength(0);

  const clearedState = reducer(baseState, filterByCategory(''));

  expect(clearedState.filteredProducts).toHaveLength(2);
});

test('resets the selected filter', () => {
  const state = reducer(
    {
      productsData: { products: [], limit: 0, total: 0, skip: 0 },
      filteredProducts: [],
      isLoading: false,
      isError: false,
      categories: [],
      isCategoriesLoading: false,
      isCategoriesError: false,
      category: 'Beauty',
    },
    resetFilter(),
  );

  expect(state.category).toBe('');
  expect(state.filteredProducts).toBeUndefined();
});
