export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
  quantity: number;
}

export interface ShoppingCart {
  id: number;
  products: CartItem[];
  total: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartState {
  shoppingCart: ShoppingCart | null;
  isLoading: boolean;
  isError: boolean;
}

export type AddToCartPayload = {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
  quantity: number;
};

export type UpdateCartPayload = {
  id: number;
  quantity: number;
};
