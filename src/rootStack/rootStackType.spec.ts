import ScreenNames, { type RootStackParamList } from './rootStackType';

test('defines the application stack screen names', () => {
  const productDetailsParams: RootStackParamList['ProductsDetailsScreen'] = { productId: 1 };

  expect(Object.values(ScreenNames)).toEqual([
    'HomepageScreen',
    'ProductsFilterScreen',
    'ProductsDetailsScreen',
    'CartScreen',
  ]);
  expect(productDetailsParams.productId).toBe(1);
});
