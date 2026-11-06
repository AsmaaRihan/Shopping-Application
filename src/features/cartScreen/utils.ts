import type { ShoppingCart } from '../../service/slice/cartSlice/cart.types';

export type FormattedCartItem = {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

export const formatShoppingCart = (cart: ShoppingCart): FormattedCartItem[] => {
  return [...cart.products].reverse().map((product) => ({
    id: product.id,
    name: product.title,
    variant: '',
    price: product.price,
    quantity: product.quantity,
    image: product.thumbnail,
  }));
};
