import React from 'react';
import { render } from '@testing-library/react-native';
import Loader from './loader';

test('renders the loading indicator', async () => {
  const { getByTestId } = await render(<Loader />);

  expect(getByTestId('loader')).toBeTruthy();
});
