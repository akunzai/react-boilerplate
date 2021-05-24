import './i18nForTests';

import { render, screen } from '@testing-library/react';

import App from './App';

test('renders without crashing', async () => {
  document.title = 'React Boilerplate';
  render(<App />);
  expect(screen.getByText('React Boilerplate')).toBeInTheDocument();
});
