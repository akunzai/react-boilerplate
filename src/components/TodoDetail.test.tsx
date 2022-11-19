import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '../i18nForTests';
import { TodoDetail } from './TodoDetail';

beforeAll(() => {
  jest.spyOn(global.console, 'error').mockImplementation(() => undefined);
});

test('without Todo should render nothing', async () => {
  render(
    <MemoryRouter initialEntries={['/todo/0']}>
      <Routes>
        <Route path='/todo/:id' element={<TodoDetail />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.queryAllByRole('textbox')).toStrictEqual([]);
});

describe('with Todo', () => {
  const setup = async () => {
    render(
      <MemoryRouter initialEntries={['/todo/1']}>
        <Routes>
          <Route path='/todo/:id' element={<TodoDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('Pay bills')).toBeInTheDocument();
    });
  };

  beforeEach(async () => {
    window.history.back = jest.fn();
  });

  test('should renders as expected', async () => {
    await setup();
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
    await setup();
    fireEvent.click(await screen.findByRole('button', { name: /Close/i }));
    expect(window.history.back).toBeCalled();
  });

  test('should update values and goes back when form submitted', async () => {
    await setup();
    const input = await screen.findByRole('textbox', {
      name: /Title/i,
    });
    await userEvent.clear(input);
    await userEvent.type(input, 'Test');
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => {
      expect(window.history.back).toBeCalled();
    });
  });
});
