import { render, screen } from '@testing-library/react';

import './i18nForTests';
import App from './App';

test('renders without crashing', async () => {
  document.title = 'React Boilerplate';
  render(<App />);
  const linkElement = screen.getByText(/React Boilerplate/i);
  expect(linkElement).toBeInTheDocument();
});
