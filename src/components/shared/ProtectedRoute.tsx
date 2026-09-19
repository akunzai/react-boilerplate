import { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from './AuthContext';

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props): React.JSX.Element {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5" data-testid="auth-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const returnUrl = encodeURIComponent(location);
    return <Redirect to={`/login?from=${returnUrl}`} />;
  }

  return <>{children}</>;
}
