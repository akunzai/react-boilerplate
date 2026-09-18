import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { expect, test } from 'vitest';
import '../i18nForTests';
import { server } from '../mocks/server';
import { User } from '../types';
import { Settings } from './Settings';
import { ToastProvider } from './shared';

const setup = () =>
  render(
    <ToastProvider>
      <Settings />
    </ToastProvider>
  );

test('should load and save the profile', async () => {
  let saved: User | undefined;
  server.use(
    http.put('/api/me', async ({ request }) => {
      saved = (await request.json()) as User;
      return HttpResponse.json(saved);
    })
  );
  setup();
  const name = screen.getByLabelText('Name');
  await waitFor(() => expect(name).toHaveValue('Ada Lovelace'));
  await userEvent.clear(name);
  await userEvent.type(name, 'Grace Hopper');
  fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Profile saved');
  expect(saved).toEqual({ name: 'Grace Hopper', email: 'ada@example.com' });
});

test('should disable weekly digest when email notifications are off', () => {
  setup();
  const digest = screen.getByRole('switch', { name: 'Weekly digest' });
  expect(digest).toBeEnabled();
  fireEvent.click(screen.getByRole('switch', { name: 'Email notifications' }));
  expect(digest).toBeDisabled();
});

test('should pick a default view', () => {
  setup();
  expect(screen.getByRole('radio', { name: 'Comfortable list' })).toBeChecked();
  fireEvent.click(screen.getByRole('radio', { name: 'Compact list' }));
  expect(screen.getByRole('radio', { name: 'Compact list' })).toBeChecked();
});

test('should validate and reveal the new password', async () => {
  setup();
  const input = screen.getByLabelText('New password');
  expect(input).toHaveAttribute('type', 'password');
  await userEvent.type(input, 'short');
  expect(screen.getByText('Use at least 8 characters')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Change password' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(input).toHaveAttribute('type', 'text');
});

test('should confirm account deactivation', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }));
  const dialog = screen.getByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Deactivate' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Account deactivated');
});
