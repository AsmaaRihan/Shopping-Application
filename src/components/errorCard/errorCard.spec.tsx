import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ErrorCard from './errorCard';

test('renders the error and invokes refetch', async () => {
  const refetch = jest.fn();

  const { getByText } = await render(
    <ErrorCard title="Failed" description="Something went wrong" refetch={refetch} />,
  );

  fireEvent.press(getByText('Try again'));

  expect(getByText('Failed')).toBeTruthy();
  expect(refetch).toHaveBeenCalledTimes(1);
});
