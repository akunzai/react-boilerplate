import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import '../i18nForTests';
import { Login } from './Login';
import { AuthProvider } from './shared';

const setup = () => {
  const location = memoryLocation({ path: '/login', record: true });
  render(
    <Router hook={location.hook}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </Router>,
  );
  return location;
};

test('should validate required fields', async () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByText('Email is required')).toBeInTheDocument();
  expect(screen.getByText('Password is required')).toBeInTheDocument();
});

test('should validate email format', async () => {
  setup();
  await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
  fireEvent.blur(screen.getByLabelText('Email'));
  expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
});

test('should show an error for wrong credentials', async () => {
  setup();
  await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'wrong');
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
});

test('should sign in and redirect home', async () => {
  const location = setup();
  expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeChecked();
  await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password');
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  await waitFor(() => expect(location.history.at(-1)).toBe('/'));
});

test('should sign in with quick demo button and redirect to return url', async () => {
  const location = memoryLocation({ path: '/login?from=%2Fsettings', record: true });
  render(
    <Router hook={location.hook}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </Router>,
  );
  fireEvent.click(screen.getByRole('button', { name: /Quick Demo Sign In/i }));
  await waitFor(() => expect(location.history.at(-1)).toBe('/settings'));
});
