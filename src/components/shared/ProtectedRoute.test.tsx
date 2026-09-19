import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import '../../i18nForTests';
import { AuthContext, AuthContextValue } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

function renderWithAuth(authValue: Partial<AuthContextValue>, path = '/protected') {
  const location = memoryLocation({ path, record: true });
  const fullValue: AuthContextValue = {
    user: undefined,
    loading: false,
    setUser: () => undefined,
    login: async () => undefined,
    logout: () => undefined,
    refreshUser: async () => undefined,
    ...authValue,
  };

  render(
    <Router hook={location.hook}>
      <AuthContext.Provider value={fullValue}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    </Router>,
  );

  return location;
}

test('should render loading spinner when auth is loading', () => {
  renderWithAuth({ loading: true });
  expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});

test('should redirect to login with from param when unauthenticated', () => {
  const location = renderWithAuth({ user: undefined, loading: false }, '/settings');
  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  expect(location.history.at(-1)).toBe('/login?from=%2Fsettings');
});

test('should render children when authenticated', () => {
  renderWithAuth({ user: { name: 'Ada', email: 'ada@example.com' }, loading: false });
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});
