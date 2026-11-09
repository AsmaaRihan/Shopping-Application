export enum SortingOptions {
  sort_price_asc = 'Price: Low to High',
  sort_price_dec = 'Price: High to Low',
  sort_name_asc = 'Name: A to Z',
  sort_name_dec = 'Name: Z to A',
}

export const sortOptionsData: string[] = [
  SortingOptions.sort_price_asc,
  SortingOptions.sort_price_dec,
  SortingOptions.sort_name_asc,
  SortingOptions.sort_name_dec,
];

export const sortMap: Record<
  string,
  {
    sortBy: 'price' | 'title';
    order: 'asc' | 'desc';
  }
> = {
  'Price: Low to High': {
    sortBy: 'price',
    order: 'asc',
  },
  'Price: High to Low': {
    sortBy: 'price',
    order: 'desc',
  },
  'Name: A to Z': {
    sortBy: 'title',
    order: 'asc',
  },
  'Name: Z to A': {
    sortBy: 'title',
    order: 'desc',
  },
};

export type FilterOptions = 'category' | 'sort';
