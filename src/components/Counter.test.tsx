import { fireEvent, render, screen } from '@testing-library/react';
import '../i18nForTests';
import { Counter } from './Counter';

const setup = () => render(<Counter />);

test('should render counter with 0', async () => {
  setup();
  expect(screen.getByText(/Current count:/).textContent).toContain(
    'Current count: 0'
  );
});

test('should increment the counter on click', async () => {
  setup();
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText(/Current count:/).textContent).toContain(
    'Current count: 1'
  );
});
