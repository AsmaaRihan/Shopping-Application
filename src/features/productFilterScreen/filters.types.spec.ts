import { sortMap, sortOptionsData } from './filters.types';

test('provides sort options with matching API mappings', () => {
  expect(sortOptionsData.length).toBeGreaterThan(0);
  sortOptionsData.forEach((option) => {
    expect(sortMap[option]).toBeDefined();
    expect(sortMap[option].sortBy).toBeTruthy();
    expect(['asc', 'desc']).toContain(sortMap[option].order);
  });
});
