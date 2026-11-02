export const sortOptions: string[] = [
  'Price: Low to High',
  'Price: High to Low',
  'Name: A to Z',
  'Name: Z to A',
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
