import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import '../i18nForTests';
import { Home } from './Home';

test('should render with title: Welcome!', async () => {
  render(<Home />);
  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});
