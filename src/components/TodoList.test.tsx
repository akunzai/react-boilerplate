import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { expect, test } from 'vitest';
import '../i18nForTests';
import { server } from '../mocks/server';
import { TodoList } from './TodoList';

const setup = () => {
  render(<TodoList />);
};

const todoLinks = () =>
  screen.queryAllByRole('link').filter((x) => x.getAttribute('href')?.startsWith('/todo/'));

test('should renders first page as expected', async () => {
  setup();
  await screen.findByText('Pay bills');
  const links = todoLinks();
  expect(links.length).toBe(5);
  expect(links[0].textContent).toContain('Pay bills');
  expect(links[0].getAttribute('href')).toBe('/todo/1');
  expect(links[2].textContent).toContain('Buy eggs');

  const inputs = screen.getAllByRole('checkbox').map((x) => x as HTMLInputElement);
  expect(inputs.length).toBe(5);
  expect(inputs[0].checked).toBeTruthy();
  expect(inputs[1].checked).toBeFalsy();
  expect(screen.getByText('2 of 7 completed')).toBeInTheDocument();
});

test('should show a spinner while loading', () => {
  setup();
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('should show an error alert when loading fails', async () => {
  server.use(http.get('/api/todos', () => new HttpResponse(null, { status: 500 })));
  setup();
  expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load todos');
});

test('should paginate', async () => {
  setup();
  await screen.findByText('Pay bills');
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(todoLinks().map((x) => x.textContent)).toEqual([
    'Write Beta release notes',
    'Book dentist appointment',
  ]);
  expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page');
});

test('should filter by search, status, priority and tag', async () => {
  setup();
  await screen.findByText('Pay bills');
  await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'beta');
  expect(todoLinks().map((x) => x.textContent)).toEqual(['Write Beta release notes']);

  fireEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]);
  fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), { target: { value: 'done' } });
  expect(todoLinks().length).toBe(2);

  fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), { target: { value: 'all' } });
  fireEvent.change(screen.getByRole('combobox', { name: 'Priority' }), { target: { value: 'high' } });
  expect(todoLinks().map((x) => x.textContent)).toEqual(['Pay bills', 'Prepare sprint review']);

  fireEvent.click(screen.getByRole('button', { name: '#finance' }));
  expect(screen.getByRole('button', { name: '#finance' }).getAttribute('aria-pressed')).toBe('true');
  expect(todoLinks().map((x) => x.textContent)).toEqual(['Pay bills']);
});

test('should show empty state when nothing matches', async () => {
  setup();
  await screen.findByText('Pay bills');
  await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'zzz');
  expect(screen.getByText('No todos match your filters')).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[1]);
  expect(todoLinks().length).toBe(5);
});

test('should confirm before removing an item', async () => {
  setup();
  server.use(http.delete('/api/todos/3', () => new HttpResponse(null, { status: 200 })));
  const buttons = await screen.findAllByRole('button', { name: /Close/i });
  fireEvent.click(buttons[2]);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveTextContent('"Buy eggs" will be permanently deleted');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
  await waitForElementToBeRemoved(() => screen.queryByRole('link', { name: /Buy eggs/ }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('should keep item when removal is cancelled', async () => {
  setup();
  const buttons = await screen.findAllByRole('button', { name: /Close/i });
  fireEvent.click(buttons[2]);
  fireEvent.click(within(screen.getByRole('dialog')).getAllByRole('button', { name: 'Cancel' })[1]);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Buy eggs/ })).toBeInTheDocument();
});

test('should update item when checkbox checked', async () => {
  setup();
  const inputs = await screen.findAllByRole('checkbox');
  fireEvent.click(inputs[2]);
  await waitFor(() => {
    expect(todoLinks()[2].getAttribute('class')).toContain('text-decoration-line-through');
  });
});

test('should mark all filtered items done from the split button', async () => {
  setup();
  await screen.findByText('Pay bills');
  fireEvent.click(screen.getByRole('button', { name: /Mark all done/ }));
  await waitFor(() => {
    expect(
      screen.getAllByRole('checkbox').every((x) => (x as HTMLInputElement).checked)
    ).toBeTruthy();
  });
  fireEvent.click(screen.getByRole('button', { name: 'More bulk actions' }));
  fireEvent.click(screen.getByRole('button', { name: 'Mark all active' }));
  await waitFor(() => {
    expect(
      screen.getAllByRole('checkbox').every((x) => !(x as HTMLInputElement).checked)
    ).toBeTruthy();
  });
});

test('should not add item without any input', async () => {
  setup();
  fireEvent.click(await screen.findByRole('button', { name: /Add/i }));
  await screen.findByText('Pay bills');
  expect(todoLinks().length).toBe(5);
});

test('should not add item with blank input', async () => {
  setup();
  await userEvent.type(await screen.findByRole('textbox', { name: 'New todo' }), '   ');
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  await screen.findByText('Pay bills');
  expect(todoLinks().length).toBe(5);
});

test('should add item and clears the input', async () => {
  setup();
  await screen.findByText('Pay bills');
  const input = screen.getByRole('textbox', { name: 'New todo' }) as HTMLInputElement;
  await userEvent.type(input, 'Test');
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  await waitFor(() => expect(input.value).toBe(''));
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  const link = screen.getByRole('link', { name: /Test/i });
  expect(link.getAttribute('href')).toBe('/todo/8');
});
