import NavMenu from './NavMenu';

type Props = {
  children: any;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <NavMenu title={document.title} />
      <main className="container">{children}</main>
    </div>
  );
}
