import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { expect, test } from 'vitest';
import App from './App';
import './i18nForTests';
import { server } from './mocks/server';

test('renders without crashing', async () => {
  document.title = 'React Boilerplate';
  render(<App />);
  expect(screen.getByText('React Boilerplate')).toBeInTheDocument();
});

test('should synchronize auth state across navmenu when signing out and logging back in', async () => {
  render(<App />);
  const accountBtn = await screen.findByRole('button', { name: 'Account' });
  expect(accountBtn).toBeInTheDocument();

  fireEvent.click(accountBtn);
  fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

  expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument();

  await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password');
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

  expect(await screen.findByRole('button', { name: 'Account' })).toBeInTheDocument();
});

test('should guard protected route and support quick demo login', async () => {
  server.use(http.get('/api/me', () => new HttpResponse(null, { status: 401 })));
  render(<App />);

  const quickDemoBtn = await screen.findByRole('button', { name: /Quick Demo Sign In/i });
  expect(quickDemoBtn).toBeInTheDocument();

  fireEvent.click(quickDemoBtn);
  expect(await screen.findByRole('button', { name: 'Account' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
});
