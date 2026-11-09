import type { CartItem } from './cart.types';

export const calculateCartTotals = (products: CartItem[]) => ({
  total: Number(products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2)),

  totalProducts: products.length,

  totalQuantity: products.reduce((sum, product) => sum + product.quantity, 0),
});
