import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import NoResultFound from './noResultFound';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('../../service/slice/productSlice/productsSlice', () => ({
  resetFilter: jest.fn(() => 'resetFilter'),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'noResults.title': 'No products found',
        'noResults.description': 'No matching products',
        'noResults.reset': 'Reset Your Filter',
      }[key] ?? key),
  }),
}));

test('renders the empty state and resets the filter', async () => {
  const { getByText, getByTestId } = await render(<NoResultFound />);

  expect(getByText('No products found')).toBeTruthy();
  fireEvent.press(getByTestId('reset-filter-button'));

  expect(mockDispatch).toHaveBeenCalledWith('resetFilter');
});
