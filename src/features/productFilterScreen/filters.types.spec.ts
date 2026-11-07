import { sortMap, sortOptions } from './filters.types';

test('provides sort options with matching API mappings', () => {
  expect(sortOptions.length).toBeGreaterThan(0);
  sortOptions.forEach((option) => {
    expect(sortMap[option]).toBeDefined();
    expect(sortMap[option].sortBy).toBeTruthy();
    expect(['asc', 'desc']).toContain(sortMap[option].order);
  });
});
