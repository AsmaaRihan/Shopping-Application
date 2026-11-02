export type RootStackParamList = {
  HomepageScreen: undefined;
  ProductsFilterScreen: undefined;
  ProductsDetailsScreen: { productId: number };
  CartScreen: undefined;
};

const ScreenNames = {
  Home: 'HomepageScreen',
  ProductsFilter: 'ProductsFilterScreen',
  ProductsDetails: 'ProductsDetailsScreen',
  Cart: 'CartScreen',
} as const;

export default ScreenNames;
