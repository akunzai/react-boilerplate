import { render, screen } from '@testing-library/react';
import App from './App';
import './i18nForTests';

test('renders without crashing', async () => {
  document.title = 'React Boilerplate';
  render(<App />);
  expect(screen.getByText('React Boilerplate')).toBeInTheDocument();
});
