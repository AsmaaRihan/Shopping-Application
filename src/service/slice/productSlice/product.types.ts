interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductItem {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images?: string[];
  thumbnail?: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface Products {
  productsData: {
    products: ProductItem[];
    total: number;
    skip: number;
    limit: number;
  };
  filteredProducts?: ProductItem[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  category: string;
  sort: string;
  categories: string[];
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
}
