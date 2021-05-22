import '../i18nForTests';

import { fireEvent, render, screen } from '@testing-library/react';

import Counter from './Counter';

beforeEach(() => {
  render(<Counter />);
});

test('should render counter with 0', async () => {
  expect(screen.getByText(/Current count:/).textContent).toContain('Current count: 0');
});

test('should increment the counter on click', async () => {
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText(/Current count:/).textContent).toContain('Current count: 1');
});
