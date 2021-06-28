import { ReactNode } from 'react';
import NavMenu from './NavMenu';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props): JSX.Element {
  return (
    <div>
      <NavMenu title={document.title} />
      <main className="container">{children}</main>
    </div>
  );
}
