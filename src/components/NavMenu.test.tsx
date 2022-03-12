import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../i18nForTests';
import { NavMenu } from './NavMenu';

const setup = () => render(
  <MemoryRouter>
    <I18nextProvider i18n={i18n}>
      <NavMenu title="Test" />
    </I18nextProvider>
  </MemoryRouter>
);

test('should render with title: Test', () => {
  setup();
  expect(screen.getByText('Test')).toBeInTheDocument();
});

test('support to toggle navigation', () => {
  setup();
  const navbar = screen.getByRole('menu');
  expect(navbar.getAttribute('class')).not.toContain('show');
  fireEvent.click(screen.getByRole('button', { name: /Toggle navigation/i }));
  expect(navbar.getAttribute('class')).toContain('show');
});

test('support to switch languages', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: /Toggle Languages/i }));
  fireEvent.click(screen.getByRole('button', { name: /English/i }));
  expect(localStorage.getItem('i18nextLng')).toBe('en');
  fireEvent.click(screen.getByRole('button', { name: /Toggle Languages/i }));
  fireEvent.click(screen.getByRole('button', { name: /中文/i }));
  expect(localStorage.getItem('i18nextLng')).toBe('zh-Hant');
});
