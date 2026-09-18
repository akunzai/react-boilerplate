import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import '../i18nForTests';
import { Home } from './Home';

test('should render with title: Welcome!', async () => {
  render(<Home />);
  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});

test('should render stats, progress and up next', async () => {
  render(<Home />);
  const progress = await screen.findByRole('progressbar', { name: 'Progress' });
  await screen.findByText('Read a book');
  expect(progress.getAttribute('aria-valuenow')).toBe('29');
  expect(screen.getByText('Total').nextElementSibling?.textContent).toBe('7');
  expect(screen.getByText('Overdue').nextElementSibling?.textContent).toBe('1');
  expect(screen.getAllByRole('listitem').length).toBe(3);
  expect(screen.queryByText('Pay bills')).not.toBeInTheDocument();
});

test('should dismiss the tip', () => {
  render(<Home />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss tip' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
