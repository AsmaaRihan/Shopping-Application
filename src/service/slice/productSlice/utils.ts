import { SortingOptions } from '../../../features/productFilterScreen/filters.types';
import { ProductItem, Products } from './product.types';

export const applyFilters = (state: Products) => {
  let products = [...state.productsData.products];

  // Apply category filter
  if (state.category) {
    // Category names ("Home Decoration") map to product slugs ("home-decoration").
    const categorySlug = state.category.toLowerCase().replace(/\s+/g, '-');

    products = products.filter((product) => product.category === categorySlug);
  }

  sortProducts(products, state.sort);

  state.filteredProducts = products;
};

const sortProducts = (products: ProductItem[], sort: string) => {
  switch (sort) {
    case SortingOptions.sort_price_asc:
      products.sort((a, b) => a.price - b.price);
      break;

    case SortingOptions.sort_price_dec:
      products.sort((a, b) => b.price - a.price);
      break;

    case SortingOptions.sort_name_asc:
      products.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case SortingOptions.sort_name_dec:
      products.sort((a, b) => b.title.localeCompare(a.title));
      break;

    default:
      break;
  }
};
