import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import '../i18nForTests';
import { server } from '../mocks/server';
import { Todo } from '../types';
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
    const title = (await screen.findByRole('textbox', {
      name: /Title/i,
    })) as HTMLInputElement;
    expect(title.value).toBe('Pay bills');
    const description = screen.getByRole('textbox', { name: /Description/i });
    expect(description.textContent).toBe('');
    const done = screen.getByRole('checkbox', { name: 'Done' }) as HTMLInputElement;
    expect(done.checked).toBeTruthy();
    expect((screen.getByRole('radio', { name: 'High' }) as HTMLInputElement).checked).toBeTruthy();
    expect(
      (screen.getByRole('checkbox', { name: '#finance' }) as HTMLInputElement).checked,
    ).toBeTruthy();
    expect((screen.getByRole('combobox', { name: 'Category' }) as HTMLSelectElement).value).toBe(
      'personal/errands',
    );
    expect(screen.getByLabelText('Due date')).toHaveValue('2026-01-10');
    expect(screen.getByRole('switch', { name: 'Remind me on the due date' })).not.toBeChecked();
    expect(
      within(screen.getByRole('navigation', { name: 'breadcrumb' })).getByText('Pay bills'),
    ).toBeInTheDocument();
  });

  test('should switch to activity tab', async () => {
    setup();
    fireEvent.click(await screen.findByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('tab', { name: 'Activity' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(screen.getByText('Marked as done')).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /Title/i })).not.toBeInTheDocument();
  });

  test('should goes back when close button clicked', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Close/i }));
    expect(window.history.back).toBeCalled();
  });

  test('should show a validation error for an empty title', async () => {
    setup();
    const input = await screen.findByRole('textbox', { name: /Title/i });
    await userEvent.clear(input);
    fireEvent.blur(input);
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(input.getAttribute('class')).toContain('is-invalid');
  });

  test('should update values and goes back when form submitted', async () => {
    let saved: Todo | undefined;
    server.use(
      http.put('/api/todos/1', async ({ request }) => {
        saved = (await request.json()) as Todo;
        return new HttpResponse(null, { status: 200 });
      }),
    );
    setup();
    const input = await screen.findByRole('textbox', { name: /Title/i });
    await userEvent.clear(input);
    await userEvent.type(input, 'Test');
    fireEvent.click(screen.getByRole('radio', { name: 'Low' }));
    fireEvent.click(screen.getByRole('checkbox', { name: '#home' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Category' }), {
      target: { value: 'work/projects/alpha' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => {
      expect(window.history.back).toBeCalled();
    });
    expect(saved).toMatchObject({
      title: 'Test',
      priority: 'low',
      tags: ['finance', 'urgent', 'home'],
      category: 'work/projects/alpha',
    });
    expect(saved).not.toHaveProperty('notify');
  });

  test('should confirm before deleting', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Delete/ }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('"Pay bills" will be permanently deleted');
    fireEvent.click(within(dialog).getAllByRole('button', { name: 'Cancel' })[1]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
