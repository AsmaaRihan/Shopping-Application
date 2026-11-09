/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Reactotron is loaded in __DEV__ and needs browser APIs that Jest does not provide.
jest.mock('../ReactotronConfig', () => ({}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
