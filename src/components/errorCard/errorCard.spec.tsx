import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ErrorCard from './errorCard';

test('renders the error and invokes refetch', async () => {
  const refetch = jest.fn();

  const { getByText } = await render(<ErrorCard errorText="Failed" buttonText="Retry" refetch={refetch} />);

  fireEvent.press(getByText('Retry'));

  expect(getByText('Failed')).toBeTruthy();
  expect(refetch).toHaveBeenCalledTimes(1);
});
