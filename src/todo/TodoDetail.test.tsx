import '../i18nForTests';

import { createMemoryHistory } from 'history';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { ServiceContainer } from 'react-service-container';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoDetail from './TodoDetail';
import TodoService from './TodoService';

beforeAll(() => {
  jest.spyOn(global.console, 'error').mockImplementation(() => undefined);
});

test('without Todo should render nothing', async () => {
  render(
    <ServiceContainer providers={[TodoService]}>
      <MemoryRouter initialEntries={['/todo/0']}>
        <Route path="/todo/:id">
          <TodoDetail />
        </Route>
      </MemoryRouter>
    </ServiceContainer>
  );
  expect(screen.queryAllByRole('textbox')).toStrictEqual([]);
});

describe('with Todo', () => {
  const history = createMemoryHistory();
  history.goBack = jest.fn();
  beforeEach(() => {
    window.history.back = jest.fn();
    render(
      <ServiceContainer providers={[TodoService]}>
        <Router history={history}>
          <Route path="/todo/:id">
            <TodoDetail />
          </Route>
        </Router>
      </ServiceContainer>
    );
    history.push('/todo/1');
  });

  test('should renders as expected', async () => {
    await waitFor(() => {
      expect(screen.getByDisplayValue('Pay bills')).toBeInTheDocument();
    });
    const title = screen.getByRole('textbox', {
      name: /Title/i,
    }) as HTMLInputElement;
    expect(title.value).toBe('Pay bills');
    const description = await screen.findByRole('textbox', {
      name: /Description/i,
    });
    expect(description.textContent).toBe('');
    const done = screen.getByRole('checkbox') as HTMLInputElement;
    expect(done.checked).toBeTruthy();
  });

  test('should goes back when close button clicked', async () => {
    fireEvent.click(await screen.findByRole('button', { name: /Close/i }));
    expect(history.goBack).toBeCalled();
  });

  test('should update values and goes back when form submitted', async () => {
    const input = await screen.findByRole('textbox', {
      name: /Title/i,
    });
    userEvent.clear(input);
    userEvent.type(input, 'Test');
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => {
      expect(history.goBack).toBeCalled();
    });
  });
});
