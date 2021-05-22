import '../i18nForTests';

import { render, screen } from '@testing-library/react';

import Home from './Home';

test('should render with title: Welcome!', async () => {
  render(<Home />);
  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});
