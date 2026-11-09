import { calculateCartTotals } from './utils';
import type { CartItem } from './cartSlice.types';

const products: CartItem[] = [
  {
    id: 1,
    title: 'First product',
    price: 10,
    thumbnail: 'first-image',
    quantity: 1,
  },
  {
    id: 2,
    title: 'Second product',
    price: 20,
    thumbnail: 'second-image',
    quantity: 2,
  },
];

test('calculates cart totals correctly', () => {
  expect(calculateCartTotals(products)).toEqual({
    total: 50,
    totalProducts: 2,
    totalQuantity: 3,
  });
});

test('returns zero totals for an empty cart', () => {
  expect(calculateCartTotals([])).toEqual({
    total: 0,
    totalProducts: 0,
    totalQuantity: 0,
  });
});

test('calculates totals with decimal prices', () => {
  const decimalProducts: CartItem[] = [
    {
      id: 1,
      title: 'First product',
      price: 19.99,
      thumbnail: 'first-image',
      quantity: 2,
    },
    {
      id: 2,
      title: 'Second product',
      price: 5.5,
      thumbnail: 'second-image',
      quantity: 3,
    },
  ];

  expect(calculateCartTotals(decimalProducts)).toEqual({
    total: 56.48,
    totalProducts: 2,
    totalQuantity: 5,
  });
});

test('counts distinct products separately from total quantity', () => {
  const result = calculateCartTotals(products);

  expect(result.totalProducts).toBe(2);
  expect(result.totalQuantity).toBe(3);
});

test('calculates total when a product has quantity one', () => {
  const singleProduct: CartItem[] = [
    {
      id: 1,
      title: 'First product',
      price: 15,
      thumbnail: 'first-image',
      quantity: 1,
    },
  ];

  expect(calculateCartTotals(singleProduct)).toEqual({
    total: 15,
    totalProducts: 1,
    totalQuantity: 1,
  });
});

test('rounds the total to two decimal places', () => {
  const decimalProducts: CartItem[] = [
    {
      id: 1,
      title: 'First product',
      price: 10.333,
      thumbnail: 'first-image',
      quantity: 3,
    },
  ];

  expect(calculateCartTotals(decimalProducts).total).toBe(31);
});
