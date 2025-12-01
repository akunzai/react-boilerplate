import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import '../i18nForTests';
import { TodoDetail } from './TodoDetail';

beforeAll(() => {
  vi.spyOn(globalThis.console, 'error').mockImplementation(() => undefined);
});

test('without Todo should render nothing', () => {
  render(<TodoDetail id={0} />);
  expect(screen.queryAllByRole('textbox')).toStrictEqual([]);
});

describe('with Todo', () => {
  const setup = () => {
    render(<TodoDetail id={1} />);
  };

  beforeEach(async () => {
    window.history.back = vi.fn();
  });

  test('should renders as expected', async () => {
    setup();
    const title = await screen.findByRole('textbox', {
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
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Close/i }));
    expect(window.history.back).toBeCalled();
  });

  test('should update values and goes back when form submitted', async () => {
    setup();
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
