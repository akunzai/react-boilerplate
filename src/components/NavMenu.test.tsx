import { fireEvent, render, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { expect, test } from 'vitest';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import '../i18nForTests';
import { server } from '../mocks/server';
import { NavMenu } from './NavMenu';

const setup = () => {
  const location = memoryLocation({ path: '/', record: true });
  render(
    <Router hook={location.hook}>
      <NavMenu title="Test" />
    </Router>,
  );
  return location;
};

test('should render with title: Test', async () => {
  setup();
  expect(await screen.findByText('Test')).toBeInTheDocument();
});

test('should highlight the active link', async () => {
  setup();
  expect(screen.getByRole('link', { name: 'Home' }).getAttribute('class')).toContain('active');
  expect(screen.getByRole('link', { name: 'Todo' }).getAttribute('class')).not.toContain('active');
});

test('support to toggle navigation', async () => {
  setup();
  const navbar = await screen.findByRole('menu');
  expect(navbar.getAttribute('class')).not.toContain('show');
  fireEvent.click(screen.getByRole('button', { name: /Toggle navigation/i }));
  expect(navbar.getAttribute('class')).toContain('show');
});

test('support to switch languages', async () => {
  setup();
  fireEvent.click(await screen.findByRole('button', { name: /Toggle Languages/i }));
  fireEvent.click(screen.getByRole('button', { name: /English/i }));
  expect(localStorage.getItem('i18nextLng')).toBe('en');
  fireEvent.click(screen.getByRole('button', { name: /Toggle Languages/i }));
  fireEvent.click(screen.getByRole('button', { name: /中文/i }));
  expect(localStorage.getItem('i18nextLng')).toBe('zh-Hant');
});

test('should show the account menu and sign out', async () => {
  const location = setup();
  fireEvent.click(await screen.findByRole('button', { name: 'Account' }));
  expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
  expect(location.history.at(-1)).toBe('/login');
  expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
});

test('should show sign in when there is no current user', async () => {
  server.use(http.get('/api/me', () => new HttpResponse(null, { status: 401 })));
  setup();
  expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
});
