import Colors from './colors';

test('exposes the shared application color palette', () => {
  expect(Colors.primary).toBe('#007AFF');
  expect(Colors.background).toBe('#FFFFFF');
  expect(Colors.text).toBe('#222222');
  expect(Colors.overlay).toBe('rgba(0, 0, 0, 0.45)');
});
