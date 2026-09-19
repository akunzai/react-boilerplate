import { ReactNode } from 'react';
import { NavMenu } from './NavMenu';
import { AuthProvider, ToastProvider } from './shared';

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props): React.JSX.Element {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavMenu title={document.title} />
        <main className="container pb-5">{children}</main>
      </ToastProvider>
    </AuthProvider>
  );
}
