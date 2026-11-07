import i18n from './i18n';

test('initializes English translations', () => {
  expect(i18n.language).toBe('en');
  expect(i18n.t('cart.title')).toBe('My Cart');
  expect(i18n.t('common.tryAgain')).toBe('Try again');
});
