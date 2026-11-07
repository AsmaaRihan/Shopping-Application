import config from './index';

test('exposes the API configuration', () => {
  expect(config.URL).toBeTruthy();
  expect(config.TIMEOUT).toBeGreaterThan(0);
});
