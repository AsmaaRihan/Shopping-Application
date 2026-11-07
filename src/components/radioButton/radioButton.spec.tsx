import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import RadioButtons from './radioButton';

test('renders options and reports the selected option', async () => {
  const setSelectedOption = jest.fn();

  const options = ['Beauty', 'Home'];

  const { getByTestId } = await render(
    <RadioButtons options={options} selectedOption="Beauty" setSelectedOption={setSelectedOption} />,
  );

  const option_1_button = getByTestId(`${options[0]}_filter_button`);

  fireEvent.press(option_1_button);

  expect(setSelectedOption).toHaveBeenCalledWith(options[0]);
});
